import mysql from 'mysql2/promise';
import keys from './config/keys.ts';


const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: keys.password,
    database: 'expenses_tracker'
})

export default db;