import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dynamoDb from '../utils/db';
import { User } from '../models/user';

const USERS_TABLE = 'Users';

export const registerUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = { ...user, userId: uuidv4(), password: hashedPassword };
  const params = {
    TableName: USERS_TABLE,
    Item: newUser,
  };
  await dynamoDb.put(params).promise();
};

export const authenticateUser = async (username: string, password: string) => {
  const params = {
    TableName: USERS_TABLE,
    Key: { username },
  };
  const result = await dynamoDb.get(params).promise();
  const user = result.Item as User;
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.userId }, 'your_jwt_secret');
    return token;
  }
  throw new Error('Invalid credentials');
};