import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictLimiter } from "../../middlewares/rateLimiter.js";
import {
  sendMessage,
  getMessages,
  markAsRead,
  getConversations,
} from "../../controllers/messages.controller.js";

const router = Router();

router.post("/", authenticate, strictLimiter, sendMessage);
router.get("/", authenticate, getMessages);
router.get("/conversations", authenticate, getConversations);
router.put("/:id/read", authenticate, markAsRead);

export default router;
