const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const ProductManager = require('../dao/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { 
      title: 'Produtos',
      products,
      layout: 'main' 
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).render('error', { error });
  }
});

module.exports = router;