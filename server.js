const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const routes = require('./src/routes');

routes(app);

server.listen(port, function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...');
});