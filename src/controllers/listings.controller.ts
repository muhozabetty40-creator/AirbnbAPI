import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "./auth.controller.js";

const parseId = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;
  const id = Number(idString);
  return !idString || Number.isNaN(id) ? null : id;
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany();
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Error fetching listings" });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ message: "Error fetching listing" });
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  const { title, location, pricePerNight, guest, type, amenities } = req.body;

  if (!title || !location || !pricePerNight || !guest || !type || !amenities) {
    return res.status(400).json({ message: "Title, location, price per night, guest, type, and amenities are required" });
  }

  const validTypes = ["APARTMENT", "HOUSE", "VILLA", "CABIN"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Type must be one of: APARTMENT, HOUSE, VILLA, CABIN" });
  }

  if (!Array.isArray(amenities)) {
    return res.status(400).json({ message: "Amenities must be an array of strings" });
  }

  if (pricePerNight <= 0 || guest <= 0) {
    return res.status(400).json({ message: "Price per night and guest count must be positive values" });
  }

  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const newListing = await prisma.listing.create({
      data: {
        title,
        location,
        pricePerNight,
        type,
        guest,
        amenities,
        hostId: req.userId,
      },
    });
    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Error creating listing" });
  }
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.hostId !== req.userId && req.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const { hostId, ...updateData } = req.body;

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Error updating listing" });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.hostId !== req.userId && req.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await prisma.listing.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Error deleting listing" });
  }
};

