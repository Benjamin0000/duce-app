import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ErrorComponent = ({ title, message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button 
        title="Reload"
        onPress={onRetry}
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
    backgroundColor: '#ff6347', // Light red for error background
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
