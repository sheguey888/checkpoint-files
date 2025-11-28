// Shopping Cart System using Procedural Programming

let cart = [];
let total = 0;

// Function to add an item to the cart
function addItem(name, price, quantity) {
    const item = { name, price, quantity };
    cart.push(item);
    total += price * quantity;
}

// Function to view the cart
function viewCart() {
    return cart.map(item => `${item.quantity} x ${item.name} - $${item.price.toFixed(2)}`).join('\n') + `\nTotal: $${total.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeItem(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        total -= cart[itemIndex].price * cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
    }
}

// Function to clear the cart
function clearCart() {
    cart = [];
    total = 0;
}