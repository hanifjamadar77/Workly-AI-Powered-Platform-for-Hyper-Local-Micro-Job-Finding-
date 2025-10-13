import { account } from "@/lib/appwrite"; // ✅ import your appwrite.tsx config
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {ThemeProvider} from "@/lib/ThemeContext";
import "./globals.css";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // ✅ Check Appwrite session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get(); // fetch current user
        // console.log("Logged in user:", user);
        setIsAuthenticated(true);
      } catch (err) {
        // console.log("No active session:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Handle redirects based on auth state
  useEffect(() => {
    if (isAuthenticated === null) return; // wait until auth check completes

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login"); // guest → login
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(intro)/IntroPage1"); // logged-in → seeker dashboard
    }
  }, [isAuthenticated, segments]);

  if (isAuthenticated === null) {
    // ✅ simple splash/loading screen
    return null;
  }
 return (
<ThemeProvider>
  <Slot />;
</ThemeProvider>
 );
}
