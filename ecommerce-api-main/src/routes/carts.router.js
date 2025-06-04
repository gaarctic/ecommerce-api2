const express = require('express');
const router = express.Router();
const CartService = require('../services/carts.service');

const cartService = new CartService();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;