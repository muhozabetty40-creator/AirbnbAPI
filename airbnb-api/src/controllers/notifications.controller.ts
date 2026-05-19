import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";

const parseId = (v: string | string[] | undefined): string | null => {
  const s = Array.isArray(v) ? v[0] : v;
  return s || null;
};

const parsePage = (page: unknown, limit: unknown) => {
  const p = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const l = Math.max(1, parseInt(String(limit || "10"), 10) || 10);
  return { page: p, limit: l, skip: (p - 1) * l };
};

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || null,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { page, limit } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: l,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationId = parseId(req.params.id);
    if (notificationId === null) return res.status(400).json({ message: "Invalid notification id" });

    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationId = parseId(req.params.id);
    if (notificationId === null) return res.status(400).json({ message: "Invalid notification id" });

    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await prisma.notification.delete({ where: { id: notificationId } });

    res.json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};
