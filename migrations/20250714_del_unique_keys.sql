DELETE t1 FROM ExchangeRates t1
INNER JOIN ExchangeRates t2
WHERE
  t1.id > t2.id
  AND t1.base_currency = t2.base_currency
  AND t1.target_currency = t2.target_currency;