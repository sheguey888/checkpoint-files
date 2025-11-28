# Shopping Cart System

This project implements a shopping cart system using both procedural programming and design patterns in JavaScript. The goal is to demonstrate the evolution of a simple shopping cart application from a straightforward procedural approach to a more structured design pattern approach.

## Project Structure

```
checkpoint-design-patterns
├── src
│   ├── procedural
│   │   └── shopping-cart.js
│   ├── design-pattern
│   │   ├── cart.js
│   │   ├── product.js
│   │   └── discount-strategy.js
│   └── utils
│       └── helpers.js
├── tests
│   ├── procedural.test.js
│   └── design-pattern.test.js
├── package.json
└── README.md
```

## Features

- **Procedural Implementation**: 
  - A simple shopping cart system that allows adding, viewing, removing items, and clearing the cart.
  
- **Design Pattern Implementation**: 
  - Refactored to use design patterns for better structure and maintainability.
  - Utilizes a Singleton or Module pattern for the cart logic.
  - Implements a Product class for individual items.
  - Applies a Strategy pattern for discount calculations.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd checkpoint-design-patterns
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   - The application can be run using Node.js. Ensure you have Node.js installed, then execute:
   ```
   node src/procedural/shopping-cart.js
   ```

4. **Run tests**:
   - To run the tests for both procedural and design pattern implementations, use:
   ```
   npm test
   ```

## Testing

- The project includes unit tests for both the procedural and design pattern implementations. Tests are located in the `tests` directory and can be run using a testing framework specified in `package.json`.

## Conclusion

This project serves as an educational example of how to implement a shopping cart system in JavaScript, showcasing the transition from procedural programming to a more organized design pattern approach.