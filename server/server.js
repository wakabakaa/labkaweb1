// server/server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 
const app = express();
const port = 3000;

// Middleware: Дозволяє клієнту робити запити до сервера
app.use(cors()); 

// Підключення до бази даних
// const db = new sqlite3.Database('./server/restaurant.db', sqlite3.OPEN_READONLY, (err) => {
//     if (err) {
//         // Якщо БД не знайдено, переконайтеся, що ви запустили init_db.js
//         console.error("❌ Помилка підключення до БД. Переконайтеся, що restaurant.db існує:", err.message);
//         process.exit(1); 
//     } else {
//         console.log('✅ Сервер успішно підключено до БД SQLite.');
//     }
// });
const path = require('path');

const db = new sqlite3.Database(
    path.join(__dirname, 'restaurant.db'),
    sqlite3.OPEN_READONLY,
    (err) => {
        if (err) {
            console.error("❌ Помилка підключення до БД. Переконайтеся, що restaurant.db існує:", err.message);
            process.exit(1); 
        } else {
            console.log('✅ Сервер успішно підключено до БД SQLite.');
        }
    }
);



// ===============================================
// 1. Endpoint: GET /items (Меню Ресторану)
// ===============================================
app.get('/items', (req, res) => {
    // Включаємо поле 'category'
    const sql = 'SELECT id, name, description, price, category FROM items ORDER BY id';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("❌ Помилка при виконанні SQL-запиту /items:", err.message);
            res.status(500).json({"error": "Помилка сервера при отриманні даних меню."});
            return;
        }
        
        res.json({
            "status": "success",
            "message": "Дані меню успішно отримано.",
            "data": rows
        });
    });
});

// ===============================================
// 2. Endpoint: GET /reservations (Бронювання Готелю)
// ===============================================
app.get('/reservations', (req, res) => {
    // Цей маршрут обробляє запит на /reservations
    const sql = 'SELECT id, guest_name, room_number, check_in_date, check_out_date, status FROM reservations ORDER BY id';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("❌ Помилка при виконанні SQL-запиту /reservations:", err.message);
            res.status(500).json({"error": "Помилка сервера при отриманні даних бронювання."});
            return;
        }
        
        res.json({
            "status": "success",
            "message": "Дані бронювання успішно отримано.",
            "data": rows
        });
    });
});

// ===============================================
// Запуск Сервера
// ===============================================
app.listen(port, () => {
    console.log(`🚀 Бекенд-сервер запущено!`);
    console.log(`➡️ Доступно за адресою: http://localhost:${port}`);
    console.log(`➡️ API Endpoints: /items та /reservations`);
});