import AWS from 'aws-sdk';
import config from 'config';
import { logger } from '../logger';

const { REGION } = config.AWS;
// const uuidV4 = require('uuid/v4');

const PAIRS_TABLE = config.PAIRS.TABLE_NAME;
const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://into-the-block.database:8000',
  region: REGION,
});

/**
 * Persist Pair data record
 * @param {string} pairAddress
 * @param {string} volume
 * @param {string} fee
 * @return {object}
*/
export async function save(pairAddress, liquidity, volume, fee) {
  logger.info(`Saving PAIR DATA ${pairAddress}, ${volume}, ${fee}`);
  const timestamp = new Date().getTime();
  const params = {
    TableName: PAIRS_TABLE,
    Item: {
      pairAddress,
      createdAt: timestamp,
      volume,
      fee,
      liquidity,
    },
  };

  try {
    const data = await dbClient.put(params).promise();
    logger.info('Pair data saved successfully', data);
    return data;
  } catch (error) {
    logger.error(`Error saving pair data ${error.stack}`);
    throw error;
  }
}

export async function saveAll(pairAddress: string, pairData: Array<object>) {
  const batchRequest = {
    RequestItems: {
      [PAIRS_TABLE]: pairData.map((item) => ({
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
  logger.info('SAVE ', batchRequest);
  try {
    const data = await dbClient.batchWrite(batchRequest).promise();
    logger.info('Pair data saved successfully', data);
    return data;
  } catch (error) {
    logger.error(`Error saving pair data ${error.stack}`);
    throw error;
  }
}

export async function count() {
  try {
    return dbClient.scan({
      TableName: PAIRS_TABLE,
      Select: 'COUNT',
    }).promise();
  } catch (error) {
    logger.error(`Error counting rows ${error}`);
    throw error;
  }
}

export async function getAll() {
  logger.info('Getting PAIR DATA');
  try {
    const data = await dbClient.scan({
      TableName: PAIRS_TABLE,
    }).promise();
    logger.info('Pairs: ', data);
    return data;
  } catch (error) {
    logger.error(`Error getting all rows ${error}`);
    throw error;
  }
}

export async function getLastInserted(pairAddress: string) {
  logger.info('Getting PAIR DATA');
  try {
    const data = await dbClient.query({
      TableName: PAIRS_TABLE,
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

// /**
//  * Paginated scan for DNA table
//  * @return {object}
//  */
// async function scanDNATable() {
//   const dbClient = new AWS.DynamoDB.DocumentClient();
//   const params = {
//     TableName: PAIRS_TABLE,
//     FilterExpression: 'mutant = :mutantValue',
//     ExpressionAttributeValues: {
//       ':mutantValue': true,
//     },
//     Select: 'COUNT',
//   };

//   let scannedCount = 0;
//   let count = 0;
//   let remainingData = true;
//   let result;
//   while (remainingData) {
//     result = await dbClient.scan(params).promise();
//     scannedCount += result.ScannedCount;
//     count += result.Count;

//     if (result.LastEvaluatedKey) {
//       params.ExclusiveStartKey = result.LastEvaluatedKey;
//     } else {
//       remainingData = false;
//     }
//   }

//   return {
//     scannedCount,
//     count,
//   };
// }
