import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

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
