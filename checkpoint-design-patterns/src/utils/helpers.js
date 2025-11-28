function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function validateInput(input) {
    return input !== null && input !== undefined && input !== '';
}

export { formatPrice, validateInput };