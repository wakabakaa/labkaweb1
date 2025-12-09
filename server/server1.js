const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Зверніть увагу: шлях змінився на /api/order.routes
const orderingRoutes = require('./src/modules/ordering/api/order.routes'); 
const { db } = require('./src/modules/shared/database');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// === ЗАВДАННЯ 3: Health Check ===
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

// === Підключення модулів ===
app.use('/api/orders', orderingRoutes);

// === Старі маршрути (для сумісності) ===
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) res.status(500).json({error: err.message});
        else res.json({data: rows});
    });
});

app.get('/reservations', (req, res) => {
    db.all('SELECT * FROM reservations', [], (err, rows) => {
        if (err) res.status(500).json({error: err.message});
        else res.json({data: rows});
    });
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`❤️ Health check: http://localhost:${port}/health`);
});