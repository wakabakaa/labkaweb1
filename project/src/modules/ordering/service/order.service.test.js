const orderService = require('./order.service');
const orderRepo = require('../infrastructure/order.repository');

// === MOCK (Імітація) ===
// Ми кажемо Jest-у: "Не чіпай реальну базу даних, заміни репозиторій на пустишку"
jest.mock('../infrastructure/order.repository');

describe('OrderService Unit Tests', () => {
    
    // Очищаємо моки перед кожним тестом
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // === ТЕСТ 1: Успішний випадок (Вимога "a") ===
    test('createOrder успішно створює замовлення і рахує ціну', async () => {
        // 1. Arrange (Підготовка даних)
        const roomNumber = '101';
        const itemsDto = [{ itemId: 1, quantity: 2 }]; // 2 штуки товару

        // Налаштовуємо мок: нехай репозиторій каже, що ціна товару = 100
        orderRepo.getItemPrice.mockResolvedValue(100);
        // Нехай save просто повертає те, що йому дали
        orderRepo.save.mockImplementation(async (order) => order);

        // 2. Act (Виконання дії)
        const result = await orderService.createOrder(roomNumber, itemsDto);

        // 3. Assert (Перевірка результату)
        expect(result.roomNumber).toBe('101');
        expect(result.totalPrice).toBe(200); // 100 грн * 2 шт
        expect(result.status).toBe('NEW');
        
        // Перевіряємо, що сервіс дійсно викликав метод збереження
        expect(orderRepo.save).toHaveBeenCalledTimes(1);
    });

    // === ТЕСТ 2: Помилковий випадок (Вимога "b") ===
    test('createOrder викидає помилку, якщо список товарів порожній', async () => {
        // 1. Arrange
        const roomNumber = '101';
        const emptyItems = []; // Помилка: немає товарів

        // 2. Act & Assert (Ми очікуємо, що виклик впаде з помилкою)
        await expect(orderService.createOrder(roomNumber, emptyItems))
            .rejects
            .toThrow("Order must have at least one item"); // Текст помилки з Entity

        // Перевіряємо, що в базу нічого не намагалися записати
        expect(orderRepo.save).not.toHaveBeenCalled();
    });
});