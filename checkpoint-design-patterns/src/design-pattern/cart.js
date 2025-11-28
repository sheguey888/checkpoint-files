class ShoppingCart {
    constructor() {
        if (!ShoppingCart.instance) {
            this.items = [];
            ShoppingCart.instance = this;
        }
        return ShoppingCart.instance;
    }

    addItem(product) {
        this.items.push(product);
    }

    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
    }

    viewCart() {
        return this.items;
    }

    clearCart() {
        this.items = [];
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

const instance = new ShoppingCart();
Object.freeze(instance);

export default instance;