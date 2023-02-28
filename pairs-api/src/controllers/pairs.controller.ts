/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { GraphQLClient, gql } from 'graphql-request';
// import config from 'config';
import { logger } from '../logger';
import { getAll } from '../models/pairs.model';

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
