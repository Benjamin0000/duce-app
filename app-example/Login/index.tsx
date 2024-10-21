import React, { useState } from 'react';
import { Link } from 'expo-router';
import {View, Image ,TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {LoginButton} from '@/components/custom/Buttons'; 
import { PasswordPrevInput } from '@/components/custom/Input';
const Login = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState(''); 
  const theme = useColorScheme(); // this will return 'light' or 'dark'


  const inputStyles = [
    styles.input,
    theme === 'dark' ? styles.inputDark : styles.inputLight,
  ];

  const handleContinue = () => {
    // Validate if it's an email or phone number (this is a simple validation)
    const isEmail = input.includes('@');
    const isPhoneNumber = /^\d+$/.test(input);

    if (isEmail || isPhoneNumber) {
      Alert.alert('Success', 'Proceeding with: ' + input);
      // Navigate or process input
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid email or phone number');
    }
  };

  return (
    <View style={styles.container}>

      <View style={{marginBottom:20, alignItems:'center', justifyContent: 'center'}}>
        <Image
          source={require('../../assets/images/triab_logo.png')}
          style={{ width: 200, height: 130 }}
        />
      </View>

      <TextInput
        style={inputStyles}
        placeholder="Email or Username"
        value={input}
        onChangeText={setInput}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor='#999'
      />

      <PasswordPrevInput inputStyle={inputStyles} /> 

      {/* <TextInput
        style={inputStyles}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        keyboardType="numeric"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={theme === 'dark' ? '#ddd' : 'gray'}
      /> */}
      <LoginButton  title="Login" onPress={handleContinue} />

      <View style={styles.other_links}>
        <Link href={{
          pathname: '/details/[id]',
          params: { id: '1' },
        }}>Forgot Password</Link>

        <Link href={{
          pathname: '/details/[id]',
          params: { id: '1' },
        }}>Sign up</Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize:17
  },
  inputLight: {
    backgroundColor: '#fff',
    color: '#000', // Black text for light mode
    borderColor: '#ccc',
  },
  inputDark: {
    backgroundColor: '#333',
    color: '#fff', // White text for dark mode
    borderColor: '#555',
  },
  other_links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20, // Optional padding
  }
});

export default Login;
