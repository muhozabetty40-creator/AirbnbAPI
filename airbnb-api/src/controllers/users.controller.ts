import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

const getIdFromParam = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;

  if (!idString) {
    return null;
  }

  const id = Number(idString);
  return Number.isNaN(id) ? null : id;
};

const normalizeRole = (value: unknown): "HOST" | "GUEST" | null => {
  if (typeof value !== "string") {
    return null;
  }

  const upper = value.trim().toUpperCase();
  return upper === "HOST" || upper === "GUEST" ? upper : null;
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
      include: {
        listings: true,
        bookings: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, username, phone, role, avatar, bio } = req.body;
    const normalizedRole = normalizeRole(role);

    if (!name || !email || !username || !phone || !normalizedRole) {
      return res.status(400).json({ message: "Missing or invalid required user fields" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        phone,
        role: normalizedRole,
        avatar,
        bio
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

    const data: Record<string, unknown> = { ...req.body };

    if (data.role) {
      const normalizedRole = normalizeRole(data.role);

      if (!normalizedRole) {
        return res.status(400).json({ message: "Invalid role value" });
      }

      data.role = normalizedRole;
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

    const listings = await prisma.listing.findMany({ where: { hostId: id } });
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
        listing: true
      }
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
