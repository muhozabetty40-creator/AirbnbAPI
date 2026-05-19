import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import { getAllReviews, createReviewFromBooking, deleteReview } from "../../controllers/reviews.controller.js";

const router = Router();

router.get("/", getAllReviews);
router.post("/", authenticate, strictLimiter, createReviewFromBooking);
router.delete("/:id", authenticate, deleteReview);

export default router;
