import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/prisma.js";
import { sendEmail } from "../config/email.js";

const JWT_SECRET = process.env["JWT_SECRET"] as string;
const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] ?? "7d";
const APP_URL = process.env["APP_URL"] ?? `http://localhost:${process.env["PORT"] ?? 5000}`;

export interface AuthRequest extends Request {
  userId?: number;
  role?: string;
}

const sanitizeUser = (user: any) => {
  const { password, resetToken, resetTokenExpiry, ...safeUser } = user;
  return safeUser;
};

export const register = async (req: Request, res: Response) => {
  const { name, email, username, phone, password, role } = req.body;

  if (!name || !email || !username || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const normalizedRole = role === "HOST" ? "HOST" : "GUEST";

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existing) {
    return res.status(409).json({ message: "Email or username already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: normalizedRole,
    },
  });

  const userWithoutPassword = sanitizeUser(user);

  try {
    await sendEmail(
      email,
      "Welcome to Airbnb API",
      `<h1>Welcome, ${name}!</h1><p>Your account has been created successfully.</p>`
    );
  } catch (emailError) {
    console.warn("Failed to send welcome email:", emailError);
  }

  res.status(201).json(userWithoutPassword);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const userWithoutPassword = sanitizeUser(user);
  res.json({ token, user: userWithoutPassword });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      listings: {
        select: {
          id: true,
          title: true,
          location: true,
          pricePerNight: true,
          type: true,
          guest: true,
          amenities: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      bookings: {
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          totalPrice: true,
          status: true,
          listing: {
            select: {
              id: true,
              title: true,
              location: true,
              pricePerNight: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const response = {
    ...user,
    listings: req.role === "HOST" || req.role === "ADMIN" ? user.listings : undefined,
    bookings: req.role === "GUEST" || req.role === "ADMIN" ? user.bookings : undefined,
  };

  res.json(response);
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid current password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

  res.json({ message: "Password changed successfully" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.json({ message: "If that email is registered, a reset link has been sent" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: hashedToken, resetTokenExpiry },
  });

  const resetUrl = `${APP_URL}/auth/reset-password/${rawToken}`;

  try {
    await sendEmail(
      email,
      "Password Reset Request",
      `<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`
    );
  } catch (error) {
    console.warn("Failed to send password reset email:", error);
  }

  res.json({ message: "If that email is registered, a reset link has been sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const rawToken = req.params["token"] as string;
  const { newPassword } = req.body;

  if (!rawToken || !newPassword) {
    return res.status(400).json({ message: "Reset token and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({ message: "Password reset successfully" });
};
