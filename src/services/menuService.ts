import { v4 as uuidv4 } from 'uuid';
import dynamoDb from '../utils/db';
import { MenuItem } from '../models/menuItem';

const MENU_TABLE = 'MenuItems';

export const addMenuItem = async (menuItem: MenuItem) => {
  const item = { ...menuItem, itemId: uuidv4() };
  const params = {
    TableName: MENU_TABLE,
    Item: item,
  };
  await dynamoDb.put(params).promise();
  return item;
};

export const getMenuItem = async (itemId: string) => {
  const params = {
    TableName: MENU_TABLE,
    Key: { itemId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item as MenuItem;
};

export const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
  const params = {
    TableName: MENU_TABLE,
    Key: { itemId },
    UpdateExpression: 'set #name = :name, description = :description, price = :price, category = :category',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':description': updates.description,
      ':price': updates.price,
      ':category': updates.category,
    },
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamoDb.update(params).promise();
  return result.Attributes as MenuItem;
};

export const deleteMenuItem = async (itemId: string) => {
  const params = {
    TableName: MENU_TABLE,
    Key: { itemId },
  };
  await dynamoDb.delete(params).promise();
};