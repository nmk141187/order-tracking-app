import dynamoDb from '../utils/db';
import { Cart } from '../models/cart';

const CART_TABLE = 'Carts';

export const getCart = async (userId: string) => {
  const params = {
    TableName: CART_TABLE,
    Key: { userId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item as Cart;
};

export const updateCart = async (cart: Cart) => {
  const params = {
    TableName: CART_TABLE,
    Item: cart,
  };
  await dynamoDb.put(params).promise();
  return cart;
};

export const clearCart = async (userId: string) => {
  const params = {
    TableName: CART_TABLE,
    Key: { userId },
  };
  await dynamoDb.delete(params).promise();
};