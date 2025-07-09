    import { ResultSetHeader } from 'mysql2';
    import db from '../db.ts';
    import { Request, Response } from 'express';
    import errorHandler from '../utils/errorHandler.ts';

    interface Expenses {
        id?: number
        user_id: number, 
        category: string, 
        amount: string, 
        currency: string, 
        description: string, 
        date: string
    }

    const getExpenses = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const [expenses] = await db.query(`SELECT amount, currency, category, description, date FROM Expenses WHERE id = ?`, [id]);
            res.status(200).json(expenses)
        } catch (error) {
            errorHandler(res, error)
        }
    }

    const createExpenses = async (req: Request, res: Response): Promise<void> => {
        const { user_id, category, amount, currency, description, date }: Expenses = req.body
        try {
            const [expenses] = await db.query(`INSERT INTO Expenses (user_id, category, amount, currency, description, date) VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, category, amount, currency, description, date]);
            res.status(200).json(expenses[0].id)
        } catch (error) {
            errorHandler(res, error)
        }
    }

    const deleteExpenses = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            await db.query(`DELETE * FROM Expenses WHERE id = ?`, [id]);
            res.status(200).json({ message: 'Expenses succsessfully deleted!'})
        } catch (error) {
            errorHandler(res, error)
        }
    }

    export {
        getExpenses,
        createExpenses,
        deleteExpenses
    }