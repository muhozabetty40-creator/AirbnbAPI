import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createUserSchema, updateUserSchema } from "../validators/users.validator.js";

const getIdFromParam = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;
  const id = Number(idString);
  return !idString || Number.isNaN(id) ? null : id;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            listings: true
          }
        }
      }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromParam(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "HOST") {
      const listings = await prisma.listing.findMany({
        where: { hostId: id },
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        }
      });

      return res.json({ ...user, listings });
    }

    const bookings = await prisma.booking.findMany({
      where: { guestId: id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            pricePerNight: true
          }
        }
      }
    });

    res.json({ ...user, bookings });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: result.data.email }, { username: result.data.username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...result.data,
        password: hashedPassword
      }
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromParam(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const data = { ...result.data };

    if (typeof data.password === "string") {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromParam(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromParam(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listings = await prisma.listing.findMany({
      where: { hostId: id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getIdFromParam(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { guestId: id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            pricePerNight: true
          }
        }
      }
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
