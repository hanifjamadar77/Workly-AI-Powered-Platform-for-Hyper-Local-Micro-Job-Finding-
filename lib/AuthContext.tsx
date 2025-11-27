// lib/AuthContext.tsx

import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from './appwrite';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (userData: any) => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkUser();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return; // ✅ Don't navigate while loading

    const inAuthGroup = segments[0] === '(auth)';
    const inIntroGroup = segments[0] === '(intro)';

    console.log('🔍 Navigation check:', {
      user: user?.email,
      inAuthGroup,
      segments: segments.join('/'),
    });

    if (!user && !inAuthGroup) {
      // ✅ User is not logged in and not in auth screens -> go to login
      console.log('➡️ Redirecting to login');
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // ✅ User is logged in but still in auth screens -> go to home
      console.log('➡️ Redirecting to home');
      router.replace('/(intro)/IntroPage1');
    }
    // If user is logged in and in app, or logged out and in auth, do nothing
  }, [user, isLoading]); // ✅ Only depend on user and isLoading, NOT segments

  const checkUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('✅ User authenticated:', currentUser.email);
      } else {
        setUser(null);
        console.log('ℹ️ No user session found');
      }
    } catch (error) {
      console.log('ℹ️ No active session');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = (userData: any) => {
    console.log('✅ SignIn called with:', userData?.email);
    setUser(userData);
  };

  const signOut = () => {
    console.log('✅ SignOut called');
    setUser(null);
  };

  const refreshUser = async () => {
    await checkUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}