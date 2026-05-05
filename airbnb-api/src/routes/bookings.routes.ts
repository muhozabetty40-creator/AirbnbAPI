import { Router } from "express";
import { strictLimiter } from "../middlewares/rateLimiter.js";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  deleteBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", strictLimiter, createBooking);
router.delete("/:id", deleteBooking);

export default router;
