import React from 'react'
import { Prodcut } from '../models/Product'


const products: Prodcut[] = [
    {id: 1, name:'Salata',price:9001},
    {id: 2, name:'Sunca',price:30},
    {id: 3, name:'Salam',price:29},

]


export default function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <p>Name: {product.name}</p>
          <p>Price: {product.price}</p>
        </li>
      ))}
    </ul>
  )
}
