import express from 'express';
import { getCurrency } from '../controllers/currency.ts';
import authMiddleware from '../middleware/authMiddleware.ts'

const router = express.Router();

router.get('/convert', authMiddleware, getCurrency);

export default router;
