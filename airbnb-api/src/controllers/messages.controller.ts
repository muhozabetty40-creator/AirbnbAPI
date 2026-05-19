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

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.userId;

    if (!senderId) return res.status(401).json({ message: "Unauthorized" });
    if (!receiverId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
        receiver: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { page, limit, conversationWith } = req.query;
    const { page: p, limit: l, skip } = parsePage(page, limit);

    let where: any = {
      OR: [{ senderId: userId }, { receiverId: userId }],
    };

    if (conversationWith) {
      where = {
        OR: [
          { senderId: userId, receiverId: String(conversationWith) },
          { senderId: String(conversationWith), receiverId: userId },
        ],
      };
    }

    const [data, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: l,
        include: {
          sender: { select: { id: true, name: true, email: true, avatar: true } },
          receiver: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.count({ where }),
    ]);

    res.json({ data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = parseId(req.params.id);
    if (messageId === null) return res.status(400).json({ message: "Invalid message id" });

    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) return res.status(404).json({ message: "Message not found" });

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
        receiver: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const conversationsMap = new Map();
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      if (msg.receiverId === userId && !msg.isRead) {
        conversationsMap.get(otherUserId).unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    res.json({ data: conversations });
  } catch (error) {
    next(error);
  }
};
