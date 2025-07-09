    import express from 'express';
    import { 
        getAllUsers,
        block,
        getAllExpenses
    } from '../controllers/adminOnly.ts';
    import checkRole from '../middleware/checkAdminRole.ts';

    const router = express.Router();

    //localhost:3000/admin
    router.get('/users', checkRole('admin'), getAllUsers);
    router.patch('/users/:id/block', checkRole('admin'), block);
    router.get('/expenses/all', checkRole('admin'), getAllExpenses);

    export default router; 