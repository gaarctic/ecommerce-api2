const fs = require('fs');
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');

const productsRouter = require('./ecommerce-api-main/src/routes/products.router');
const cartsRouter = require('./ecommerce-api-main/src/routes/carts.router');
const viewsRouter = require('./ecommerce-api-main/src/routes/views.router');

const viewsPath = path.join(__dirname, 'views');
const layoutsDir = path.join(viewsPath, 'layouts');


if (!fs.existsSync(viewsPath)) {
  fs.mkdirSync(viewsPath, { recursive: true });
  console.log('✅ Pasta views criada em:', viewsPath);
}

if (!fs.existsSync(layoutsDir)) {
  fs.mkdirSync(layoutsDir, { recursive: true });
  console.log('✅ Pasta layouts criada em:', layoutsDir);
}

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer);


app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: layoutsDir,
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));

app.set('view engine', 'handlebars');
app.set('views', viewsPath);


console.log('=== VERIFICAÇÃO ===');
console.log('Caminho das views:', viewsPath);
console.log('Layouts dir:', layoutsDir);
console.log('Conteúdo views:', fs.existsSync(viewsPath) ? fs.readdirSync(viewsPath) : 'Pasta não existe');
console.log('Conteúdo layouts:', fs.existsSync(layoutsDir) ? fs.readdirSync(layoutsDir) : 'Pasta não existe');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


io.on('connection', (socket) => {
  console.log('Cliente conectado via WebSocket');

  socket.on('newProduct', async (product) => {
    const ProductManager = require('./dao/ProductManager');
    const pm = new ProductManager();
    const updatedProducts = await pm.addProduct(product);
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
    const ProductManager = require('./dao/ProductManager');
    const pm = new ProductManager();
    const updatedProducts = await pm.deleteProduct(productId);
    io.emit('updateProducts', updatedProducts);
  });
});

module.exports = { app, httpServer, io };