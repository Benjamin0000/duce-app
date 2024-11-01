import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
const ErrorComponent = ({ title, message, onRetry }) => {
  const { colors } = useTheme(); 
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color:colors.text}]}>{title}</Text>
      <Text style={[styles.message, {color:colors.text}]}>{message}</Text>
      <Button 
        title="Reload"
        onPress={onRetry}
        color='#ff6347'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24', // Dark red for title text
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#721c24',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorComponent;
