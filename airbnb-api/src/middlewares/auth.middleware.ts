import { Request, Response, NextFunction } from "express";

// Simple authentication middleware for testing
// In production, this would verify JWT tokens
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization required" });
  }

  // For now, just extract the token and attach a mock user
  // In production, verify the JWT and extract the user ID
  const token = authHeader.slice(7);
  
  // Mock: decode the token or validate it
  // For testing, we'll assume the token contains the user ID
  req.userId = token.split("-")[0] || "user-123";
  
  next();
};
