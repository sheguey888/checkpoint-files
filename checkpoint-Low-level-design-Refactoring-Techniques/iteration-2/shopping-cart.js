// Iteration 2 - ADVANCED REFACTORING
// Improvements:
// 1. Observer Pattern for notifications (price drops, cart updates)
// 2. Builder Pattern for creating complex Product objects
// 3. Better separation of concerns with NotificationService
// 4. Enhanced modularity and testability
// 5. More professional structure

// ===== MODELS =====
class Product {
  constructor(id, name, price, category, stock, description = "", imageUrl = "", rating = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.description = description;
    this.imageUrl = imageUrl;
    this.rating = rating;
  }

  updatePrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;
    return { oldPrice, newPrice };
  }

  isInStock() {
    return this.stock > 0;
  }
}

// ===== BUILDER PATTERN: Product Builder =====
class ProductBuilder {
  constructor(id, name, price) {
    this.product = new Product(id, name, price, "General", 0);
  }

  withCategory(category) {
    this.product.category = category;
    return this;
  }

  withStock(stock) {
    this.product.stock = stock;
    return this;
  }

  withDescription(description) {
    this.product.description = description;
    return this;
  }

  withImageUrl(imageUrl) {
    this.product.imageUrl = imageUrl;
    return this;
  }

  withRating(rating) {
    this.product.rating = Math.max(0, Math.min(5, rating));
    return this;
  }

  build() {
    if (!this.product.isInStock()) {
      console.warn(`⚠️  Warning: Product "${this.product.name}" has no stock`);
    }
    return this.product;
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

  increaseQuantity(amount = 1) {
    this.quantity += amount;
  }

  updateQuantity(newQuantity) {
    this.quantity = Math.max(1, newQuantity);
  }
}

// ===== OBSERVER PATTERN: Notification System =====
class Observer {
  update(event, data) {
    throw new Error("update() must be implemented");
  }
}

class NotificationSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!(observer instanceof Observer)) {
      throw new Error("Observer must extend Observer class");
    }
    this.observers.push(observer);
    console.log(`✓ Observer subscribed`);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log(`✓ Observer unsubscribed`);
  }

  notify(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

class EmailNotificationObserver extends Observer {
  update(event, data) {
    switch (event) {
      case "ITEM_ADDED":
        console.log(`📧 [Email] New item added to cart: ${data.productName}`);
        break;
      case "PRICE_DROP":
        console.log(`📧 [Email] Price drop alert! ${data.productName} now $${data.newPrice} (was $${data.oldPrice})`);
        break;
      case "ORDER_CONFIRMED":
        console.log(`📧 [Email] Order confirmation sent to ${data.email} - Total: $${data.total.toFixed(2)}`);
        break;
      case "CART_CLEARED":
        console.log(`📧 [Email] Your cart has been cleared`);
        break;
    }
  }
}

class SMSNotificationObserver extends Observer {
  update(event, data) {
    switch (event) {
      case "PRICE_DROP":
        console.log(`📱 [SMS] Price Alert: ${data.productName} dropped to $${data.newPrice}!`);
        break;
      case "ORDER_CONFIRMED":
        console.log(`📱 [SMS] Order confirmed! Total: $${data.total.toFixed(2)}`);
        break;
    }
  }
}

class PushNotificationObserver extends Observer {
  update(event, data) {
    switch (event) {
      case "ITEM_ADDED":
        console.log(`🔔 [Push] Item added: ${data.productName}`);
        break;
      case "PRICE_DROP":
        console.log(`🔔 [Push] 🔥 Hot Deal! ${data.productName} - Save $${(data.oldPrice - data.newPrice).toFixed(2)}`);
        break;
    }
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
    return "Premium Member (20% off)";
  }
}

class GoldDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return total * 0.15;
  }

  getDescription() {
    return "Gold Member (15% off)";
  }
}

class RegularDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return total * 0.05;
  }

  getDescription() {
    return "Regular Member (5% off)";
  }
}

class NoDiscountStrategy extends DiscountStrategy {
  calculate(total) {
    return 0;
  }

  getDescription() {
    return "No membership discount";
  }
}

// ===== COUPON SYSTEM =====
class Coupon {
  constructor(code, discount, description = "") {
    this.code = code;
    this.discount = discount;
    this.description = description;
  }

  apply(total) {
    return Math.max(0, total - this.discount);
  }
}

class CouponManager {
  constructor() {
    this.coupons = new Map([
      ["SAVE10", new Coupon("SAVE10", 10, "Save $10 on your order")],
      ["SAVE20", new Coupon("SAVE20", 20, "Save $20 on your order")],
      ["SAVE50", new Coupon("SAVE50", 50, "Save $50 on your order")],
      ["WELCOME", new Coupon("WELCOME", 15, "New customer welcome discount")]
    ]);
  }

  getCoupon(code) {
    return this.coupons.get(code) || null;
  }

  isValid(code) {
    return this.coupons.has(code);
  }

  addCoupon(code, discount, description = "") {
    this.coupons.set(code, new Coupon(code, discount, description));
  }
}

// ===== SHOPPING CART WITH NOTIFICATIONS =====
class ShoppingCart extends NotificationSubject {
  constructor(discountStrategy = new NoDiscountStrategy()) {
    super();
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
      existingItem.increaseQuantity(quantity);
    } else {
      const cartItem = new CartItem(product, quantity);
      this.items.push(cartItem);
    }
    
    console.log(`✓ Added: ${product.name} (x${quantity}) to cart`);
    
    // Notify observers
    this.notify("ITEM_ADDED", {
      productName: product.name,
      quantity: quantity,
      price: product.price
    });
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
      console.log(`✓ ${coupon.description} (-$${coupon.discount})`);
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
      console.log("🛒 Cart is empty");
      return;
    }

    this.items.forEach(item => {
      const subtotal = item.getSubtotal();
      console.log(
        `📦 ${item.product.name} - $${item.product.price.toFixed(2)} x ${item.quantity} = $${subtotal.toFixed(2)}`
      );
    });
  }

  clear() {
    this.items = [];
    this.notify("CART_CLEARED", {});
    console.log("✓ Cart cleared");
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  _findItemByProductId(productId) {
    return this.items.find(item => item.product.id === productId);
  }
}

// ===== PRICE MONITORING SERVICE =====
class PriceMonitoringService extends NotificationSubject {
  constructor() {
    super();
    this.watchedProducts = new Map();
  }

  watchProduct(product) {
    this.watchedProducts.set(product.id, product);
    console.log(`👁️  Now watching price for: ${product.name}`);
  }

  updatePrice(productId, newPrice) {
    const product = this.watchedProducts.get(productId);
    
    if (!product) {
      console.log(`Product not found in watch list`);
      return;
    }

    const priceChange = product.updatePrice(newPrice);
    
    if (priceChange.newPrice < priceChange.oldPrice) {
      console.log(`\n🔥 PRICE DROP DETECTED!`);
      this.notify("PRICE_DROP", {
        productName: product.name,
        oldPrice: priceChange.oldPrice,
        newPrice: priceChange.newPrice,
        savings: priceChange.oldPrice - priceChange.newPrice
      });
    }
  }
}

// ===== CHECKOUT SERVICE =====
class CheckoutService {
  constructor(cart) {
    this.cart = cart;
  }

  processCheckout(customerEmail, couponCode = null) {
    console.log("\n" + "=".repeat(50));
    console.log("🛍️  PROCESSING CHECKOUT");
    console.log("=".repeat(50));

    if (this.cart.isEmpty()) {
      console.log("✗ Cannot checkout: Cart is empty");
      return null;
    }

    const total = this.cart.calculateTotal(couponCode);
    
    console.log(`\n💰 Final Total: $${total.toFixed(2)}`);
    console.log(`📊 Items: ${this.cart.getItemCount()}`);
    
    // Notify about order confirmation
    this.cart.notify("ORDER_CONFIRMED", {
      total: total,
      email: customerEmail,
      itemCount: this.cart.getItemCount()
    });

    console.log(`\n✓ Processing payment...`);
    console.log(`✓ Order confirmed!`);
    console.log("=".repeat(50));

    const order = {
      total: total,
      customerEmail: customerEmail,
      timestamp: new Date(),
      items: [...this.cart.items]
    };

    this.cart.clear();
    
    return order;
  }
}

// ===== TEST CODE =====
console.log("╔═══════════════════════════════════════════════════╗");
console.log("║   ITERATION 2: ADVANCED REFACTORING              ║");
console.log("║   - Observer Pattern for Notifications           ║");
console.log("║   - Builder Pattern for Products                 ║");
console.log("║   - Enhanced Modularity                          ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

// ===== 1. BUILD PRODUCTS USING BUILDER PATTERN =====
console.log("=== Building Products with Builder Pattern ===\n");

const laptop = new ProductBuilder(1, "Gaming Laptop", 999.99)
  .withCategory("Electronics")
  .withStock(10)
  .withDescription("High-performance gaming laptop with RTX 4070")
  .withImageUrl("https://example.com/laptop.jpg")
  .withRating(4.5)
  .build();

const mouse = new ProductBuilder(2, "Wireless Mouse", 25.50)
  .withCategory("Accessories")
  .withStock(50)
  .withDescription("Ergonomic wireless mouse")
  .withRating(4.2)
  .build();

const keyboard = new ProductBuilder(3, "Mechanical Keyboard", 75.00)
  .withCategory("Accessories")
  .withStock(30)
  .withDescription("RGB mechanical keyboard with blue switches")
  .withRating(4.7)
  .build();

console.log("✓ Products created successfully\n");

// ===== 2. SETUP OBSERVERS =====
console.log("=== Setting up Notification Observers ===\n");

const emailObserver = new EmailNotificationObserver();
const smsObserver = new SMSNotificationObserver();
const pushObserver = new PushNotificationObserver();

// ===== 3. CREATE SHOPPING CART WITH NOTIFICATIONS =====
const cart = new ShoppingCart(new PremiumDiscountStrategy());
cart.subscribe(emailObserver);
cart.subscribe(pushObserver);

console.log("\n=== Adding Items to Cart ===\n");
cart.addItem(laptop, 2);
cart.addItem(mouse, 1);
cart.addItem(keyboard, 1);

cart.displayItems();

// ===== 4. PRICE MONITORING SERVICE =====
console.log("\n=== Setting up Price Monitoring ===\n");

const priceMonitor = new PriceMonitoringService();
priceMonitor.subscribe(emailObserver);
priceMonitor.subscribe(smsObserver);
priceMonitor.subscribe(pushObserver);

priceMonitor.watchProduct(laptop);
priceMonitor.watchProduct(mouse);

console.log("\n=== Simulating Price Drop ===");
priceMonitor.updatePrice(1, 899.99); // Laptop price drop

// ===== 5. CHECKOUT =====
console.log("\n");
const total = cart.calculateTotal("WELCOME");

const checkoutService = new CheckoutService(cart);
checkoutService.processCheckout("premium.customer@example.com", "WELCOME");

console.log("\n=== Testing Another Scenario ===\n");

// Create a new cart with Gold membership
const cart2 = new ShoppingCart(new GoldDiscountStrategy());
cart2.subscribe(emailObserver);

cart2.addItem(mouse, 3);
cart2.addItem(keyboard, 2);
cart2.displayItems();
cart2.calculateTotal("SAVE10");

console.log("\n" + "=".repeat(50));
console.log("✅ ITERATION 2 COMPLETE");
console.log("=".repeat(50));
