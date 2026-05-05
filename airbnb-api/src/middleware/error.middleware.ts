import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Error handler caught:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Unique constraint failed" });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Record not found" });
    }

    if (err.code === "P2003") {
      return res.status(400).json({ message: "Foreign key constraint failed" });
    }
  }

  return res.status(500).json({ message: "Something went wrong" });
};
