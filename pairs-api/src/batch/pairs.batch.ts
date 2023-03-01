/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from 'config';
import { GraphQLClient, gql } from 'graphql-request';
import { logger } from '../logger';
import { save, count, getLastInserted, createTable } from '../models/pairs.model';

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

const savePairsData = async (pairAddress: string, pairHourDatas: Array<object>) => {
  logger.debug('Saving pair data collection');
  save
  for (const pairHourData of pairHourDatas) {
    await save({
      pairAddress,
      ...pairHourData
    });
  }
  // await saveAll(pairAddress, pairHourDatas);
};

const getPairsData = async (fromTimestamp: number, pairAddress: string): Promise<Array<object>> => {
  const result = await dbClient.request(
    getPairHourDataQuery,
    {
      pairAddress,
      fromTimestamp,
    },
  );
  logger.debug('RESULT ', result);
  return result.pairHourDatas;
};

const callPairsData = async (fromTimestamp: number) => {
  // Search for data since an hour ago
  if (!fromTimestamp) {
    fromTimestamp = Math.floor(Date.now() / 1000) - config.CALL_INTERVAL_IN_SECONDS;
  }
  logger.debug(`TIMESTAMP ${fromTimestamp}`);
  // const fakeAddress = '0x21b8065d10f73ee2e260e5b47d3344d3ced7596e';
  await Promise.all(config.PAIRS.map(async (pair) => {
    const pairHourDatas: Array<object> = await getPairsData(
      fromTimestamp,
      pair.address,
    );
    if (pairHourDatas?.length > 0) {
      await savePairsData(pair.address, pairHourDatas);
    }
  }));
};

export const persistPairData = async () => {
  logger.debug('Start batch process');
  if (config.CREATE_TABLE === 'true'){
    try {
      await createTable();
    } catch (error) {
      logger.error('Create table enabled!!!');
    }
  }
  const countResult = await count();
  logger.debug(`Table count: ${countResult.Count}`);
  if (countResult.Count === 0) {
    logger.debug('First load');
    const oldTimestamp = Math.floor(Date.now() / 1000) - config.INITIAL_CALL_INTERVAL_IN_SECONDS;
    await callPairsData(oldTimestamp);
  } else {
    // workaround for local testing the batch process - persist data if last inserted block was before than an hour ago
    const lastInserted = await getLastInserted(config.PAIRS[0].address);
    if (
      lastInserted
      && lastInserted.hourStartUnix < Date.now() / 1000 - config.CALL_INTERVAL_IN_SECONDS
    ) {
      await callPairsData(Math.floor(lastInserted.hourStartUnix));
    }
  }
  setInterval(callPairsData, config.CALL_INTERVAL_IN_SECONDS * 1000, undefined);
};
