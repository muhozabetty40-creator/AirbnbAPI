import prisma from "../config/prisma.js";
import type { Request, Response } from "express";

// GET all bookings 

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// GET booking by ID
export const getBookingById = async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] as string);
    try {
        const booking = await prisma.booking.findUnique({
            where: { id }
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Error fetching booking" });
    }
};

// POST new booking
export const createBooking = async (req: Request, res: Response) => {
    const { checkIn, guestId, totalPrice, listingId } = req.body;
    if (!checkIn || !guestId || !totalPrice || !listingId) {
        return res.status(400).json({ message: "checkIn, guestId, totalPrice and listingId are required" });
    }
    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
        return res.status(400).json({ message: "checkIn must be a valid date e.g. 2025-08-01" });
    }
    try {
        const newBooking = await prisma.booking.create({
            data: {
                checkIn: checkInDate,
                guestId,
                totalPrice,
                listingId,
            }
        });
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking" });
    }
};

// DELETE booking
export const deleteBooking = async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] as string);
    try {
        const deletedBooking = await prisma.booking.delete({
            where: { id }
        });
        res.status(200).json({message : "booking deleted successfull"});
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Error deleting booking" });
    }
   
};

// PUT update booking
export const updateBooking = async (req: Request, res: Response) => {
    const id = parseInt(req.params["id"] as string);
    const { checkIn, guestId, totalPrice, listingId, status } = req.body;
    const data: any = {};
    if (checkIn) {
        const checkInDate = new Date(checkIn);
        if (isNaN(checkInDate.getTime())) {
            return res.status(400).json({ message: "checkIn must be a valid date" });
        }
        data.checkIn = checkInDate;
    }
    if (guestId) data.guestId = guestId;
    if (totalPrice) data.totalPrice = totalPrice;
    if (listingId) data.listingId = listingId;
    if (status) data.status = status;
    try {
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data
        });
        res.status(200).json({ message : "Updating booking successfull"  , updatedBooking});
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Error updating booking" });
    }
};