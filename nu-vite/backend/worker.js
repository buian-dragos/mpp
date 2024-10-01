const { parentPort } = require('worker_threads');
const { faker } = require('@faker-js/faker');

function addNewProduct() {
    const newProduct = {
        id: null, // This will be set by the main thread.
        name: faker.commerce.product(),
        price: parseFloat(faker.commerce.price({min: 10, max: 300}))
    };
    parentPort.postMessage(newProduct);
}

parentPort.on('message', (productsLength) => {
    setInterval(() => {
        addNewProduct();
    }, 30000);
});
