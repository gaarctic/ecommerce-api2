const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, '../data/carts.json');
        this.carts = [];
        this.initialize();
    }

    async initialize() {
        try {
            await this.readCartsFromFile();
        } catch (error) {
            await this.writeCartsToFile();
        }
    }

    async readCartsFromFile() {
        const data = await fs.readFile(this.path, 'utf-8');
        this.carts = JSON.parse(data);
    }

    async writeCartsToFile() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        await this.readCartsFromFile();
        
        const id = this.generateId();
        const newCart = {
            id,
            products: []
        };

        this.carts.push(newCart);
        await this.writeCartsToFile();
        return newCart;
    }

    async getCartById(id) {
        await this.readCartsFromFile();
        const cart = this.carts.find(c => c.id == id);
        if (!cart) throw new Error('Cart not found');
        return cart;
    }

    async addProductToCart(cartId, productId) {
        await this.readCartsFromFile();
        
        const cartIndex = this.carts.findIndex(c => c.id == cartId);
        if (cartIndex === -1) throw new Error('Cart not found');

        const cart = this.carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product == productId);

        if (productIndex === -1) {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        } else {
            cart.products[productIndex].quantity++;
        }

        this.carts[cartIndex] = cart;
        await this.writeCartsToFile();
        return cart;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

module.exports = CartManager;