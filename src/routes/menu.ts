import express from 'express';
import { addMenuItem, getMenuItem, updateMenuItem, deleteMenuItem } from '../services/menuService';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * /menu:
 *   post:
 *     description: Add a new menu item
 *     parameters:
 *       - name: item
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - description
 *             - price
 *             - category
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             category:
 *               type: string
 *     responses:
 *       201:
 *         description: Menu item added
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const menuItem = await addMenuItem(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unexpected error occurred');
    }
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     description: Get a menu item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Menu item retrieved
 */
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await getMenuItem(req.params.id);
    res.json(menuItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      res.status(404).send('Menu item not found');
    }
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     description: Update a menu item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: item
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - description
 *             - price
 *             - category
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             category:
 *               type: string
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedItem = await updateMenuItem(req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unexpected error occurred');
    }
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     description: Delete a menu item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Menu item deleted
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await deleteMenuItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unexpected error occurred');
    }
  }
});

export default router;