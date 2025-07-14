ALTER TABLE ExchangeRates
ADD CONSTRAINT unique_base_target UNIQUE (base_currency, target_currency);