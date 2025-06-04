const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, '../data/products.json');
        this.products = [];
        this.io = null; 
        this.initialize();
    }
    setSocketIO(io) {
        this.io = io;
    }

    async initialize() {
        try {
            await this.readProductsFromFile();
        } catch (error) {
            await this.writeProductsToFile();
        }
    }

    async readProductsFromFile() {
        const data = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);
    }

    async writeProductsToFile() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        if (this.io) {
            this.io.emit('updateProducts', this.products);
        }
    }

    async getProducts() {
        await this.readProductsFromFile();
        return this.products;
    }

    async getProductById(id) {
        await this.readProductsFromFile();
        const product = this.products.find(p => p.id == id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async addProduct(productData) {
        await this.readProductsFromFile();
        
        const { title, description, code, price, status, stock, category, thumbnails } = productData;
        
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Missing required fields');
        }

        const id = this.generateId();
        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        };

        this.products.push(newProduct);
        await this.writeProductsToFile(); 
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        await this.readProductsFromFile();
        
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) throw new Error('Product not found');

        delete updatedFields.id;
        this.products[index] = { ...this.products[index], ...updatedFields };
        await this.writeProductsToFile(); 
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.readProductsFromFile();
        
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) throw new Error('Product not found');

        this.products.splice(index, 1);
        await this.writeProductsToFile(); 
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

module.exports = ProductManager;