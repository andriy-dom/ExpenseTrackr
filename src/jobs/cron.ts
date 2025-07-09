    import cron from 'node-cron';
    import { fetchAndSaveRates } from '../services/exchangeRate.service';

    cron.schedule("0 3 * * *", async () => {
        console.log("[CRON] Updating exchange rates...");
        await fetchAndSaveRates();
    })