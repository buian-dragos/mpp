import React, { useState } from 'react';
import { Product } from '../models/Product';

const products: Product[] = [
  { id: 1, name: 'Teava metalica 50x30x2mm', price: 89.90 },
  { id: 2, name: 'Masina tuns iarba', price: 1349.00 },
  { id: 3, name: 'Lopata', price: 26.50 },
  { id: 4, name: 'Horn', price: 200.99 },
  { id: 5, name: 'Bach', price: 99999.99}
];

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [sortByName, setSortByName] = useState<boolean>(true);
  const [sortByPrice, setSortByPrice] = useState<boolean>(true);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'productName') {
      setProductName(value);
    } else if (name === 'productPrice') {
      setProductPrice(value);
    }
  };

  const handleAdd = () => {
    if (productName.trim() !== '' && productPrice.trim() !== '') {
      const newProduct: Product = {
        id: products.length + 1,
        name: productName,
        price: parseFloat(productPrice),
      };
      products.push(newProduct);
      setProductName('');
      setProductPrice('');
    }
  };

  const handleUpdate = () => {
    if (selectedProduct && productName.trim() !== '' && productPrice.trim() !== '') {
      selectedProduct.name = productName;
      selectedProduct.price = parseFloat(productPrice);
      setSelectedProduct(selectedProduct);
      setProductName('');
      setProductPrice('');
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      const index = products.indexOf(selectedProduct);
      products.splice(index, 1);
      setSelectedProduct(null);
    }
  };

  const handleSortByName = () => {
    setSortByName(!sortByName);
    products.sort((a, b) => {
      if (sortByName) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  };

  const handleSortByPrice = () => {
    setSortByPrice(!sortByPrice);
    products.sort((a, b) => {
      if (sortByPrice) {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-lg font-medium cursor-pointer" onClick={handleSortByName}>
                NAME
              </th>
              <th className="px-6 py-3 text-left text-lg font-medium tracking-wider cursor-pointer" onClick={handleSortByPrice}>
                PRICE
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`cursor-pointer ${
                  selectedProduct === product ? 'bg-gray-300' : ''
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === products.length - 1 ? 'rounded-b-lg' : ''
                }`}
                onClick={() => handleProductClick(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-500">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                  {product.price.toFixed(2)} RON
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex-1 space-y-2">
          <div className="flex-row space-x-2">
            <input
              className="input border-2 rounded-lg p-2"
              placeholder="Name"
              name="productName"
              value={productName}
              onChange={handleInputChange}
            />
            <input
              className="input border-2 rounded-lg p-2"
              placeholder="Price"
              name="productPrice"
              value={productPrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-row space-x-2">
            <button
              className=" bg-gray-400 py-2 px-4 rounded"
              type="button"
              onClick={handleAdd}
            >
              ADD
            </button>
            <button
              className=" bg-gray-400 py-2 px-4 rounded"
              type="button"
              onClick={handleUpdate}
            >
              UPDATE
            </button>
            <button
              className=" bg-gray-400 py-2 px-4 rounded"
              type="button"
              onClick={handleDelete}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList
