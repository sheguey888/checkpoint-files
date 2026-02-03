// Iteration 1 - FIRST REFACTORING
// Improvements:
// 1. Extract methods to reduce complexity
// 2. Proper naming conventions
// 3. Introduce Strategy Pattern for discounts
// 4. Separate concerns (Product class)
// 5. Remove code duplication

// ===== MODELS =====
class Product {
  constructor(id, name, price, category, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
  }
}

class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal() {
    return this.product.price * this.quantity;
  }

  increaseQuantity() {
    this.quantity++;
  }
}

// ===== STRATEGY PATTERN: Discount Strategies =====
class DiscountStrategy {
  calculate(total) {
    throw new Error("calculate() must be implemented");
  }

  getDescription() {
    throw new Error("getDescription() must be implemented");
  }
}

class PremiumDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return total * 0.20;
  }

  getDescription() {
    return "Premium discount (20%)";
  }
}

class GoldDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return total * 0.15;
  }

  getDescription() {
    return "Gold discount (15%)";
  }
}

class RegularDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return total * 0.05;
  }

  getDescription() {
    return "Regular discount (5%)";
  }
}

class NoDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return 0;
  }

  getDescription() {
    return "No discount";
  }
}

// ===== COUPON SYSTEM =====
class Coupon {
  constructor(code, discount) {
    this.code = code;
    this.discount = discount;
  }

  apply(total) {
    return Math.max(0, total - this.discount);
  }
}

class CouponManager {
  constructor() {
    this.coupons = new Map([
      ["SAVE10", new Coupon("SAVE10", 10)],
      ["SAVE20", new Coupon("SAVE20", 20)],
      ["SAVE50", new Coupon("SAVE50", 50)]
    ]);
  }

  getCoupon(code) {
    return this.coupons.get(code) || null;
  }

  isValid(code) {
    return this.coupons.has(code);
  }
}

// ===== SHOPPING CART =====
class ShoppingCart {
  constructor(discountStrategy = new NoDiscountStrategy()) {
    this.items = [];
    this.discountStrategy = discountStrategy;
    this.couponManager = new CouponManager();
    this.FREE_SHIPPING_THRESHOLD = 100;
    this.SHIPPING_DISCOUNT = 5;
  }

  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
  }

  addItem(product, quantity = 1) {
    const existingItem = this._findItemByProductId(product.id);
    
    if (existingItem) {
      existingItem.increaseQuantity();
    } else {
      const cartItem = new CartItem(product, quantity);
      this.items.push(cartItem);
    }
    
    console.log(`✓ Added: ${product.name} to cart`);
  }

  removeItem(productId) {
    const index = this.items.findIndex(item => item.product.id === productId);
    
    if (index !== -1) {
      const removedItem = this.items.splice(index, 1)[0];
      console.log(`✓ Removed: ${removedItem.product.name} from cart`);
      return true;
    }
    
    console.log(`✗ Product not found in cart`);
    return false;
  }

  calculateSubtotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  calculateDiscount(subtotal) {
    return this.discountStrategy.calculate(subtotal);
  }

  applyCoupon(total, couponCode) {
    if (!couponCode) return total;

    const coupon = this.couponManager.getCoupon(couponCode);
    if (coupon) {
      console.log(`✓ Coupon ${couponCode} applied (-$${coupon.discount})`);
      return coupon.apply(total);
    }
    
    console.log(`✗ Invalid coupon code: ${couponCode}`);
    return total;
  }

  applyShippingDiscount(total) {
    if (total > this.FREE_SHIPPING_THRESHOLD) {
      console.log(`✓ Free shipping bonus (-$${this.SHIPPING_DISCOUNT})`);
      return total - this.SHIPPING_DISCOUNT;
    }
    return total;
  }

  calculateTotal(couponCode = null) {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    
    console.log(`\n--- Price Breakdown ---`);
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    
    if (discount > 0) {
      console.log(`${this.discountStrategy.getDescription()}: -$${discount.toFixed(2)}`);
    }
    
    let total = subtotal - discount;
    total = this.applyCoupon(total, couponCode);
    total = this.applyShippingDiscount(total);
    
    return total;
  }

  displayItems() {
    console.log("\n=== Shopping Cart ===");
    
    if (this.items.length === 0) {
      console.log("Cart is empty");
      return;
    }

    this.items.forEach(item => {
      const subtotal = item.getSubtotal();
      console.log(
        `${item.product.name} - $${item.product.price} x ${item.quantity} = $${subtotal.toFixed(2)}`
      );
    });
  }

  clear() {
    this.items = [];
    console.log("✓ Cart cleared");
  }

  isEmpty() {
    return this.items.length === 0;
  }

  _findItemByProductId(productId) {
    return this.items.find(item => item.product.id === productId);
  }
}

// ===== CHECKOUT SERVICE =====
class CheckoutService {
  constructor(cart) {
    this.cart = cart;
  }

  processCheckout(customerEmail, couponCode = null) {
    console.log("\n=== Processing Checkout ===");

    if (this.cart.isEmpty()) {
      console.log("✗ Cannot checkout: Cart is empty");
      return null;
    }

    const total = this.cart.calculateTotal(couponCode);
    
    console.log(`\nFinal Total: $${total.toFixed(2)}`);
    console.log(`\n✓ Sending confirmation email to ${customerEmail}`);
    console.log(`✓ Processing payment...`);
    console.log(`✓ Order confirmed!`);

    this.cart.clear();
    
    return {
      total: total,
      customerEmail: customerEmail,
      timestamp: new Date()
    };
  }
}

// ===== TEST CODE =====
console.log("=== ITERATION 1: FIRST REFACTORING ===\n");

// Create products
const laptop = new Product(1, "Laptop", 999.99, "Electronics", 10);
const mouse = new Product(2, "Mouse", 25.50, "Accessories", 50);
const keyboard = new Product(3, "Keyboard", 75.00, "Accessories", 30);

// Create cart with Premium discount strategy
const cart = new ShoppingCart(new PremiumDiscountStrategy());

// Add items
cart.addItem(laptop);
cart.addItem(mouse);
cart.addItem(keyboard);
cart.addItem(laptop); // Add duplicate

// Display cart
cart.displayItems();

// Calculate total with coupon
const total = cart.calculateTotal("SAVE20");
console.log(`\n💰 Final Total: $${total.toFixed(2)}`);

// Checkout
const checkoutService = new CheckoutService(cart);
const order = checkoutService.processCheckout("customer@example.com", "SAVE20");

console.log("\n=== Testing Different Discount Strategies ===");

// Test Gold discount
const cart2 = new ShoppingCart(new GoldDiscountStrategy());
cart2.addItem(laptop);
cart2.addItem(mouse);
cart2.displayItems();
cart2.calculateTotal("SAVE10");

console.log("\n=== Iteration 1 Complete ===");
