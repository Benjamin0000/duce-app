import { Stack } from "expo-router";

export default function CartRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Cart', headerShown: true }} />
      <Stack.Screen name="payment" options={{ title: 'Make payment', headerShown: false }} />
    </Stack>
  );
}
  