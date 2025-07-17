    import { ResultSetHeader } from 'mysql2';
    import { Request, Response } from 'express';
    import db from '../db.ts';
    import { AuthRequest } from '../middleware/authMiddleware'
    import errorHandler from '../utils/errorHandler.ts';
    import { ExchangeRates } from '../types/ExchangeRates.ts';
    import { Expenses } from '../types/Expenses.ts';

    const getUserExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user.id;
        const baseUrl = 'http://localhost:3000/expenses'
        try {
            const [expenses]: [Expenses[]] = await db.query(`SELECT id, amount, currency, category, description, date FROM Expenses WHERE user_id = ?`, [userId]);
            const expensesWithUrl = expenses.map(expense => ({ expense, delete:`${baseUrl}/${expense.id}` }))
            res.status(200).json(expensesWithUrl)
        } catch (error) {
            errorHandler(res, error)
        }
    }

    const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { period = "mounth", currency = "UAH" } = req.query;
            const targetCurrency = String(req.query.currency || "UAH");
            const today = new Date();
            let startDate: string;

            if (period === "day") {
                startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
            } else {
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0"); //07
                startDate = `${year}-${month}-01`;
            }
            
            // Отримуємо всі витрати користувача за цей період
            const [expenses]: [ Expenses[] ] = await db.execute(`SELECT category, amount, currency FROM Expenses WHERE user_id = ? AND date >= ?`, [userId, startDate]);

            //Отримуємо курси валют з бази
            const [rates]: [ ExchangeRates[] ] = await db.execute(`SELECT base_currency, target_currency, rate FROM ExchangeRates WHERE target_currency = ?`, [targetCurrency])

            // Формуємо map для швидкого доступу до курсів
            const rateMap = new Map<string, number>(); // створює порожню мапу для зберігання курсів валют

            for (const row of rates) {  // for...of наповнює цю мапу даними.
                if (row.base_currency === targetCurrency) {
                    rateMap.set(targetCurrency, 1);
                } else {
                    rateMap.set(row.base_currency, row.rate)
                }
            }

            const totals: { [category: string]: number } = {}; // створює порожній об'єкт для зберігання сум по категоріях. [category: string]-Це не масив, а об’єкт із довільними ключами-рядками.

            for (const exp of expenses) {
                const rate = exp.currency === targetCurrency ? 1 : rateMap.get(exp.currency);

                if (!rate) continue; //цей запис пропускається і цикл переходить до наступної витрати.
                
                const amount = Number(exp.amount) * rate;

                if (!totals[exp.category]) {
                    totals[exp.category] = 0; //створюємо порожню категорію з початковим значенням 0.
                }

                totals[exp.category] += amount;
            }
            
            res.status(200).json({
                period,
                currency: targetCurrency,
                totals
            })
        } catch (error) {
            errorHandler(res, error);
        }
    }

    const createExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
        const { user_id, category, amount, currency, description, date }: Expenses = req.body
        try {
            const [expenses] = await db.query(`INSERT INTO Expenses (user_id, category, amount, currency, description, date) VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, category, amount, currency, description, date]);
            res.status(200).json({ id: expenses.insertId})
        } catch (error) {
            errorHandler(res, error)
        }
    }

    const deleteExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
        const id = req.params.id;
        const userId = req.user?.id; 
        try {
            const [result] = await db.query<ResultSetHeader>(
                `DELETE FROM Expenses WHERE id = ? AND user_id = ?`,
                [id, userId]
            );
            if (result.affectedRows === 0) { //affectedRows - це властивість, яка показує, скільки рядків було вплинуто на базу даних.
                res.status(404).json({ message: "Expense not found or not yours" });
                return;
            }
            res.status(200).json({ message: `Expense with id: ${id} successfully deleted!` });
        } catch (error) {
            errorHandler(res, error)
        }
    }
    
    export {
        getUserExpenses,
        createExpenses,
        deleteExpenses,
        getStats
    }