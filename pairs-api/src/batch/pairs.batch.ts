import config from 'config';
import { GraphQLClient, gql } from 'graphql-request';
import { logger } from '../logger';
import {
  save, count, getLastInserted, createTable,
} from '../models/pairs.model';

const dbClient = new GraphQLClient(
  config.UNISWAP_URL,
  { headers: { 'Content-Type': 'application/json' } },
);

const getPairHourDataQuery = gql`query getPairHourData($pairAddress: String!, $fromTimestamp: Int!){
  pairHourDatas(
    orderBy: hourStartUnix
    orderDirection: desc
    where: {hourStartUnix_gt: $fromTimestamp, pair: $pairAddress}
  ) {
    hourStartUnix
    hourlyVolumeToken0
    hourlyVolumeToken1
    hourlyVolumeUSD
    reserve0
    reserve1
    reserveUSD
  }
}
`;

const saveDBPairsData = async (pairAddress: string, pairHourDatas: Array<object>) => {
  logger.debug(`Saving pair data ${pairAddress}`);
  await Promise.all(pairHourDatas.map(async (pairHourData) => {
    await save({
      pairAddress,
      ...pairHourData,
    });
  }));
};

const getDBPairsData = async (fromTimestamp: number, pairAddress: string): Promise<Array<object>> => {
  const result = await dbClient.request(
    getPairHourDataQuery,
    {
      pairAddress,
      fromTimestamp,
    },
  );
  logger.debug(` getDBPairsData by ${pairAddress}-${fromTimestamp} `, result);
  // eslint-disable-next-line dot-notation
  return result['pairHourDatas'];
};

const callAndSavePairsData = async (fromTimestamp: number) => {
  // Search for data since an interval ago
  if (!fromTimestamp) {
    // eslint-disable-next-line no-param-reassign
    fromTimestamp = Math.floor(Date.now() / 1000) - config.CALL_INTERVAL_IN_SECONDS;
  }
  await Promise.all(config.PAIRS.map(async (pair) => {
    logger.debug(`callPairsData timestamp ${fromTimestamp}`);
    const pairHourDatas: Array<object> = await getDBPairsData(
      fromTimestamp,
      pair.address,
    );
    if (pairHourDatas?.length > 0) {
      await saveDBPairsData(pair.address, pairHourDatas);
    }
  }));
};

export const persistPairData = async () => {
  logger.debug('Start persistPairData batch process');
  if (config.CREATE_TABLE === 'true') {
    try {
      await createTable();
    } catch (error) {
      logger.error('CREATE TABLE ENABLED!!!', error);
    }
  }
  const countResult = await count();
  logger.debug(`Table count: ${countResult.Count}`);
  if (countResult.Count === 0) {
    logger.debug('Initial load');
    const oldTimestamp = Math.floor(Date.now() / 1000) - config.INITIAL_CALL_INTERVAL_IN_SECONDS;
    await callAndSavePairsData(oldTimestamp);
  } else {
    // workaround for local testing the batch process - persist data if last inserted block was before than an hour ago
    const lastInserted = await getLastInserted(config.PAIRS[0].address);
    if (
      lastInserted
      && lastInserted.hourStartUnix < Date.now() / 1000 - config.CALL_INTERVAL_IN_SECONDS
    ) {
      logger.debug('Workaround initial load');
      await callAndSavePairsData(Math.floor(lastInserted.hourStartUnix));
    }
  }
  setInterval(callAndSavePairsData, config.CALL_INTERVAL_IN_SECONDS * 1000, undefined);
};
