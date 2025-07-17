// Завдання для оновлення курсів валют кожного дня о 03:00

import cron from 'node-cron';
import { fetchAndSaveRates } from '../services/exchangeRate.service';
import { archiveOldExpenses } from '../services/archive.service';

cron.schedule("0 3 * * *", async () => {
    console.log("[CRON] Updating exchange rates...");
    await fetchAndSaveRates();
})

cron.schedule("0 4 * * *", async () => {
    console.log("[CRON] Archiving old expenses...");
    await archiveOldExpenses();
})