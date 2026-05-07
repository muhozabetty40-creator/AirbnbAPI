import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { getCache, setCache, deleteCache } from "../config/cache.js";

const parseId = (v: string | string[] | undefined): string | null => {
  const s = Array.isArray(v) ? v[0] : v;
  return s || null;
};

const parsePage = (page: unknown, limit: unknown) => {
  const p = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const l = Math.max(1, parseInt(String(limit || "10"), 10) || 10);
  return { page: p, limit: l, skip: (p - 1) * l };
};

export const searchListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, type, minPrice, maxPrice, guests, page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const where: Record<string, unknown> = {};
    if (location) where.location = { contains: String(location), mode: "insensitive" };
    if (type) where.type = { equals: String(type), mode: "insensitive" };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerNight = {
        ...(minPrice !== undefined && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { lte: Number(maxPrice) }),
      };
    }
    if (guests) where.guests = { gte: Number(guests) };

    const [data, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: l,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const cacheKey = `listings:${p}:${l}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const [data, total] = await Promise.all([
      prisma.listing.findMany({ skip, take: l, include: { user: { select: { name: true, email: true } } } }),
      prisma.listing.count(),
    ]);

    const result = { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
    setCache(cacheKey, result, 60);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid listing id" });

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, location, pricePerNight, guests, type, amenities, userId } = req.body;
    if (!title || !description || !location || !pricePerNight || !guests || !type || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const listing = await prisma.listing.create({
      data: { title, description, location, pricePerNight: Number(pricePerNight), guests: Number(guests), type, amenities: amenities || [], userId },
    });

    deleteCache("listings:stats");
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid listing id" });

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Listing not found" });

    const listing = await prisma.listing.update({ where: { id }, data: req.body });
    deleteCache("listings:stats");
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid listing id" });

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    await prisma.listing.delete({ where: { id } });
    deleteCache("listings:stats");
    res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
};
