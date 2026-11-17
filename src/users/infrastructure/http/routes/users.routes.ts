
import { Router } from "express"
import { createUserController } from "../controllers/create-user.controller"
import { searchUserController } from "../controllers/search-user.controller"
import { isAuthenticatedHandler } from "@/common/infrastructure/http/middlewares/isAuthenticatedHandle"
import { updateAvatarController } from "../controllers/update-avatar.controller"
import { upload } from "../middlewares/usersAvatar.middleware"
import { getUserController } from "../controllers/get-user.controller"
import { updateUserController } from "../controllers/update-user.controller"

export const usersRoutes = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: Stored avatar filename/key
 *         avatar_url:
 *           type: string
 *           nullable: true
 *           description: Public URL to display the avatar (use this in the front-end)
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreateUserInput:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     UpdateProfileInput:
 *       type: object
 *       required: [name, email]
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         old_password:
 *           type: string
 *           description: Required when changing the password
 *         password:
 *           type: string
 *           description: New password (requires old_password)
 *     UserPagination:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         total:
 *           type: integer
 *         current_page:
 *           type: integer
 *         per_page:
 *           type: integer
 *         last_page:
 *           type: integer
 *         sort:
 *           type: string
 *           nullable: true
 *         sort_dir:
 *           type: string
 *           nullable: true
 *         filter:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRoutes.post('/', createUserController)

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Upload/update the authenticated user's avatar
 *     description: Updates the avatar of the authenticated user. The previous avatar file is removed when replaced (when applicable). Use the returned `avatar_url` to display the image in the front-end.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, webp), max 3MB
 *     responses:
 *       200:
 *         description: Avatar updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (missing/invalid file or type/size)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRoutes.patch('/avatar', isAuthenticatedHandler, upload.single('file'), updateAvatarController)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a paginated list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRoutes.get('/', isAuthenticatedHandler, searchUserController)

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Returns the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRoutes.get('/profile', isAuthenticatedHandler, getUserController)

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (e.g. missing old_password when changing password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRoutes.put('/profile', isAuthenticatedHandler, updateUserController)
