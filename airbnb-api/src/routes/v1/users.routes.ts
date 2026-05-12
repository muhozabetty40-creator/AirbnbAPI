import { Router } from "express";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { upload } from "../../config/multer.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../../controllers/users.controller.js";
import { getUserStats } from "../../controllers/stats.controller.js";

const router = Router();

router.get("/stats", getUserStats);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, strictLimiter, updateProfile);
router.post("/upload-avatar", authenticate, upload.single("file"), uploadAvatar);
router.get("/", getAllUsers);
router.get("/:id/bookings", getUserBookings);
router.get("/:id", getUserById);
router.post("/", strictLimiter, createUser);
router.put("/:id", strictLimiter, updateUser);
router.delete("/:id", deleteUser);

export default router;
