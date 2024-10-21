import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

export const PasswordPrevInput = ({...props}) => {
    const theme = useColorScheme();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const containerStyles = [
        styles.container,
        theme === 'dark' ? styles.containerDark : styles.containerLight,
      ];

    return (
        <View style={[containerStyles]}>
        <TextInput
            style={[styles.input, {color:theme === 'dark' ? '#fff' : '#000'}]}
            placeholder="Enter your password"
            placeholderTextColor="#999" // Change this to your preferred placeholder color
            secureTextEntry={!passwordVisible} // Toggle the secure text entry based on state
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
            <Ionicons 
            name={passwordVisible ? "eye-off" : "eye"} 
            size={24} 
            color={theme === 'dark' ? '#ddd' : 'gray'}
            />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 17,
  },
  icon: {
    padding: 10,
  },
  containerLight: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  containerDark: {
    backgroundColor: '#333',
    borderColor: '#555',
  }
});

