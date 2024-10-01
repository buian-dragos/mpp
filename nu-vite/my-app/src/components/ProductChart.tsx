import React, { useState, useEffect } from 'react';
import { Product } from '../models/Product';
import { BarChart } from '@mui/x-charts/BarChart'; // Verify if this path is correct
import { PieChart } from '@mui/x-charts'; // Verify if this path is correct
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ProductChart = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "product-categories"), (querySnapshot) => {
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.data().id as number,
        ...doc.data() as Omit<Product, 'id'>
      }));
      setProducts(productsList);
    }, (error) => {
      console.log("Error fetching products:", error);
    });

    return () => unsubscribe();
  }, []);

  const productsDataset = products.map(product => ({
    name: product.name,
    price: product.price,
  }));

  const pieChartData = products.map(product => ({
    id: product.id,
    value: product.price,
    label: product.name,
  }));

  if (!products || products.length === 0) {
    return <div>No products!</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <BarChart
        dataset={productsDataset}
        xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
        series={[{ dataKey: 'price', label: 'Product Price' }]}
        width={800}
        height={480}
      />
      {/* <PieChart
        series={[
          {
            data: pieChartData,
          },
        ]}
        width={600}
        height={200}
      />  */}
    </div>
  );
};

export default ProductChart;
