import { Router } from "express";
import { strictLimiter } from "../middlewares/rateLimiter.js";
import {
  searchListings,
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller.js";
import { getListingStats } from "../controllers/stats.controller.js";

const router = Router();

router.get("/stats", getListingStats);
router.get("/search", searchListings);
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", strictLimiter, createListing);
router.put("/:id", strictLimiter, updateListing);
router.delete("/:id", deleteListing);

export default router;
