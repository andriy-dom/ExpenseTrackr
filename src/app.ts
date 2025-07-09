    import express from 'express';
    import { Request, Response } from 'express';
    import authRoutes from './routes/auth.ts';
    import adminOnlyRoutes from './routes/adminOnly.ts';

    const app = express();

    app.use(express.json());

    // http://localhost:3000
    app.use('/auth', authRoutes);
    app.use('/admin', adminOnlyRoutes);

    app.get('/', (req: Request, res: Response) => {
        res.send('Expense-Trackr API works')
    })

    export default app;