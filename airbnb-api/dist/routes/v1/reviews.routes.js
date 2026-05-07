import { Router } from "express";
import { deleteReview } from "../../controllers/reviews.controller.js";
const router = Router();
router.delete("/:id", deleteReview);
export default router;
