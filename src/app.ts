import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import keys from './config/keys.ts';
import './jobs/cron.ts'
import authRoutes from './routes/auth.ts';
import adminOnlyRoutes from './routes/adminOnly.ts';
import expensesRoutes from './routes/expenses.ts'
import currencyRoutes from './routes/currency.ts'
import archiveRoutes from './routes/archive.ts';

const app = express();

app.use(express.json());

mongoose
    .connect(keys.mongoURL)
    .then((res) => console.log('Connected to mongoDB'))
    .catch((error) => console.log(error));

// http://localhost:3000
app.use('/auth', authRoutes);
app.use('/admin', adminOnlyRoutes);
app.use('/expenses', expensesRoutes);
app.use('/currency', currencyRoutes);
app.use('/archives', archiveRoutes);
    
app.get('/', (req: Request, res: Response) => {
    res.send('Expense-Trackr API works')
})

const PORT = 3000;

app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))
    
export default app;