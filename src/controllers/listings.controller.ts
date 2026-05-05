import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "./auth.controller.js";


// GET all listings
export const getAllListings = async (req: Request, res: Response) => {
    try {
        const listings = await prisma.listing.findMany();
        res.status(200).json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: "Error fetching listings" });
    }
};

// GET listing by ID
export const getListingById = async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  try {
    const listing = await prisma.listing.findUnique({
      where: { id }
    });

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json(listing);
   }
    catch (error) { 
        console.error("Error fetching listing:", error);
        res.status(500).json({ message: "Error fetching listing" });
    }
};

// POST new listing
export const createListing = async (req: AuthRequest, res: Response) => {
  const { title, location, pricePerNight, guest, type, amenities } = req.body;

  if (!title || !location || !pricePerNight || !guest || !type || !amenities) {
    return res.status(400).json({
      message: "Title, location, price per night, guest, type, and amenities are required"
    });
  }

  const validTypes = ['APARTMENT', 'HOUSE', 'VILLA', 'CABIN'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      message: "Type must be one of: APARTMENT, HOUSE, VILLA, CABIN"
    });
  }

  if (!Array.isArray(amenities)) {
    return res.status(400).json({ message: "Amenities must be an array of strings" });
  }

  if (pricePerNight <= 0 || guest <= 0) {
    return res.status(400).json({ message: "Price per Night and Guests must be positive values" });
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
        hostId: Number(req.user.id)
      }

    });
    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Error creating listing" });
  }
};

// PUT update listing
export const updateListing = async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Error updating listing" });
  }
};

 

// DELETE listing
export const deleteListing = async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  try {
    const deletedListing = await prisma.listing.delete({
      where: { id }
    });
    res.status(200).json(deletedListing);
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Error deleting listing" });
  }
};

