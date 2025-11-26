import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getCurrentUser } from './appwrite';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  SignIn: (userData: any) => void;
  SignOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  SignIn: () => {},
  SignOut: () => {},
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
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if already authenticated
      router.replace('/(intro)/IntroPage1');
    }
  }, [user, segments, isLoading]);

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

  const SignIn = async (userData: any) => {
    setUser(userData);
    console.log('✅ User signed in:', userData.email);
  };

  const SignOut = () => {
    setUser(null);
    console.log('✅ User signed out');
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
        SignIn,
        SignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}