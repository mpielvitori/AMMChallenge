import { Router } from 'express';
import { getPairs } from '../controllers/pairs.controller';

const router = Router();

router.get('/', getPairs);

export default router;
