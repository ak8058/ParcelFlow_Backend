import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { addUser, login } from "../controllers/authController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Authnetication
 *  description: Endpoints for Admin authnetication and management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin Login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */

router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/auth/add-user:
 *   post:
 *     summary: Add New Admin User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/add-user", protect, adminOnly, addUser);

export default router;
