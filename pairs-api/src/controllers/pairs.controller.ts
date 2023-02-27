/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { GraphQLClient, gql } from 'graphql-request';
// import config from 'config';
import { logger } from '../logger';
import { getAll } from '../models/pairs.model';

// const client = new GraphQLClient(
//   config.UNISWAP_URL,
//   {
//     headers: { 'Content-Type': 'application/json' },
//   },
// );

// const headers = {
//   'Content-Type': 'application/json',
// };
// const query = gql`query getPairs($pairAddress: String!) {
//   pair(id: $pairAddress){
//     token0 {
//       id
//       symbol
//       name
//       derivedETH
//     }
//     token1 {
//       id
//       symbol
//       name
//       derivedETH
//     }
//     reserve0
//     reserve1
//     reserveUSD
//     trackedReserveETH
//     token0Price
//     token1Price
//     volumeUSD
//     txCount
//   }
// }`;
// const getPairHourData = gql`query getPairHourData($pairAddress: String!, $fromTimestamp: Int!){
//   pairHourDatas (where: {
//      pair: $pairAddress,
//      hourStartUnix_gt: $fromTimestamp
//    }
//  ){
//     hourlyVolumeToken0
//     hourlyVolumeToken1
//     hourlyVolumeUSD
//     reserve0
//     reserve1
//     reserveUSD
//     hourStartUnix
//   }
// }
// `;

export const getPairs = async (req, res) => {
  logger.info('Get pairs');
  try {
    const dbPairs = await getAll();
    res.send(dbPairs?.Items);
  } catch (error) {
    logger.error('Error getting pairs info', error);
    res.status(
      500,
    ).send({
      exception: error,
      message: 'Error getting pairs info',
    });
  }
};
