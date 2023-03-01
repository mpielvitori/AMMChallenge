import { logger } from '../logger';
import { getAll } from '../models/pairs.model';

export const getPairs = async (req, res) => {
  logger.debug('Get pairs');
  try {
    const dbPairs = await getAll(req.query?.contract);
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
