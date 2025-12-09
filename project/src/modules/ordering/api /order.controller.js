const orderService = require('../service/order.service');

exports.create = async (req, res) => {
    try {
        // Отримуємо DTO (Data Transfer Object) з тіла запиту
        const { roomNumber, items } = req.body;

        // Викликаємо сервіс
        const result = await orderService.createOrder(roomNumber, items);

        // Повертаємо відповідь строго за схемою (201 Created)
        res.status(201).json(result);
    } catch (error) {
        // Обробка помилок валідації
        res.status(400).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};