class DiscountStrategy {
    constructor() {
        this.strategies = {};
    }

    addStrategy(name, strategy) {
        this.strategies[name] = strategy;
    }

    applyStrategy(name, total) {
        if (!this.strategies[name]) {
            throw new Error(`Strategy ${name} not found`);
        }
        return this.strategies[name](total);
    }
}

// Example discount strategies
const percentageDiscount = (total) => total * 0.9; // 10% discount
const fixedDiscount = (total) => total - 5; // $5 discount

// Usage
const discountStrategy = new DiscountStrategy();
discountStrategy.addStrategy('percentage', percentageDiscount);
discountStrategy.addStrategy('fixed', fixedDiscount);

// Exporting the DiscountStrategy class
export default discountStrategy;