import { Stack } from "expo-router";

export default function PaymentRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Order Details', headerShown: true }} />
    </Stack>
  );
}
  