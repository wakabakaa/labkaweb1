// init_db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./restaurant.db', (err) => { // Шлях спрощено до кореня
    if (err) console.error("Помилка:", err.message);
    else {
        console.log('Підключення успішне. Оновлення структури БД...');

        db.serialize(() => {
            // 1. Створення таблиці МЕНЮ (як було)
            db.run("DROP TABLE IF EXISTS items");
            db.run(`CREATE TABLE items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT NOT NULL
            )`);
            const stmt_items = db.prepare("INSERT INTO items (name, description, price, category) VALUES (?, ?, ?, ?)");
            stmt_items.run("Філе Міньйон", "Ніжна яловичина, соус BBQ", 450.00, "Страви");
            stmt_items.run("Салат Капрезе", "Моцарела, томати", 185.50, "Салати");
            stmt_items.run("Лимонад 'Тропік'", "Лайм, м'ята", 75.00, "Напої");
            stmt_items.finalize();

            // 2. Створення таблиці БРОНЮВАННЯ (як було)
            db.run("DROP TABLE IF EXISTS reservations");
            db.run(`CREATE TABLE reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guest_name TEXT NOT NULL, room_number TEXT, check_in_date TEXT, check_out_date TEXT, status TEXT
            )`);
            db.run("INSERT INTO reservations (guest_name, room_number, check_in_date, check_out_date, status) VALUES ('Іванов А.С.', '101', '2025-11-03', '2025-11-05', 'Check-in')");

            // 3. НОВЕ: Таблиця ЗАМОВЛЕНЬ (Ordering Context)
            db.run("DROP TABLE IF EXISTS orders");
            db.run(`CREATE TABLE orders (
                id TEXT PRIMARY KEY,
                room_number TEXT NOT NULL,
                status TEXT NOT NULL,
                total_price REAL,
                created_at TEXT
            )`);

            // 4. НОВЕ: Деталі замовлення (зв'язок Many-to-Many)
            db.run("DROP TABLE IF EXISTS order_items");
            db.run(`CREATE TABLE order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT,
                item_id INTEGER,
                quantity INTEGER,
                FOREIGN KEY(order_id) REFERENCES orders(id),
                FOREIGN KEY(item_id) REFERENCES items(id)
            )`);

            console.log('✅ Базу даних успішно оновлено новими таблицями!');
        });
    }
});