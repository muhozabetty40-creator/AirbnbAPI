import { NextFunction, Request, Response } from "express";

export const getUserProfile = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(410).json({ message: "Profile endpoint removed" });
};

export const createUserProfile = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(410).json({ message: "Profile endpoint removed" });
};

export const updateUserProfile = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(410).json({ message: "Profile endpoint removed" });
};
