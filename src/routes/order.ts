import express from 'express';
import { placeOrder, getOrder, updateOrderStatus, getOrderHistory } from '../services/orderService';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * /order:
 *   post:
 *     description: Place a new order
 *     parameters:
 *       - name: order
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - items
 *             - totalPrice
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
 *             totalPrice:
 *               type: number
 *     responses:
 *       201:
 *         description: Order placed
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const order = await placeOrder({ ...req.body, userId: (req as any).user.userId });
    res.status(201).json(order);
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
 * /order/{id}:
 *   get:
 *     description: Get an order by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Order retrieved
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      res.status(404).send('Order not found');
    }
  }
});

/**
 * @swagger
 * /order/{id}/status:
 *   put:
 *     description: Update the status of an order by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: status
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - status
 *           properties:
 *             status:
 *               type: string
 *               enum: [placed, completed]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const updatedOrder = await updateOrderStatus(req.params.id, req.body.status);
    res.json(updatedOrder);
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
 * /order/history:
 *   get:
 *     description: Get order history for the logged-in user
 *     responses:
 *       200:
 *         description: Order history retrieved
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const orders = await getOrderHistory((req as any).user.userId);
    res.json(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unexpected error occurred');
    }
  }
});

export default router;