import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../models/Product';
import axios from 'axios';
import { updateDoc, writeBatch, deleteDoc, setDoc, addDoc, doc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';


const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [sortByName, setSortByName] = useState(false);
  // const socketRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log(user.uid)
      const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/product-categories`), (querySnapshot) => {
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.data().id as number,
          ...doc.data() as Omit<Product, 'id'>
        }));
        setProducts(productsList);
      }, (error) => {
        console.log(error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const openCategoryItems = (categoryId: number) => {
    if (user) {
      const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
      const q = query(categoriesRef, where("id", "==", categoryId));

      getDocs(q).then(querySnapshot => {
        const categoryDoc = querySnapshot.docs[0];
        if (categoryDoc) {
          const itemsRef = collection(db, `users/${user.uid}/product-categories/${categoryDoc.id}/items`);
          const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
            const itemsList = snapshot.docs.map(doc => ({
              id: doc.data().id as number,
              ...doc.data() as Omit<Product, 'id'>
            }));
            setItems(itemsList);
          });

          setSelectedCategory(categoryId);
          setProductName('');
          setProductPrice('');

          return () => unsubscribe();
        } else {
          setItems([]);
        }
      }).catch(error => {
        console.error("Error fetching category document:", error);
      });
    }
  };

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

  const handleAdd = async () => {
    if (user && productName.trim() !== '' && productPrice.trim() !== '') {
      let tempId = selectedCategory ? items.length + 1 : products.length + 1;
      const newProduct = {
        id: tempId,
        name: productName,
        price: parseFloat(productPrice),
      };

      if (selectedCategory !== null) {
        const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
        const q = query(categoriesRef, where("id", "==", selectedCategory));

        getDocs(q).then(querySnapshot => {
          const categoryDoc = querySnapshot.docs[0];
          if (categoryDoc) {
            const itemsRef = collection(db, `users/${user.uid}/product-categories/${categoryDoc.id}/items`);
            addDoc(itemsRef, newProduct).then(docRef => {
              console.log("New item added with ID:", docRef.id);
            }).catch(error => {
              console.error("Error adding item:", error);
            });
            setProductName('');
            setProductPrice('');
          }
        }).catch(error => {
          console.error("Error fetching category document:", error);
        });
      } else {
        const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
        addDoc(categoriesRef, newProduct).then(categoryRef => {
          console.log("New category added with ID:", categoryRef.id);
        }).catch(error => {
          console.error("Error adding new category:", error);
        });
        setProductName('');
        setProductPrice('');
      }
    }
  };

  const handleDelete = async () => {
    if (user) {
      if (selectedCategory !== null) {
        const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
        const categoryQuery = query(categoriesRef, where("id", "==", selectedCategory));

        const categorySnapshot = await getDocs(categoryQuery);
        if (!categorySnapshot.empty) {
          const categoryDocRef = categorySnapshot.docs[0].ref;
          if (selectedProduct) {
            const itemRef = collection(categoryDocRef, "items");
            const itemQuery = query(itemRef, where("id", "==", selectedProduct.id));
            const itemSnapshot = await getDocs(itemQuery);
            if (!itemSnapshot.empty) {
              const itemDocRef = itemSnapshot.docs[0].ref;
              await deleteDoc(itemDocRef);
              console.log("Item deleted successfully.");
              setItems(items => items.filter(item => item.id !== selectedProduct.id));
              setSelectedProduct(null);
            } else {
              console.log("No item found with the given ID");
            }
          }
        } else {
          console.log("No category found with the given ID");
        }
      } else {
        if (selectedProduct !== null) {
          const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
          const categoryQuery = query(categoriesRef, where("id", "==", selectedProduct.id));

          const categorySnapshot = await getDocs(categoryQuery);
          if (!categorySnapshot.empty) {
            const categoryDocRef = categorySnapshot.docs[0].ref;

            const itemsRef = collection(categoryDocRef, "items");
            const itemsSnapshot = await getDocs(itemsRef);

            const batch = writeBatch(db);
            itemsSnapshot.docs.forEach(doc => {
              batch.delete(doc.ref);
            });

            batch.delete(categoryDocRef);

            await batch.commit().then(() => {
              console.log("All items and the category deleted successfully.");
              setProducts(products => products.filter(product => product.id !== selectedProduct.id));
              setSelectedCategory(null);
              setItems([]);
            }).catch((error) => {
              console.error("Error during batch delete:", error);
            });
          } else {
            console.log("No category found with the given ID");
          }
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (user) {
      if (selectedCategory !== null) {
        const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
        const categoryQuery = query(categoriesRef, where("id", "==", selectedCategory));

        const categorySnapshot = await getDocs(categoryQuery);
        if (!categorySnapshot.empty) {
          const categoryDocRef = categorySnapshot.docs[0].ref;
          if (selectedProduct) {
            const itemsRef = collection(categoryDocRef, "items");
            const itemQuery = query(itemsRef, where("id", "==", selectedProduct.id));
            const itemSnapshot = await getDocs(itemQuery);
            if (!itemSnapshot.empty) {
              const itemDocRef = itemSnapshot.docs[0].ref;
              await updateDoc(itemDocRef, {
                name: productName,
                price: parseFloat(productPrice)
              }).then(() => {
                console.log("Item updated successfully.");
                setItems(prevItems => prevItems.map(item => item.id === selectedProduct.id ? { ...item, name: productName, price: parseFloat(productPrice) } : item));
              }).catch(error => {
                console.error("Error updating item:", error);
              });
            } else {
              console.log("No item found with the given ID");
            }
          }
        } else {
          console.log("No category found with the given ID");
        }
      } else {
        if (selectedProduct !== null) {
          const categoriesRef = collection(db, `users/${user.uid}/product-categories`);
          const categoryQuery = query(categoriesRef, where("id", "==", selectedProduct.id));

          const categorySnapshot = await getDocs(categoryQuery);
          if (!categorySnapshot.empty) {
            const categoryDocRef = categorySnapshot.docs[0].ref;
            await updateDoc(categoryDocRef, {
              name: productName,
              price: parseFloat(productPrice)
            }).then(() => {
              console.log("Category updated successfully.");
              setProducts(prevProducts => prevProducts.map(product => product.id === selectedCategory ? { ...product, name: productName, price: parseFloat(productPrice) } : product));
            }).catch(error => {
              console.error("Error updating category:", error);
            });
          }
        }
      }
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
    items.sort((a, b) => {
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
    items.sort((a, b) => {
      if (sortByPrice) {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  };

  const handleLogout = () => {
    auth.logout();
    <Navigate to="/login" state={{ from: location }} replace />
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
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
            {selectedCategory === null ? (
              products.map((product, index) => (
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
                    {product.price ? product.price : "0.00"} RON
                  </td>
                </tr>
              ))
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`cursor-pointer ${
                    selectedProduct === item ? 'bg-gray-300 rounded' : ''
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${
                    index === items.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                  onClick={() => handleProductClick(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                    {item.price ? item.price : "0.00"} RON
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex-1 space-y-2 items-center">
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
          <div className="space-x-2">
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
            <button
              className=" bg-gray-400 py-2 px-4 rounded"
              type="button"
              onClick={() => {
                handleLogout();
              }}
            >
              LOGOUT
            </button>
            {selectedCategory == null && selectedProduct && selectedProduct.id !== undefined && (
              <button
                className=" bg-gray-400 py-2 px-4 rounded"
                type="button"
                onClick={() => openCategoryItems(selectedProduct.id)}
              >
                OPEN
              </button>
            )}
            {selectedCategory !== null && (
              <div>
              <button
                className=" bg-gray-400 py-2 px-4 rounded"
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setProductName('');
                  setProductPrice('');
                }}
              >
                BACK
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
