const { v4: uuidv4 } = require('uuid');
const orderRepo = require('../infrastructure/order.repository');
const OrderEntity = require('../domain/order.entity');

class OrderService {
    async createOrder(roomNumber, itemsDto) {
        // 1. Бізнес-логіка: Рахуємо ціну (use-case logic)
        let totalPrice = 0;
        for (const item of itemsDto) {
            const price = await orderRepo.getItemPrice(item.itemId);
            totalPrice += price * item.quantity;
        }

        // 2. Створюємо доменну сутність (вона перевірить валідацію)
        const orderId = uuidv4();
        const order = new OrderEntity(orderId, roomNumber, itemsDto, totalPrice);

        // 3. Зберігаємо через репозиторій
        await orderRepo.save(order);

        // 4. Повертаємо результат (можна тут робити мапінг в DTO Response)
        return order;
    }

    async getAllOrders() {
        return await orderRepo.findAll();
    }
}

module.exports = new OrderService();