import { Stack } from "expo-router";

export default function CartRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Category Details', headerShown: false, }} />
    </Stack>
  );
}
  