/**
 * @swagger
 * /upload/{id}/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
import { Router } from "express";
import upload from "../config/multer.js";
import { uploadAvatar } from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// upload.single("image") — Multer middleware runs first
// "image" must match the field name in the multipart form
// authenticate — user must be logged in to upload
router.post("/:id/avatar", authenticate, upload.single("image"), uploadAvatar);

export default router;