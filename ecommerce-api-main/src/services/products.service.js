const ProductManager = require('../dao/ProductManager');

class ProductService {
    constructor() {
        this.productManager = new ProductManager('./src/data/products.json');
    }

    async getProducts() {
        return await this.productManager.getProducts();
    }

    async getProductById(id) {
        return await this.productManager.getProductById(id);
    }

    async addProduct(product) {
        return await this.productManager.addProduct(product);
    }

    async updateProduct(id, updatedFields) {
        return await this.productManager.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await this.productManager.deleteProduct(id);
    }
}

module.exports = ProductService;