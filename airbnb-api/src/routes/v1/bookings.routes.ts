import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  deleteBooking,
  approveBooking,
  cancelBooking,
} from "../../controllers/bookings.controller.js";

const router = Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", strictLimiter, createBooking);
router.put("/:id/approve", authenticate, approveBooking);
router.put("/:id/cancel", authenticate, cancelBooking);
router.delete("/:id", deleteBooking);

export default router;
