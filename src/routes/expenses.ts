import express from 'express';
import { 
    getUserExpenses,
    createExpenses,
    deleteExpenses,
    getStats
} from '../controllers/expenses.ts';
import authMiddleware from '../middleware/authMiddleware.ts'

const router = express.Router();

//localhost:3000/expenses
router.post('/', authMiddleware, createExpenses);
router.delete('/:id', authMiddleware, deleteExpenses);
router.get('/stats', authMiddleware, getStats);
router.get('/', authMiddleware, getUserExpenses);


export default router; 