
import { Router } from "express"
import { authenticateUserController } from "../controllers/authenticate-user.controller.ts"
import { checkEmailStatusController } from "../controllers/check-email-status.controller.ts"
import { emailStatusRateLimit } from "../middlewares/email-status-rate-limit.middleware.ts"

export const authRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acess_token:
 *                   type: string
 *                   description: JWT access token (send as Authorization Bearer <acess_token>)
 *       400:
 *         description: Invalid credentials or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/login', authenticateUserController)

/**
 * @swagger
 * /auth/email-status:
 *   post:
 *     summary: Check whether an email address has an account
 *     description: Public endpoint. Reveals account existence; limited to 30 requests per IP per 15 minutes per server instance. Returns no user data.
 *     tags: [Authentication]
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
 *                 format: email
 *                 example: person@example.com
 *     responses:
 *       200:
 *         description: Account existence result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [exists]
 *               properties:
 *                 exists:
 *                   type: boolean
 *       400:
 *         description: Invalid email address
 *       429:
 *         description: Too many requests from this IP
 */
authRouter.post('/email-status', emailStatusRateLimit, checkEmailStatusController)
