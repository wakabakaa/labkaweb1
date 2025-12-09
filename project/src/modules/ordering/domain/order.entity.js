class OrderEntity {
    constructor(id, roomNumber, items, totalPrice, status = 'NEW') {
        if (!roomNumber) throw new Error("Room number is required");
        if (!items || items.length === 0) throw new Error("Order must have at least one item");
        
        this.id = id;
        this.roomNumber = roomNumber;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = OrderEntity;