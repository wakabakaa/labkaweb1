const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Створюємо базу даних прямо в корені (файл restaurant.db)
const dbPath = path.resolve(__dirname, 'restaurant.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Помилка відкриття БД:", err.message);
    } else {
        console.log(`✅ Підключено до БД: ${dbPath}`);

        db.serialize(() => {
            // 1. Таблиця Items (Меню)
            db.run("DROP TABLE IF EXISTS items");
            db.run(`CREATE TABLE items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT NOT NULL
            )`);
            const stmt = db.prepare("INSERT INTO items (name, description, price, category) VALUES (?, ?, ?, ?)");
            stmt.run("Філе Міньйон", "Ніжна яловичина, соус BBQ", 450.00, "Страви");
            stmt.run("Салат Капрезе", "Моцарела, томати", 185.50, "Салати");
            stmt.run("Лимонад 'Тропік'", "Лайм, м'ята", 75.00, "Напої");
            stmt.finalize();

            // 2. Таблиця Reservations (Бронювання)
            db.run("DROP TABLE IF EXISTS reservations");
            db.run(`CREATE TABLE reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guest_name TEXT NOT NULL, room_number TEXT, check_in_date TEXT, check_out_date TEXT, status TEXT
            )`);
            db.run("INSERT INTO reservations (guest_name, room_number, check_in_date, check_out_date, status) VALUES ('Іванов А.С.', '101', '2025-11-03', '2025-11-05', 'Check-in')");

            // 3. ВАЖЛИВО: Таблиця Orders (Замовлення)
            db.run("DROP TABLE IF EXISTS orders");
            db.run(`CREATE TABLE orders (
                id TEXT PRIMARY KEY,
                room_number TEXT NOT NULL,
                status TEXT NOT NULL,
                total_price REAL,
                created_at TEXT
            )`);

            // 4. Деталі замовлення
            db.run("DROP TABLE IF EXISTS order_items");
            db.run(`CREATE TABLE order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT,
                item_id INTEGER,
                quantity INTEGER,
                FOREIGN KEY(order_id) REFERENCES orders(id),
                FOREIGN KEY(item_id) REFERENCES items(id)
            )`);

            console.log('✅ Таблиці успішно оновлено! (Items, Reservations, Orders)');
        });
    }
});
