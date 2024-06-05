import express from 'express';
import { registerUser, authenticateUser } from '../services/userService';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register a new user
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *             - email
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register', async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(201).send('User registered');
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
 * /auth/login:
 *   post:
 *     description: Login a user
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 */
router.post('/login', async (req, res) => {
  try {
    const token = await authenticateUser(req.body.username, req.body.password);
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(401).send('Invalid credentials');
    }
  }
});

export default router;