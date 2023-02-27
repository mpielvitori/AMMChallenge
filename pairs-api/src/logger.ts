import { createLogger, format, transports } from 'winston';
import config from 'config';

export const logger = createLogger({
  format: format.json(),
  level: config.LOG_LEVEL || 'info',
  transports: [
    new transports.Console(),
  ],
});
