import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import pairsRouter from './routes/pairs.routes';
import { persistPairData } from './batch/pairs.batch';
import { logger } from './logger';

// Start batch process
persistPairData();
const swaggerDocument = yaml.load(readFileSync(`${__dirname}/swagger.yaml`, 'utf8'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use('/api/pairs', pairsRouter);
app.use('/api/pairs/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 8080;

app.listen(port, () => {
  logger.debug(`Pairs Server is up and running on port numner ${port}`);
});

export default app;
