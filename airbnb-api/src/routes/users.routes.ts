import { Router } from "express";
import { strictLimiter } from "../middlewares/rateLimiter.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings,
} from "../controllers/users.controller.js";
import { getUserStats } from "../controllers/stats.controller.js";

const router = Router();

router.get("/stats", getUserStats);
router.get("/", getAllUsers);
router.get("/:id/bookings", getUserBookings);
router.get("/:id", getUserById);
router.post("/", strictLimiter, createUser);
router.put("/:id", strictLimiter, updateUser);
router.delete("/:id", deleteUser);

export default router;
