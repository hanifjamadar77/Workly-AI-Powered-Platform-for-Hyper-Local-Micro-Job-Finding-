import { Stack } from "expo-router";
import "./globals.css";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(seeker)" options={{ headerShown: false }} />
    </Stack>
  );
}