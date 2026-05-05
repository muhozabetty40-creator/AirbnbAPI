import prisma from "../config/prisma.js";
import type { Response } from "express";
import type { AuthRequest } from "./auth.controller.js";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const parseId = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;
  const id = Number(idString);
  return !idString || Number.isNaN(id) ? null : id;
};

export const getAllBookings = async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { listingId, checkIn, checkOut } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!listingId || !checkIn || !checkOut) {
    return res.status(400).json({ message: "listingId, checkIn, and checkOut are required" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ message: "checkIn and checkOut must be valid dates" });
  }

  if (checkInDate >= checkOutDate) {
    return res.status(400).json({ message: "checkIn must be before checkOut" });
  }

  if (checkInDate < new Date()) {
    return res.status(400).json({ message: "checkIn must be in the future" });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        listingId,
        status: "CONFIRMED",
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({ message: "Booking dates overlap an existing confirmed booking" });
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY);
    const totalPrice = nights * listing.pricePerNight;

    const booking = await prisma.booking.create({
      data: {
        listingId,
        guestId: req.userId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: "PENDING",
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.guestId !== req.userId && req.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    res.status(200).json(cancelledBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  const data: Record<string, unknown> = {};
  const { checkIn, guestId, totalPrice, listingId, status } = req.body;

  if (checkIn) {
    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
      return res.status(400).json({ message: "checkIn must be a valid date" });
    }
    data.checkIn = checkInDate;
  }

  if (guestId) data.guestId = guestId;
  if (totalPrice) data.totalPrice = totalPrice;
  if (listingId) data.listingId = listingId;
  if (status) data.status = status;

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data,
    });
    res.status(200).json({ message: "Updating booking successful", updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking" });
  }
};
