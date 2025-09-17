import { Slot, Redirect, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { useEffect, useState } from "react";

export default function Layout() {
 const router = useRouter();
  const segments = useSegments();

  // Simulate auth state (later replace with real Appwrite check)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Fake loading auth state
    setTimeout(() => {
      setIsAuthenticated(false); // change to true to test
    }, 1000);
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return; // wait until auth resolved

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // redirect guest to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // redirect logged in user away from auth
      router.replace("/(seeker)");
    }
  }, [isAuthenticated, segments]);

  if (isAuthenticated === null) {
    // temporary splash while checking auth
    return null;
  }

  return <Slot />;
  }
