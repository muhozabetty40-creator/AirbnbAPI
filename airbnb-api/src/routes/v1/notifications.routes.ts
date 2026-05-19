import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
} from "../../controllers/notifications.controller.js";

const router = Router();

router.get("/", authenticate, getNotifications);
router.get("/unread-count", authenticate, getUnreadCount);
router.put("/:id/read", authenticate, markNotificationAsRead);
router.put("/read-all", authenticate, markAllNotificationsAsRead);
router.delete("/:id", authenticate, deleteNotification);

export default router;
