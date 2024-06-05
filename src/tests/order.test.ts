import request from 'supertest';
import app from '../app';
import { connectDb } from '../utils/db';

let token: string;

beforeAll(async () => {
  connectDb();

  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      username: 'testuser',
      password: 'password'
    });

  token = loginResponse.body.token;
});

describe('Order Endpoints', () => {
  it('should place an order', async () => {
    const res = await request(app)
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { itemId: 'some-item-id', quantity: 2 }
        ],
        totalPrice: 20
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('orderId');
  });

  it('should get an order', async () => {
    const orderRes = await request(app)
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { itemId: 'some-item-id', quantity: 2 }
        ],
        totalPrice: 20
      });

    const res = await request(app)
      .get(`/order/${orderRes.body.orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('orderId');
  });

  it('should get order history', async () => {
    const res = await request(app)
      .get('/order/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  
});