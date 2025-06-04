const { httpServer } = require('./app'); 
const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});