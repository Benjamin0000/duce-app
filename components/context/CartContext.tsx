import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total_cost, setTotal] = useState(0); 
  const [isCartScreen, setIsCartScreen] = useState(false);


  const calculateTotal = ()=>{
    let cost = 0;
    cart.forEach(item => {
        cost += (item.price * item.qty);
    });
    setTotal(cost); 
  }; 

  // Load cart from AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };
    loadCart();
  }, []);



  // Save cart to AsyncStorage when it changes
  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart));
    calculateTotal(); 
    console.log('from the cart')
  }, [cart]);

  const addToCart = (Item) => {
    // Check if item already exists in cart
    const itemIndex = cart.findIndex(item => item.id === Item.id);
  
    if (itemIndex !== -1) {
      // If the item exists, create a new cart array with the quantity incremented
      const updatedCart = cart.map((item, index) => 
        index === itemIndex ? { ...item, qty: item.qty + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // If the item doesn't exist, add it to the cart with qty 1
      setCart([...cart, { id: Item.id, name: Item.name, qty: 1, price: Item.selling_price, logo:Item.logo } ]);
    }
  };
  

  const removeFromCart = (itemId) => {

     // Check if item exists in the cart
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === itemIndex ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0); // Remove item if qty is 0

      setCart(updatedCart);
    }
  };

  const deleteFromCart = (itemId) =>{
    setCart(cart.filter(item => item.id !== itemId));
  }

  const getItem = (itemId) => {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      return cart[itemIndex]; 
    }
    return {}; 
  }

  return (
    <CartContext.Provider value={{ cart, total_cost, addToCart, removeFromCart, getItem, deleteFromCart, isCartScreen, setIsCartScreen }}>
      {children}
    </CartContext.Provider>
  );
};
