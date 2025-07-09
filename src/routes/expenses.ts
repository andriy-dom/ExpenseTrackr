    import express from 'express';
    import { 
        getExpenses,
        createExpenses,
        deleteExpenses
    } from '../controllers/expenses.ts';

    const router = express.Router();

    //localhost:3000/auth
    router.get('/:id', getExpenses);
    router.post('/', createExpenses);
    router.delete('/:id', deleteExpenses);

    export default router; 