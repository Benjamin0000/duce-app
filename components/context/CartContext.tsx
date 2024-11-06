import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState({}); // Store carts for each branch as an object
  const [total_cost, setTotal] = useState(0); 
  const [isCartScreen, setIsCartScreen] = useState(false);
  const [branch, setBranch] = useState(null); // Current branch
  const [branches, setBranches] = useState([]); 
  const [authToken, setAuthToken] = useState({token:'', signedIn:false}); 
  const [defaultUserData, setDefaltUserData] = useState({name:'', mobile:'',  email: '', address:''}); 

  const calculateTotal = (currentCart) => {
    let cost = 0;
    currentCart.forEach(item => {
      cost += (item.price * item.qty);
    });
    setTotal(cost); 
  }; 

  // Load cart from AsyncStorage
  useEffect(() => {
    const loadCarts = async () => {
      const savedCarts = await AsyncStorage.getItem('carts');
      if (savedCarts) {
        setCarts(JSON.parse(savedCarts));
      }
    };
    loadCarts();

    const loadAuthToken = async ()=> {
      const savedToken = await AsyncStorage.getItem('authToken');
      if (savedToken) {
        setAuthToken(JSON.parse(savedToken));
      }
    }
    loadAuthToken(); 

    const loadDefaultUserInfo = async ()=> {
      const savedInfo = await AsyncStorage.getItem('savedUserInfo');
      if (savedInfo) {
        setDefaltUserData(JSON.parse(savedInfo));
      }
    }

    loadDefaultUserInfo(); 

    console.log('cart context has mounted');
    console.log('auth token')
    console.log(authToken)
  }, []);

  // Save carts to AsyncStorage when they change
  useEffect(() => {
    AsyncStorage.setItem('carts', JSON.stringify(carts));
    if (branch) {
      calculateTotal(carts[branch.id] || []); // Calculate total for the current branch's cart
    }
  }, [carts, branch]);

  useEffect(()=>{
    AsyncStorage.setItem('authToken', JSON.stringify(authToken));
  }, [authToken])

  useEffect(()=>{
    AsyncStorage.setItem('savedUserInfo', JSON.stringify(defaultUserData));
  }, [defaultUserData])

  const addToCart = (Item) => {
    if (!branch) return; // Do nothing if no branch is set

    // Get the current branch's cart
    const currentCart = carts[branch.id] || [];

    // Check if item already exists in the current cart
    const itemIndex = currentCart.findIndex(item => item.id === Item.id);
  
    let updatedCart;

    if (itemIndex !== -1) {
      // If the item exists, create a new cart array with the quantity incremented
      updatedCart = currentCart.map((item, index) => 
        index === itemIndex ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      // If the item doesn't exist, add it to the cart with qty 1
      updatedCart = [...currentCart, { id: Item.id, name: Item.name, qty: 1, price: Item.selling_price, logo: Item.logo }];
    }

    // Update the carts state for the current branch
    setCarts(prevCarts => ({
      ...prevCarts,
      [branch.id]: updatedCart,
    }));
  };
  
  const removeFromCart = (itemId) => {
    if (!branch) return; // Do nothing if no branch is set

    // Get the current branch's cart
    const currentCart = carts[branch.id] || [];

    // Check if item exists in the current cart
    const itemIndex = currentCart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      const updatedCart = currentCart.map((item, index) =>
        index === itemIndex ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0); // Remove item if qty is 0

      // Update the carts state for the current branch
      setCarts(prevCarts => ({
        ...prevCarts,
        [branch.id]: updatedCart,
      }));
    }
  };

  const deleteFromCart = (itemId) => {
    if (!branch) return; // Do nothing if no branch is set

    // Update the carts state for the current branch
    setCarts(prevCarts => ({
      ...prevCarts,
      [branch.id]: prevCarts[branch.id].filter(item => item.id !== itemId),
    }));
  };

  const emptyCart = () => {
    if (!branch) return; // Do nothing if no branch is set
    // Update the carts state for the current branch by setting it to an empty array
    setCarts(prevCarts => ({
      ...prevCarts,
      [branch.id]: [], // Set the cart for the current branch to an empty array
    }));
  };
  

  const getItem = (itemId) => {
    if (!branch) return {}; // Do nothing if no branch is set

    const currentCart = carts[branch.id] || [];
    const itemIndex = currentCart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      return currentCart[itemIndex]; 
    }
    return {}; 
  };

  return (
    <CartContext.Provider value={{ 
      cart: carts[branch?.id] || [], // Get the current branch's cart
      total_cost, 
      addToCart, 
      removeFromCart, 
      getItem, 
      deleteFromCart, 
      isCartScreen, 
      setIsCartScreen, 
      branch, 
      setBranch,
      branches,
      setBranches,
      authToken,
      setAuthToken,
      emptyCart,
      defaultUserData,
      setDefaltUserData
    }}>
      {children}
    </CartContext.Provider>
  );
};
