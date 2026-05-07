import { Router } from "express";
import {
  naturalLanguageSearch,
  generateListingDescription,
  chat,
  recommendListings,
  reviewSummary,
} from "../../controllers/ai.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

/**
 * POST /api/v1/ai/search
 * Smart listing search with natural language and pagination
 * Query params: page, limit
 */
router.post("/search", strictLimiter, naturalLanguageSearch);

/**
 * POST /api/v1/ai/listings/:id/generate-description
 * Generate or regenerate listing description with tone control
 * Requires authentication
 */
router.post(
  "/listings/:id/generate-description",
  strictLimiter,
  authenticate,
  generateListingDescription
);

/**
 * POST /api/v1/ai/chat
 * Chat with AI assistant about listings or general inquiries
 * Optional listingId for context-aware responses
 */
router.post("/chat", strictLimiter, chat);

/**
 * POST /api/v1/ai/recommend
 * Get AI-powered listing recommendations based on booking history
 * Requires authentication
 */
router.post("/recommend", strictLimiter, authenticate, recommendListings);

/**
 * GET /api/v1/ai/listings/:id/review-summary
 * Get AI summary of all reviews for a listing (cached for 10 minutes)
 */
router.get("/listings/:id/review-summary", strictLimiter, reviewSummary);

export default router;
