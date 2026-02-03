// Iteration 0 - MESSY CODE (Intentionally Bad)
// This is the starting point with multiple code smells

class ShoppingCart {
  constructor() {
    this.items = [];
    this.users = [];
  }

  // PROBLEM: Long method doing too many things
  addItem(id, n, p, c, s) {
    // PROBLEM: Poor variable names (id, n, p, c, s)
    let i = this.items.find(x => x.id === id);
    if (i) {
      i.q = i.q + 1;
    } else {
      this.items.push({ id: id, n: n, p: p, c: c, s: s, q: 1 });
    }
    console.log("Item added");
    
    // PROBLEM: Tight coupling - cart directly manages notifications
    for (let u of this.users) {
      console.log("Notifying " + u + " about new item");
    }
  }

  removeItem(id) {
    let i = this.items.findIndex(x => x.id === id);
    if (i !== -1) {
      this.items.splice(i, 1);
      console.log("Item removed");
    }
  }

  // PROBLEM: Long method with multiple responsibilities
  calculateTotal(userType, coupon) {
    let t = 0;
    
    // Calculate base total
    for (let i = 0; i < this.items.length; i++) {
      t = t + this.items[i].p * this.items[i].q;
    }

    // PROBLEM: Duplicate discount logic scattered everywhere
    // Apply user discount
    if (userType === "premium") {
      t = t - (t * 0.2);
      console.log("Premium discount applied: 20%");
    } else if (userType === "gold") {
      t = t - (t * 0.15);
      console.log("Gold discount applied: 15%");
    } else if (userType === "regular") {
      t = t - (t * 0.05);
      console.log("Regular discount applied: 5%");
    }

    // Apply coupon
    if (coupon === "SAVE10") {
      t = t - 10;
      console.log("Coupon SAVE10 applied");
    } else if (coupon === "SAVE20") {
      t = t - 20;
      console.log("Coupon SAVE20 applied");
    } else if (coupon === "SAVE50") {
      t = t - 50;
      console.log("Coupon SAVE50 applied");
    }

    // PROBLEM: Magic numbers everywhere
    if (t > 100) {
      t = t - 5;
      console.log("Shipping discount applied");
    }

    return t;
  }

  // PROBLEM: Method doing multiple unrelated things
  checkout(userType, coupon, u) {
    let total = this.calculateTotal(userType, coupon);
    console.log("Total: $" + total);
    
    // PROBLEM: Notification logic mixed with checkout
    console.log("Sending email to " + u);
    console.log("Processing payment...");
    console.log("Order confirmed!");
    
    this.items = [];
    return total;
  }

  // PROBLEM: Poorly named method, unclear purpose
  sub(email) {
    this.users.push(email);
  }

  // PROBLEM: Notification logic embedded in cart
  notifyPriceDrop(productId, newPrice) {
    for (let u of this.users) {
      console.log("Price drop alert sent to " + u + " for product " + productId);
    }
  }

  // PROBLEM: Inconsistent method for displaying items
  show() {
    console.log("=== Cart Items ===");
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      console.log(item.n + " - $" + item.p + " x " + item.q + " = $" + (item.p * item.q));
    }
  }
}

// TEST CODE
console.log("=== ITERATION 0: MESSY CODE ===\n");

let cart = new ShoppingCart();

// Subscribe users
cart.sub("user1@example.com");
cart.sub("user2@example.com");

// Add items (poor parameter names make it hard to understand)
cart.addItem(1, "Laptop", 999.99, "Electronics", 10);
cart.addItem(2, "Mouse", 25.50, "Accessories", 50);
cart.addItem(3, "Keyboard", 75.00, "Accessories", 30);
cart.addItem(1, "Laptop", 999.99, "Electronics", 10); // Adding duplicate

console.log("\n");
cart.show();

console.log("\n=== Calculating Total ===");
let total = cart.calculateTotal("premium", "SAVE20");
console.log("Final Total: $" + total);

console.log("\n=== Price Drop Notification ===");
cart.notifyPriceDrop(1, 899.99);

console.log("\n=== Checkout ===");
cart.checkout("premium", "SAVE20", "customer@example.com");
