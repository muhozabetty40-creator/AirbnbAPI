import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const parseDate = (value: unknown): Date | null => {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        guest: {
          select: {
            id: true,
            name: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        listing: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { guestId, listingId, checkIn, checkOut } = req.body;

    if (!guestId || !listingId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);

    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Invalid check-in or check-out dates" });
    }

    const guest = await prisma.user.findUnique({ where: { id: Number(guestId) } });
    const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY);

    if (nights < 1) {
      return res.status(400).json({ message: "Booking must be at least one night" });
    }

    const totalPrice = nights * listing.pricePerNight;

    const booking = await prisma.booking.create({
      data: {
        guestId: Number(guestId),
        listingId: Number(listingId),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: "PENDING"
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};
