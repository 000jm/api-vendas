
import { Router } from "express"
import { sendEmailToResetPasswordController } from "../controllers/send-email-to-reset-password.controller"
import { resetPasswordController } from "../controllers/reset-password.controller"

export const passwordRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *       example:
 *         email: sampleuser@mail.com
 *     ResetPassword:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: The token to reset the password
 *         password:
 *           type: string
 *           description: The new password
 *       example:
 *         token: b4822965-b08d-4e48-8518-4fd125cc37d6
 *         password: newPassword123
 */

/**
 * @swagger
 * tags:
 *   name: Password
 *   description: The password managing API
 */

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     summary: Send an email to reset the password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       204:
 *         description: Reset token generated and email send attempted
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: Token generated but email could not be sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
passwordRouter.post('/forgot', sendEmailToResetPasswordController)

/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Reset the password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       204:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
passwordRouter.post('/reset', resetPasswordController)
