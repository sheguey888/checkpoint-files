class Product {
    constructor(name, price, quantity = 1) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.price * this.quantity;
    }

    increaseQuantity(amount) {
        this.quantity += amount;
    }

    decreaseQuantity(amount) {
        if (this.quantity - amount < 0) {
            throw new Error("Quantity cannot be negative");
        }
        this.quantity -= amount;
    }

    setQuantity(amount) {
        if (amount < 0) {
            throw new Error("Quantity cannot be negative");
        }
        this.quantity = amount;
    }
}

export default Product;