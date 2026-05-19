import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const parseId = (v: string | string[] | undefined): string | null => {
  const s = Array.isArray(v) ? v[0] : v;
  return s || null;
};

const parsePage = (page: unknown, limit: unknown) => {
  const p = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const l = Math.max(1, parseInt(String(limit || "10"), 10) || 10);
  return { page: p, limit: l, skip: (p - 1) * l };
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.user.findMany({ skip, take: l, select: { id: true, name: true, email: true, username: true, role: true, avatar: true, createdAt: true } }),
      prisma.user.count(),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, username: true, phone: true, role: true, avatar: true, bio: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, username: true, phone: true, role: true, avatar: true, bio: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, username, phone, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(phone && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: { id: true, name: true, email: true, username: true, phone: true, role: true, avatar: true, bio: true, createdAt: true },
    });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "airbnb/avatars",
          resource_type: "auto",
          public_id: `avatar_${req.userId}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file!.buffer);
    });

    const uploadResult = result as any;

    res.json({
      message: "Avatar uploaded successfully",
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, username, phone, role, avatar, bio } = req.body;
    if (!name || !email || !username || !phone) {
      return res.status(400).json({ message: "Missing required fields: name, email, username, phone" });
    }

    const user = await prisma.user.create({ data: { name, email, username, phone, role, avatar, bio } });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await prisma.user.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId: id },
        skip,
        take: l,
        include: { listing: { select: { title: true, location: true } } },
      }),
      prisma.booking.count({ where: { userId: id } }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.listing.findMany({
        where: { userId: id },
        skip,
        take: l,
      }),
      prisma.listing.count({ where: { userId: id } }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};


export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: id },
        skip,
        take: l,
        include: { booking: { include: { listing: { select: { title: true } } } } },
      }),
      prisma.review.count({ where: { userId: id } }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const getUserMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            { senderId: id },
            { receiverId: id },
          ],
        },
        skip,
        take: l,
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: id },
            { receiverId: id },
          ],
        },
      }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const getUserWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid user id" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate earnings from confirmed bookings
    const bookings = await prisma.booking.findMany({
      where: {
        listing: { userId: id },
        status: "confirmed",
      },
      include: { listing: true },
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.total, 0);

    res.json({
      userId: id,
      totalEarnings,
      bookings: bookings.length,
      balance: totalEarnings,
    });
  } catch (error) {
    next(error);
  }
};
