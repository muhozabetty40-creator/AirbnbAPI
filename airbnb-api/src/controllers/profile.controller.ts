import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createProfileSchema, updateProfileSchema } from "../validators/profile.validator.js";

const parseId = (value: string | string[] | undefined): number | null => {
  const idString = Array.isArray(value) ? value[0] : value;
  const id = Number(idString);
  return !idString || Number.isNaN(id) ? null : id;
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const profile = await prisma.profile.findUnique({ where: { userId: id } });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const createUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProfile = await prisma.profile.findUnique({ where: { userId: id } });

    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    const result = createProfileSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const profile = await prisma.profile.create({
      data: {
        ...result.data,
        userId: id
      }
    });

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await prisma.profile.findUnique({ where: { userId: id } });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: id },
      data: result.data
    });

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
