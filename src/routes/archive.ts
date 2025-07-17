import express from 'express';
import authMiddleware from '../middleware/authMiddleware.ts';
import { getArchivedExpenses } from '../controllers/archive.ts';

const router = express.Router();

router.get('/', authMiddleware, getArchivedExpenses);

export default router;