import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Calculate earnings from confirmed bookings
    const bookings = await prisma.booking.findMany({
      where: {
        listing: { userId: req.userId },
        status: "confirmed",
      },
      include: { listing: true },
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.total, 0);

    res.json({
      userId: req.userId,
      totalEarnings,
      bookings: bookings.length,
      balance: totalEarnings,
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawFromWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }

    // Calculate current balance
    const bookings = await prisma.booking.findMany({
      where: {
        listing: { userId: req.userId },
        status: "confirmed",
      },
      include: { listing: true },
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.total, 0);

    if (amount > totalEarnings) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // In a real application, you would process the withdrawal here
    // For now, we'll just return a success response
    res.json({
      message: "Withdrawal processed successfully",
      amount,
      remainingBalance: totalEarnings - amount,
    });
  } catch (error) {
    next(error);
  }
};
