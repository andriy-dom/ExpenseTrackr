import db from '../db.ts';
import Archive from '../models/archive.ts';
import { Expenses } from '../controllers/expenses.ts';

export async function archiveOldExpenses(): Promise<void> {
  try {
    // DATE_SUB(дата, інтервал) — функція, яка від поточної дати віднімає заданий інтервал.
    const [oldExpenses]: [Expenses[]] = await db.query(`SELECT id, user_id, category, amount, currency, date FROM Expenses WHERE date < DATE_SUB(NOW(), INTERVAL 90 DAY)`); 
   
    if (oldExpenses.length === 0) return;

    // 2. Перенести у MongoDB
    const archiveDocs = oldExpenses.map( exp => ({
        userId: String(exp.user_id),
        category: exp.category,
        amount: Number(exp.amount),
        currency: exp.currency,
        date: new Date(exp.date),
        archivedAt: new Date()
    }));
    await Archive.insertMany(archiveDocs);

    // 3. Видалити з MySQL
    const ids = oldExpenses.map(exp => exp.id);
    if (ids.length > 0) {
        await db.query(`DELETE FROM Expenses WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    }
  } catch (error) {
    console.error('Error archiving old expenses:', error);
  }
} 