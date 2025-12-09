// tests/api.test.js
const request = require('supertest');
const app = require('../src/server');

describe('POST /reservations (Тестування створення бронювання)', () => {

  // -------------------------------------------------------------
  // Умова А: Успішний випадок (коректні дані → очікуваний результат)
  // -------------------------------------------------------------
  it('повинен успішно створити бронювання, якщо дані коректні', async () => {
    const newReservation = {
      guest_name: 'Test User', // Обов'язкове поле є
      room_number: 101,
      check_in_date: '2025-01-01',
      check_out_date: '2025-01-05'
    };

    const res = await request(app)
      .post('/reservations')
      .send(newReservation);

    // Очікуємо статус 201 (Created)
    expect(res.statusCode).toEqual(201);
    // Очікуємо, що в відповіді повернеться статус success
    expect(res.body.status).toEqual('success');
    // Перевіряємо, чи повернулося ім'я, яке ми відправили
    expect(res.body.guest_name).toEqual('Test User');
  });

  // -------------------------------------------------------------
  // Умова Б: Помилковий випадок (відсутнє обов’язкове поле → помилка)
  // -------------------------------------------------------------
  it('повинен повернути помилку 400, якщо відсутнє поле guest_name', async () => {
    const invalidReservation = {
      room_number: 202,
      check_in_date: '2025-02-01'
      // guest_name ВІДСУТНЄ
    };

    const res = await request(app)
      .post('/reservations')
      .send(invalidReservation);

    // Очікуємо статус 400 (Bad Request)
    expect(res.statusCode).toEqual(400);
    // Очікуємо повідомлення про помилку
    expect(res.body.error).toMatch(/обов'язковим/);
  });

});