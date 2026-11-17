
import { Router } from "express"
import createProductController from "../controllers/create-product.controller.ts"
import getProductController from "../controllers/get-product.controller.ts"
import updateProductController from "../controllers/update-product.controller.ts"
import deleteProductController from "../controllers/delete-product.controller.ts"
import searchProductController from "../controllers/search-product.controller.ts"

const productRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     ProductInput:
 *       type: object
 *       required: [name, price, quantity]
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *     ProductUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *     ProductPagination:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
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
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Name already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRouter.post('/', createProductController)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     responses:
 *       200:
 *         description: Product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRouter.get('/:id', getProductController)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Name already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRouter.put('/:id', updateProductController)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRouter.delete('/:id', deleteProductController)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns a paginated list of products
 *     tags: [Products]
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
 *         description: Paginated products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPagination'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRouter.get('/', searchProductController)

export default productRouter
