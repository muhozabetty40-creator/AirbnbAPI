import { Router } from "express";

const router = Router();

// Placeholder auth routes - implement as needed
router.post("/register", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

export default router;