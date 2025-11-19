// backend/db.js
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

export default db;

