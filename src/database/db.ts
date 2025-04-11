import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

await db.ping();

console.log('db connected');

export { db };
