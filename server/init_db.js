const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./server/restaurant.db', (err) => {
    if (err) {
        console.error("Помилка при відкритті бази даних:", err.message);
    } else {
        console.log('Успішне підключення до SQLite БД.');

        db.serialize(() => {
            
            db.run("DROP TABLE IF EXISTS items"); 

            db.run(`
                CREATE TABLE items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    price REAL NOT NULL,
                    category TEXT NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error("Помилка при створенні таблиці items:", err.message);
                } else {
                    console.log('Таблиця items (Меню) успішно створена.');

                    const stmt_items = db.prepare("INSERT INTO items (name, description, price, category) VALUES (?, ?, ?, ?)");
                    
                    stmt_items.run("Філе Міньйон", "Ніжна яловичина, соус BBQ, картопляне пюре", 450.00, "Страви");
                    stmt_items.run("Салат Капрезе", "Моцарела, томати, базилік, оливкова олія", 185.50, "Салати");
                    stmt_items.run("Лимонад 'Тропік'", "Свіжі лайми, м'ята, тропічний сироп", 75.00, "Напої");
                    stmt_items.run("Чізкейк Нью-Йорк", "Класичний чізкейк, полуничний соус", 120.00, "Десерти");
                    stmt_items.run("Лосось на грилі", "Стейк лосося, лимон, броколі", 310.00, "Страви");
                    
                    stmt_items.finalize(() => {
                        console.log('Тестові дані для "Меню" успішно додано.');
                    });
                }
            });
        
            db.run("DROP TABLE IF EXISTS reservations"); 

            db.run(`
                CREATE TABLE reservations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    guest_name TEXT NOT NULL,
                    room_number TEXT,
                    check_in_date TEXT NOT NULL,
                    check_out_date TEXT NOT NULL,
                    status TEXT NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error("Помилка при створенні таблиці reservations:", err.message);
                } else {
                    console.log('Таблиця reservations (Бронювання) успішно створена.');

                    const stmt_reservations = db.prepare("INSERT INTO reservations (guest_name, room_number, check_in_date, check_out_date, status) VALUES (?, ?, ?, ?, ?)");
                    
                    stmt_reservations.run("Іванов А.С.", "101", "2025-11-03", "2025-11-05", "Check-in");
                    stmt_reservations.run("Петренко В.Ю.", "205", "2025-11-04", "2025-11-10", "Reserved");
                    stmt_reservations.run("Сидорова К.М.", "302", "2025-10-30", "2025-11-03", "Check-out");
                    
                    stmt_reservations.finalize(() => {
                        console.log('Тестові дані для "Бронювання" успішно додано.');
                        
        
                        db.close();
                    });
                }
            });
        });
    }
});