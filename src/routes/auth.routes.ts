

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already in use
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiJ9...
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@gmail.com
 *     responses:
 *       200:
 *         description: Reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password for logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid old password
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Admin only endpoint
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */



import express from "express";
import {
  register,
  login,
  getMe,
  changePassword,
  resetPassword,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔓 Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, changePassword);
router.get("/admin", authenticate, requireAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});

export default router;

// 🔐 Protected route (any logged-in user)
router.post("/change-password", authenticate, changePassword);
router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: (req as any).user,
  });
});

// 🔒 Admin only route
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

export default router;