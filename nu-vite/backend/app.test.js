const request = require('supertest');
const app = require('./index'); // Ensure you export your app (express instance) from index.js

describe('API Tests', () => {
  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(20); // Because you're generating 20 products
  });

  it('should fetch a single product', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should return 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/999');
    expect(res.statusCode).toEqual(404);
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'New Product',
        price: 199.99,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'New Product');
  });

  it('should update an existing product', async () => {
    const updatedName = 'Updated Product Name';
    const updatedPrice = 150.99;
    const productIdToUpdate = 1;
  
    const res = await request(app)
      .put(`/api/products/${productIdToUpdate}`)
      .send({
        name: updatedName,
        price: updatedPrice,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', updatedName);
    expect(res.body).toHaveProperty('price', updatedPrice);
  });
  
  it('should delete an existing product', async () => {
    const productIdToDelete = 1;
    const deleteRes = await request(app).delete(`/api/products/${productIdToDelete}`);
    expect(deleteRes.statusCode).toEqual(200);
  
    const fetchRes = await request(app).get(`/api/products/${productIdToDelete}`);
    expect(fetchRes.statusCode).toEqual(404);
  });
  
});

