import AWS from 'aws-sdk';
import config from 'config';
import { logger } from '../logger';
const { REGION, ENDPOINT } = config.AWS;

const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: ENDPOINT,
  region: REGION,
});

export async function createTable() {
  logger.debug(`Creating ${config.TABLE_NAME} table`);
  const dynamoDB = new AWS.DynamoDB({
    endpoint: ENDPOINT,
    region: REGION,
  });
  return dynamoDB.createTable({
    TableName: config.TABLE_NAME,
    KeySchema: [
      {
        AttributeName: 'pairAddress',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'hourStartUnix',
        KeyType: 'RANGE'
      }
    ],
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    AttributeDefinitions: [
      {
        AttributeName: 'pairAddress',
        AttributeType: 'S'
      },
      {
        AttributeName: 'hourStartUnix',
        AttributeType: 'N'
      }
    ]
  }).promise();
}

export async function save(pairData: object) {
  logger.debug(`Saving pair data`);
  const params = {
    TableName: config.TABLE_NAME,
    Item: {
      createdAt: Date.now(),
      ...pairData
    },
  };

  try {
    const data = await dbClient.put(params).promise();
    logger.debug('Pair data saved successfully');
    return data;
  } catch (error) {
    logger.error(`Error saving pair data ${error.stack}`);
    throw error;
  }
}

export async function saveAll(pairAddress: string, pairData: Array<object>) {
  const batchRequest = {
    RequestItems: {
      [config.TABLE_NAME]: pairData.map((item) => ({
        PutRequest: {
          Item: {
            pairAddress,
            createdAt: Date.now(),
            ...item,
          },
        },
      })),
    },
  };
  logger.debug('SAVE ', batchRequest);
  try {
    const data = await dbClient.batchWrite(batchRequest).promise();
    logger.debug('Pair data saved successfully', data);
    return data;
  } catch (error) {
    logger.error(`Error saving pair data ${error.stack}`);
    throw error;
  }
}

export async function count() {
  try {
    return dbClient.scan({
      TableName: config.TABLE_NAME,
      Select: 'COUNT',
    }).promise();
  } catch (error) {
    logger.error(`Error counting rows ${error}`);
    throw error;
  }
}

export async function getAll(contract: string) {
  logger.debug(`Getting pair data for contract: ${contract}`);
  try {
    return await dbClient.query({
      TableName: config.TABLE_NAME,
      KeyConditionExpression: 'pairAddress = :pairAddress',
      ExpressionAttributeValues: {
        ':pairAddress': contract,
      },
    }).promise();
  } catch (error) {
    logger.error(`Error getting all rows ${error}`);
    throw error;
  }
}

export async function getLastInserted(pairAddress: string) {
  logger.debug(`Getting pair data ${pairAddress}`);
  try {
    const data = await dbClient.query({
      TableName: config.TABLE_NAME,
      ScanIndexForward: false,
      Limit: 1,
      KeyConditionExpression: 'pairAddress = :pairAddress',
      ExpressionAttributeValues: {
        ':pairAddress': pairAddress,
      },
    }).promise();
    if (data?.Items?.length > 0) {
      return data.Items[0];
    }
    return undefined;
  } catch (error) {
    logger.error(`Error getting all rows ${error}`);
    throw error;
  }
}
