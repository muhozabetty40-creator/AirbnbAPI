import { Router } from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListingById,
  updateListing
} from "../controllers/listings.controller.js";

const router = Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", createListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
