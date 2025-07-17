import express from 'express';
import { 
    getAllUsers,
    block,
    getAllExpenses
} from '../controllers/adminOnly.ts';
import checkRole from '../middleware/checkAdminRole.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

//localhost:3000/admin
router.get('/users', authMiddleware, checkRole('admin'), getAllUsers);
router.patch('/users/:id/block', authMiddleware, checkRole('admin'), block);
router.get('/expenses/all', authMiddleware, checkRole('admin'), getAllExpenses);

export default router; 