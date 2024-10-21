import { Stack } from "expo-router";

export default function HomeRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="item" />
      <Stack.Screen name="category" options={{headerShown: false}}/>
    </Stack>
  );
}
  