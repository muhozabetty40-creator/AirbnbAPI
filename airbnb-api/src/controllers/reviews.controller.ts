import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { getCache, setCache, deleteCache } from "../config/cache.js";

const parseId = (v: string | string[] | undefined): number | null => {
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return !s || Number.isNaN(n) ? null : n;
};

const parsePage = (page: unknown, limit: unknown) => {
  const p = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const l = Math.max(1, parseInt(String(limit || "10"), 10) || 10);
  return { page: p, limit: l, skip: (p - 1) * l };
};

export const getListingReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid listing id" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const cacheKey = `reviews:listing:${id}:${p}:${l}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where: { listingId: id },
        skip,
        take: l,
        include: { user: { select: { name: true, avatar: true } } },
      }),
      prisma.review.count({ where: { listingId: id } }),
    ]);

    const result = { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } };
    setCache(cacheKey, result, 30);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listingId = parseId(req.params.id);
    if (listingId === null) return res.status(400).json({ message: "Invalid listing id" });

    const { userId, rating, comment } = req.body;
    if (!userId || rating === undefined || !comment) {
      return res.status(400).json({ message: "Missing required fields: userId, rating, comment" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const review = await prisma.review.create({
      data: { userId: Number(userId), listingId, rating: Number(rating), comment },
    });

    deleteCache(`reviews:listing:${listingId}:1:10`);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid review id" });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await prisma.review.delete({ where: { id } });
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
