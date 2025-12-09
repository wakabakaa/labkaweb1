const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Підключаємося до файлу в корені
const dbPath = path.resolve(__dirname, '../../../restaurant.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error("❌ DB Error:", err.message);
    else console.log('✅ Shared DB connected');
});

// Промісифікація (щоб писати await замість callback)
const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this); });
});
const all = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => { err ? reject(err) : resolve(rows); });
});
const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => { err ? reject(err) : resolve(row); });
});

module.exports = { db, run, all, get };