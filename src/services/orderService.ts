import { v4 as uuidv4 } from 'uuid';
import dynamoDb from '../utils/db';
import { Order } from '../models/order';

const ORDERS_TABLE = 'Orders';

export const placeOrder = async (order: Order) => {
  const newOrder = { ...order, orderId: uuidv4(), status: 'placed', timestamp: Date.now() };
  const params = {
    TableName: ORDERS_TABLE,
    Item: newOrder,
  };
  await dynamoDb.put(params).promise();
  return newOrder;
};

export const getOrder = async (orderId: string) => {
  const params = {
    TableName: ORDERS_TABLE,
    Key: { orderId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item as Order;
};

export const updateOrderStatus = async (orderId: string, status: 'placed' | 'completed') => {
  const params = {
    TableName: ORDERS_TABLE,
    Key: { orderId },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes as Order;
};

export const getOrderHistory = async (userId: string) => {
  const params = {
    TableName: ORDERS_TABLE,
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };
  const result = await dynamoDb.query(params).promise();
  return result.Items as Order[];
};