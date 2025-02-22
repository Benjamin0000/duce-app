import { Stack } from "expo-router";

export default function HistoryRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Order History', headerShown: true, }} />
      <Stack.Screen name="[...rest]" options={{ title: 'Carts Order', headerShown: true, }} />
    </Stack>
  );
}
  