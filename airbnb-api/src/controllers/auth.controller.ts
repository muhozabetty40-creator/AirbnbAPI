import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
  try {
    console.log("Register request body:", req.body);
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Register validation errors:", validation.error.flatten());
      return res.status(400).json({ errors: validation.error.flatten() });
    }

    const { email, username, password, name, phone, role } = validation.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        phone,
        password: hashedPassword,
        role: role || "GUEST",
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        name: user.name,
        role: user.role 
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login request body:", req.body);
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Login validation errors:", validation.error.flatten());
      return res.status(400).json({ errors: validation.error.flatten() });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        name: user.name,
        role: user.role 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
