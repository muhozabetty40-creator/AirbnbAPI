import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

const listingTypes = new Set(["APARTMENT", "HOUSE", "VILLA", "CABIN"]);
const sortFields = new Set(["pricePerNight", "createdAt"]);

const getString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const parseId = (value: string | string[] | undefined): number | null => {
  const idString = getString(value);

  if (!idString) {
    return null;
  }

  const id = Number(idString);
  return Number.isNaN(id) ? null : id;
};

const parseNumber = (value: unknown): number | null => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
};

export const getAllListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, type, maxPrice, page = "1", limit = "10", sortBy, order = "asc" } = req.query;
    const where: Record<string, unknown> = {};

    if (location) {
      where.location = {
        contains: String(location),
        mode: "insensitive"
      };
    }

    if (type) {
      const normalizedType = String(type).trim().toUpperCase();

      if (!listingTypes.has(normalizedType)) {
        return res.status(400).json({ message: "Invalid listing type" });
      }

      where.type = normalizedType;
    }

    const maxPriceNumber = parseNumber(maxPrice);

    if (maxPrice !== undefined) {
      if (maxPriceNumber === null) {
        return res.status(400).json({ message: "Invalid maxPrice value" });
      }

      where.pricePerNight = {
        lte: maxPriceNumber
      };
    }

    const pageNumber = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNumber = Math.max(1, parseInt(String(limit), 10) || 10);
    const skip = (pageNumber - 1) * limitNumber;
    const sortField = sortFields.has(String(sortBy)) ? String(sortBy) : "createdAt";
    const sortOrder = String(order).toLowerCase() === "desc" ? "desc" : "asc";

    const listings = await prisma.listing.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        [sortField]: sortOrder
      },
      select: {
        id: true,
        title: true,
        location: true,
        pricePerNight: true,
        host: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        host: true,
        bookings: true
      }
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      guests,
      type,
      amenities,
      rating,
      hostId
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      pricePerNight === undefined ||
      guests === undefined ||
      !type ||
      !amenities ||
      hostId === undefined
    ) {
      return res.status(400).json({ message: "Missing required listing fields" });
    }

    if (!Array.isArray(amenities)) {
      return res.status(400).json({ message: "Amenities must be an array" });
    }

    const normalizedType = String(type).trim().toUpperCase();

    if (!listingTypes.has(normalizedType)) {
      return res.status(400).json({ message: "Invalid listing type" });
    }

    const host = await prisma.user.findUnique({ where: { id: Number(hostId) } });

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        location,
        pricePerNight: Number(pricePerNight),
        guests: Number(guests),
        type: normalizedType as any,
        amenities,
        rating: rating === undefined ? undefined : Number(rating),
        hostId: Number(hostId)
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const existing = await prisma.listing.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const data: Record<string, unknown> = { ...req.body };

    if (data.type) {
      const normalizedType = String(data.type).trim().toUpperCase();

      if (!listingTypes.has(normalizedType)) {
        return res.status(400).json({ message: "Invalid listing type" });
      }

      data.type = normalizedType;
    }

    if (data.hostId !== undefined) {
      const host = await prisma.user.findUnique({ where: { id: Number(data.hostId) } });

      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }
    }

    if (data.pricePerNight !== undefined) {
      data.pricePerNight = Number(data.pricePerNight);
    }

    if (data.guests !== undefined) {
      data.guests = Number(data.guests);
    }

    if (data.rating !== undefined) {
      data.rating = Number(data.rating);
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data
    });

    res.json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
