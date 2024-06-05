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

describe('Menu Endpoints', () => {
  it('should add a new menu item', async () => {
    const res = await request(app)
      .post('/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pizza',
        description: 'Delicious cheese pizza',
        price: 10,
        category: 'Main'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('itemId');
  });

  it('should get a menu item', async () => {
    const menuItemRes = await request(app)
      .post('/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Burger',
        description: 'Tasty beef burger',
        price: 8,
        category: 'Main'
      });

    const res = await request(app)
      .get(`/menu/${menuItemRes.body.itemId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('itemId');
  });

  
});