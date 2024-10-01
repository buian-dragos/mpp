import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ProductList from './components/ProductList'
import './App.css'



function App() {
  return(
    <div>
      <h2>My Products</h2>
      <ProductList />
    </div>
  );
}

export default App
