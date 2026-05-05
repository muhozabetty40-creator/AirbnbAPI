import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserBookings,
  getUserListings,
  updateUser
} from "../controllers/users.controller.js";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id/listings", getUserListings);
router.get("/:id/bookings", getUserBookings);
router.get("/:id/profile", getUserProfile);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/:id/profile", createUserProfile);
router.put("/:id", updateUser);
router.put("/:id/profile", updateUserProfile);
router.delete("/:id", deleteUser);

export default router;
