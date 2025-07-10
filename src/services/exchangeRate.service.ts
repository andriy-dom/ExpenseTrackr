// Сервіс для отримання та збереження курсів валют

    import axios from "axios";
    import db from '../db.ts';

    type RateResponse = {
        rates: {[currency:string]: number};
        base: string,
        date: string
    };

    const BASE_CURRENCY = "USD";
    const TARGET_CURRENCIES = ["EUR", "UAH", "GBP", "PLN"];

    export async function fetchAndSaveRates(): Promise<void> {
        try {
            const response = await axios.get<RateResponse>('https://api.exchangerate.host/latest', {
                params: {
                base: BASE_CURRENCY,
                symbols: TARGET_CURRENCIES.join(","),
                },
                }
                );
                
                const rates = response.data.rates;
                const updatedAt = new Date();

                for (const [targetCurrency, rate] of Object.entries(rates)) {  //[["EUR", 0.92], ["UAH", 40.1], ...]
                await db.execute(
                    `INSERT INTO ExchangeRates (base_currency, target_currency, rate, updated_at)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    rate = VALUES(rate),
                    updated_at = VALUES(updated_at)`,
                    [BASE_CURRENCY, targetCurrency, rate, updatedAt]
                );
                }

                console.log(`[ExchangeRate] Rates updated at ${updatedAt.toISOString()}`);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    }
