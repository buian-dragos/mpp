const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Worker } = require('worker_threads');
const cors = require('cors');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());

// let products = [
//     { id: 1, name: 'Teava metalica 50x30x2mm', price: 89.90 },
//     { id: 2, name: 'Masina tuns iarba', price: 1349.00 },
//     { id: 3, name: 'Lopata', price: 26.50 },
//     { id: 4, name: 'Horn', price: 200.99 },
//     { id: 5, name: 'Bach', price: 99999.99 }
//   ];


const generateProducts = () => {
  const products = new Map();
  while (products.size < 20) {
    const name = faker.commerce.product();
    if (!products.has(name)) {
      products.set(name, {
        id: products.size + 1,
        name: name,
        price: parseFloat(faker.commerce.price({min: 10, max: 300})),
      });
    }
  }
  return Array.from(products.values());
};
  
let products = generateProducts();

// const productWorker = new Worker('./worker.js');
// productWorker.postMessage(products.length);

// productWorker.on('message', (newProduct) => {
//     newProduct.id = products.length + 1;
//     products.push(newProduct);
//     console.log('Added new product:', newProduct);

//     broadcast({ type: 'new-product', data: newProduct });
// });

app.get('/api/health', (req, res) => {
  res.send('OK');
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
      const { type, data } = JSON.parse(message);

      switch (type) {
          case 'add-product':
              const newProduct = { ...data, id: products.length + 1 };
              products.push(newProduct);
              broadcast({ type: 'products', data: products });
              break;
          case 'update-product':
              const index = products.findIndex(p => p.id === data.id);
              if (index !== -1) {
                  products[index] = { ...products[index], ...data };
                  broadcast({ type: 'products', data: products });
              }
              break;
          case 'delete-product':
              products = products.filter(p => p.id !== data);
              broadcast({ type: 'products', data: products });
              break;
      }
  });

  ws.send(JSON.stringify({ type: 'products', data: products }));

  ws.on('close', () => console.log('Client disconnected'));
});

const broadcast = (data) => {
  wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
      }
  });
};

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
  

module.exports = app;

// setInterval(() => {
//   const newProduct = {
//       id: products.length + 1,
//       name: faker.commerce.product(),
//       price: parseFloat(faker.commerce.price({min: 10, max: 300}))
//   };
//   products.push(newProduct);
//   console.log('Added new product:', newProduct);
//   return;
// }, 10000); 

// setInterval(() => {
//   const name = faker.commerce.product();
//   if (!products.some(p => p.name === name)) {
//       const newProduct = {
//           id: products.length + 1,
//           name: name,
//           price: parseFloat(faker.commerce.price({min: 10, max: 300}))
//       };
//       products.push(newProduct);
//       console.log('Added new product:', newProduct);
//       return;
//   }

// }, 10000); 