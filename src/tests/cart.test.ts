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

describe('Cart Endpoints', () => {
  it('should get the cart', async () => {
    const res = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('userId');
  });

  it('should update the cart', async () => {
    const res = await request(app)
      .put('/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { itemId: 'some-item-id', quantity: 2 }
        ]
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('items');
  });

  it('should clear the cart', async () => {
    const res = await request(app)
      .delete('/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });
});