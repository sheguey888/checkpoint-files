import ShoppingCartSingleton from "./shopping-cart-singleton.js";
import ShoppingCartModule from "./shopping-cart-module.js";

console.log("=== Singleton Pattern Demo ===");
ShoppingCartSingleton.addItem("Apple", 1.5, 2);
ShoppingCartSingleton.addItem("Orange", 2.0, 3);
ShoppingCartSingleton.viewCart();
ShoppingCartSingleton.removeItem("Apple");
ShoppingCartSingleton.viewCart();

console.log("\n=== Module Pattern Demo ===");
ShoppingCartModule.addItem("Banana", 0.5, 5);
ShoppingCartModule.addItem("Milk", 3.0, 1);
ShoppingCartModule.viewCart();
