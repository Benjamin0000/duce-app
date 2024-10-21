import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export function LoginButton(props:any) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={[styles.button, styles.loginButton]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function RegisterButton(props:any) {
    const { onPress, title = 'Save' } = props;
    return (
      <Pressable style={[styles.button, styles.registerButton]} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#FF9A30',
    borderRadius:50,
    height:55
  }, 
  registerButton: {
    backgroundColor: '#FF8430',
  }, 
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,

  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 0.25,
    color: 'white',
  },
});
