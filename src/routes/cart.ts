import express from 'express';
import { getCart, updateCart, clearCart } from '../services/cartService';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     description: Get the cart for the logged-in user
 *     responses:
 *       200:
 *         description: Cart retrieved
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await getCart((req as any).user.userId);
    res.json(cart);
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
 * /cart:
 *   put:
 *     description: Update the cart for the logged-in user
 *     parameters:
 *       - name: cart
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - itemId
 *                   - quantity
 *                 properties:
 *                   itemId:
 *                     type: string
 *                   quantity:
 *                     type: number
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    const cart = await updateCart({ userId: (req as any).user.userId, items: req.body.items });
    res.json(cart);
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
 * /cart:
 *   delete:
 *     description: Clear the cart for the logged-in user
 *     responses:
 *       204:
 *         description: Cart cleared
 */
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await clearCart((req as any).user.userId);
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