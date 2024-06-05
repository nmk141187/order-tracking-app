import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config(); 

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // use environment variables for security
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // use environment variables for security
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const connectDb = () => {
  console.log('Connected to DynamoDB');
};

export default dynamoDb;