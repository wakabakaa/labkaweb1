// client/scripts.js

const API_BASE_URL = 'http://localhost:3000';

// ===========================================
// Функція для завантаження та відображення МЕНЮ (items)
// ===========================================
async function loadItems() {
    const listElement = document.getElementById('items-list');
    listElement.innerHTML = '<p>⏳ Завантаження меню...</p>'; 

    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        if (!response.ok) throw new Error(`HTTP Error! Статус: ${response.status}`);
        
        const result = await response.json();
        const items = result.data;

        if (items.length === 0) {
            listElement.innerHTML = '<p>Меню порожнє.</p>';
            return;
        }

        listElement.innerHTML = ''; 
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('item');
            
            const formattedPrice = item.price.toFixed(2); 

            div.innerHTML = `
                <div class="item-info">
                    <span class="name">${item.name} <span style="font-size: 0.8em; color: #3f51b5;">(${item.category})</span></span>
                    <div class="description">${item.description}</div>
                </div>
                <span class="price">${formattedPrice} грн</span>
            `;
            listElement.appendChild(div);
        });

    } catch (error) {
        listElement.innerHTML = `
            <p style="color: red; font-weight: bold;">❌ Помилка завантаження меню: ${error.message}</p>
            <p>Переконайтеся, що бекенд-сервер запущений.</p>
        `;
        console.error("Fetch Error /items:", error);
    }
}

// ===========================================
// Функція для завантаження та відображення БРОНЮВАНЬ (reservations)
// ===========================================
async function loadReservations() {
    const listElement = document.getElementById('reservations-list');
    listElement.innerHTML = '<p>⏳ Завантаження бронювань...</p>'; 

    try {
        const response = await fetch(`${API_BASE_URL}/reservations`);
        if (!response.ok) throw new Error(`HTTP Error! Статус: ${response.status}`);
        
        const result = await response.json();
        const reservations = result.data;

        if (reservations.length === 0) {
            listElement.innerHTML = '<p>Немає активних бронювань.</p>';
            return;
        }

        let html = '<table><thead><tr><th>Гість</th><th>Кімната</th><th>Заїзд</th><th>Виїзд</th><th>Статус</th></tr></thead><tbody>';

        reservations.forEach(res => {
            const statusClass = res.status === 'Check-in' ? 'status-in' : res.status === 'Reserved' ? 'status-res' : 'status-out';
            
            html += `
                <tr>
                    <td>${res.guest_name}</td>
                    <td>${res.room_number}</td>
                    <td>${res.check_in_date}</td>
                    <td>${res.check_out_date}</td>
                    <td class="${statusClass}">${res.status}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        listElement.innerHTML = html;

    } catch (error) {
        listElement.innerHTML = `
            <p style="color: red; font-weight: bold;">❌ Помилка завантаження бронювань: ${error.message}</p>
            <p>Переконайтеся, що бекенд-сервер запущений.</p>
        `;
        console.error("Fetch Error /reservations:", error);
    }
}