const CartManager = require('../dao/CartManager');

class CartService {
    constructor() {
        this.cartManager = new CartManager('./src/data/carts.json');
    }

    async createCart() {
        return await this.cartManager.createCart();
    }

    async getCartById(id) {
        return await this.cartManager.getCartById(id);
    }

    async addProductToCart(cartId, productId) {
        return await this.cartManager.addProductToCart(cartId, productId);
    }
}

module.exports = CartService;