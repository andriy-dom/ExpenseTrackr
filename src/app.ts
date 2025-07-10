    import express from 'express';
    import { Request, Response } from 'express';
    import './jobs/cron.ts'
    import authRoutes from './routes/auth.ts';
    import adminOnlyRoutes from './routes/adminOnly.ts';
    import expensesRoutes from './routes/expenses.ts'

    const app = express();

    app.use(express.json());

    // http://localhost:3000
    app.use('/auth', authRoutes);
    app.use('/admin', adminOnlyRoutes);
    app.use('/expenses', expensesRoutes);

    app.get('/', (req: Request, res: Response) => {
        res.send('Expense-Trackr API works')
    })

    const PORT = 3000;

    app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))
    
    export default app;