import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CartContext } from '../context/CartContext';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import the icon library

export default function CartIcon() {
  const router = useRouter();
  const { cart, total_cost, isCartScreen } = useContext(CartContext);

  return (
    <>
    { cart.length > 0 && !isCartScreen?
        <TouchableOpacity style={styles.cartIcon} onPress={() => router.push('/cart')}>
            <Text style={styles.cartCount}>₦{Number(total_cost).toLocaleString()}</Text> 
            <Ionicons name='cart-outline' size={25} color={'white'} />
        </TouchableOpacity>
        : ''
    }
    </>
  );
}

const styles = StyleSheet.create({
    cartIcon: {
      position: 'absolute',
      bottom: 52,         // Adjust this to see the CartIcon more clearly
      right: 10,          // Adjust this if it's too close to the edge
      backgroundColor: '#ff6347', // Visible background color
      borderRadius: 25,
      padding: 10,
      zIndex: 100,        // Ensures it stays above other elements
      elevation: 5,       // Adds shadow for Android
      shadowColor: '#000', // Adds shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      justifyContent:'center',
      flexDirection: 'row',
    },
    cartCount: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,       // Increase font size for visibility
      marginTop:2
    },
  });
  
