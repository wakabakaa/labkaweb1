// ЗВЕРНІТЬ УВАГУ: тут тепер дві крапки "../..", бо ми глибше в папках
const { run, all, get } = require('../../shared/database');

class OrderRepository {
    
    // Цей метод нам треба, щоб СЕРВІС міг дізнатися ціну (бізнес-логіка)
    async getItemPrice(itemId) {
        const item = await get("SELECT price FROM items WHERE id = ?", [itemId]);
        return item ? item.price : 0;
    }

    // Ми змінили назву з create() на save(), бо ми зберігаємо вже готову сутність
    async save(orderEntity) {
        // Зберігаємо саме замовлення
        await run(
            "INSERT INTO orders (id, room_number, status, total_price, created_at) VALUES (?, ?, ?, ?, ?)",
            [orderEntity.id, orderEntity.roomNumber, orderEntity.status, orderEntity.totalPrice, orderEntity.createdAt]
        );

        // Зберігаємо позиції
        for (const item of orderEntity.items) {
            await run(
                "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
                [orderEntity.id, item.itemId, item.quantity]
            );
        }
        
        return orderEntity;
    }

    async findAll() {
        // Тут логіка читання залишається схожою
        const rows = await all(`
            SELECT o.id, o.room_number, o.status, o.total_price 
            FROM orders o ORDER BY o.created_at DESC
        `);
        // (Для спрощення тут можна повертати rows, або робити повний мапінг як було раніше)
        return rows;
    }
}

module.exports = new OrderRepository();