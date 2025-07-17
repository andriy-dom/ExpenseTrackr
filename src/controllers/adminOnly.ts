import { ResultSetHeader } from 'mysql2';
import { Request, Response } from 'express';
import { User } from '../types/User.ts';
import { Expenses } from '../types/Expenses.ts';
import db from '../db.ts';
import errorHandler from '../utils/errorHandler.ts';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const [users]: [User[]] = await db.query(`SELECT id, username, email, role, is_blocked, created_at FROM Users`);
        if (users.length === 0) {
            res.status(404).json({ message: 'Users not found' });
            return;
        }

        res.status(200).json(users)
    } catch (error) {
        errorHandler(res, error)
    }
}

const block = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    try {
        await db.query(`UPDATE Users SET is_blocked = true WHERE id = ?`, [id]);

        res.status(200).json({ message: `User with id: ${id} has been blocked` });
    } catch (err) {
        errorHandler(res, err);
    }
}

const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const [expenses]: [ Expenses[] ] = await db.query(`SELECT * FROM Expenses`);
        if(expenses.length === 0) {
            res.status(404).json({ message: 'Expenses not found' }) 
        }

        res.status(200).json(expenses)
    } catch (error) {
        errorHandler(res, error)
    }
}

export {
    getAllUsers, 
    block,
    getAllExpenses
}