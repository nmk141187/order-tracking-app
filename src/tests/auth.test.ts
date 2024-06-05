import request from 'supertest';
import app from '../app';
import { connectDb } from '../utils/db';

beforeAll(() => {
  connectDb();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'password',
        email: 'testuser@example.com'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toBe('User registered');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});