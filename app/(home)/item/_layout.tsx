import { Stack } from "expo-router";

export default function ItemRoot() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{headerShown: false, }} />
    </Stack>
  );
}
  