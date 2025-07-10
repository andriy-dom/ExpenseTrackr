    import express from 'express';
    import { 
        getExpenses,
        createExpenses,
        deleteExpenses,
        getStats
    } from '../controllers/expenses.ts';
    import authMiddleware from '../middleware/authMiddleware.ts'

    const router = express.Router();

    //localhost:3000/expenses
    router.get('/:id', authMiddleware, getExpenses);
    router.post('/', authMiddleware, createExpenses);
    router.delete('/:id', authMiddleware, deleteExpenses);
    router.get('/stats', authMiddleware, getStats);

    export default router; 