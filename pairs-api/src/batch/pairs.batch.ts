/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from 'config';
import { GraphQLClient, gql } from 'graphql-request';
import { logger } from '../logger';
import { saveAll, count, getLastInserted } from '../models/pairs.model';

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
  logger.info('SAVING');
  await saveAll(pairAddress, pairHourDatas);
};

const getPairsData = async (fromTimestamp: number, pairAddress: string): Promise<Array<object>> => {
  const result = await dbClient.request(
    getPairHourDataQuery,
    {
      pairAddress,
      fromTimestamp,
    },
  );
  logger.info('RESULT ', result);
  return result.pairHourDatas;
};

const callPairsData = async (fromTimestamp: number) => {
  // Search for data since an hour ago
  if (!fromTimestamp) {
    fromTimestamp = Math.floor(Date.now() / 1000) - config.CALL_INTERVAL_IN_SECONDS;
  }
  logger.info(`TIMESTAMP ${fromTimestamp}`);
  const fakeAddress = '0x21b8065d10f73ee2e260e5b47d3344d3ced7596e';
  const pairHourDatas: Array<object> = await getPairsData(
    fromTimestamp,
    fakeAddress,
  );
  if (pairHourDatas?.length > 0) {
    await savePairsData(fakeAddress, pairHourDatas);
  }
  // await getPairsData(fromTimestamp, config.pairs.B);
};

export const persistPairData = async () => {
  logger.info('Start batch process');
  const countResult = await count();
  logger.info(`Table count: ${countResult.Count}`);
  if (countResult.Count === 0) {
    logger.info('First load');
    const oldTimestamp = Math.floor(Date.now() / 1000) - config.INITIAL_CALL_INTERVAL_IN_SECONDS;
    await callPairsData(oldTimestamp);
  } else {
    // workaround for local testing the batch process - persist data if last inserted block was before than an hour ago
    const fakeAddress = '0x21b8065d10f73ee2e260e5b47d3344d3ced7596e';
    const lastInserted = await getLastInserted(fakeAddress);
    if (
      lastInserted
      && lastInserted.hourStartUnix < Date.now() / 1000 - config.CALL_INTERVAL_IN_SECONDS
    ) {
      await callPairsData(Math.floor(lastInserted.hourStartUnix));
    }
  }
  setInterval(callPairsData, config.CALL_INTERVAL_IN_SECONDS * 1000, undefined);
};
