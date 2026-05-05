import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createBookingSchema } from "../validators/bookings.validator.js";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const parseId = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;
  const id = Number(idString);
  return !idString || Number.isNaN(id) ? null : id;
};

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            avatar: true
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
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        listing: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
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
    const result = createBookingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const { guestId, listingId, checkIn, checkOut } = result.data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const guest = await prisma.user.findUnique({ where: { id: guestId } });
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY);
    const totalPrice = nights * listing.pricePerNight;

    const booking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          listingId,
          status: "CONFIRMED",
          AND: [
            {
              checkIn: {
                lt: checkOutDate
              }
            },
            {
              checkOut: {
                gt: checkInDate
              }
            }
          ]
        }
      });

      if (conflict) {
        throw new Error("BOOKING_CONFLICT");
      }

      return tx.booking.create({
        data: {
          guestId,
          listingId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice,
          status: "PENDING"
        }
      });
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === "BOOKING_CONFLICT") {
      return res.status(409).json({ message: "Booking dates overlap an existing confirmed booking" });
    }

    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
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
    const id = parseId(req.params.id);
    const { status } = req.body;

    if (id === null) {
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
