
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  userId?: number;
  role?: string;
}

const JWT_SECRET = process.env["JWT_SECRET"] as string;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or missing authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid or missing authorization header" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireHost = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role === "HOST" || req.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Host access required" });
};

export const requireGuest = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role === "GUEST" || req.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Guest access required" });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId || !req.role || !roles.includes(req.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};