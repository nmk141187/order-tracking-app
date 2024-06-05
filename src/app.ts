import express from 'express';
import bodyParser from 'body-parser';
import { connectDb } from './utils/db';
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(bodyParser.json());

connectDb();

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Order Taking App API',
        version: '1.0.0',
      },
    },
    apis: ['./src/routes/*.ts'],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

app.get('/', (req, res) => {
  res.send('Order Taking App API');
});

export default app;