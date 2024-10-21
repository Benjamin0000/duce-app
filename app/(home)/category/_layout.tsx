import { Stack } from "expo-router";

export default function ItemRoot() {
  return (
    <Stack>
      <Stack.Screen name="[...rest]"/>
    </Stack>
  );
}
  