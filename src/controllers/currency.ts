import { Request, Response } from 'express';
import db from '../db.ts';
import { AuthRequest } from '../middleware/authMiddleware'
import errorHandler from '../utils/errorHandler.ts';
import { ExchangeRates } from '../types/ExchangeRates.ts';

const getCurrency = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { amount = 1, from = 'USD', to = 'UAH' } = req.query;
        const [rates]: [ ExchangeRates[] ] = await db.execute(`SELECT base_currency, target_currency, rate FROM ExchangeRates WHERE target_currency = ?`, [to]);
        
        const rateMap = new Map<string, number>();
        
        for (const row of rates) {
            if (row.base_currency === to) {
                rateMap.set(to, 1);
            } else {
                rateMap.set(row.base_currency, row.rate);
            }
        }
        
        const rate = rateMap.get(from);
        
        if (!rate) {
            res.status(404).json({ message: 'Rate not found' });
            return;
        
        }
        const convertedAmount = Number(amount) * rate;
        res.status(200).json({ convertedAmount });
    } catch (error) {
        errorHandler(res, error)
    }
}

export { getCurrency }