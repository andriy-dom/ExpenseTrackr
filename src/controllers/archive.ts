import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'
import errorHandler from '../utils/errorHandler.ts';
import Archive from '../models/archive.ts';


const getArchivedExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const archivedExpenses = await Archive.find({ userId: req.user?.id });

        if (archivedExpenses.length === 0) {
            res.status(404).json({ message: 'No archived expenses found' });
            return;
        }
        
        res.status(200).json(archivedExpenses);
    } catch(error) {
        errorHandler(res, error);
    }
}

export { getArchivedExpenses }