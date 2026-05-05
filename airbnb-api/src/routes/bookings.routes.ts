import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
} from "../controllers/bookings.controller.js";

const router = Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);
router.patch("/:id/status", updateBookingStatus);

export default router;
