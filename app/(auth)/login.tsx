import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { getCurrentUser, signIn as appwriteSignIn } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useAuth } from '@/lib/AuthContext';
import {
  ActivityIndicator,
  Alert,
  DevSettings,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { signIn, refreshUser} = useAuth(); // Use auth context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 const onRefresh = async () => {
    setRefreshing(true);
    setForm({ email: '', password: '' });
    router.replace('/(intro)/IntroPage1');
    setRefreshing(false);
  };

  const onSubmit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sign in to Appwrite
      await appwriteSignIn({ email, password });

      // 2. Get current user data
      const userData = await getCurrentUser();

      // 3. Update Auth Context (this will trigger automatic navigation)
      signIn(userData);

      // 4. Show success message (navigation happens automatically)
      Alert.alert("Success", "Logged in successfully");

    } catch (err: any) {
      console.error("❌ Login error:", err);
      Alert.alert("Error", err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gradient-to-b from-blue-50 to-white"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3B82F6"]} // Android
          tintColor="#3B82F6" // iOS
          title="Pull to refresh"
          titleColor="#6B7280"
        />
      }
    >
      <View className="px-6">
        {/* Header */}
        <View className="items-center pt-10 pb-8">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4 shadow-xl">
            {/* <Ionicons name="briefcase-outline" size={48} color="white" /> */}
            <Image source={images.logo} className="size-48 color-white"></Image>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </Text>
          <Text className="text-base text-gray-500">
            Sign in to continue to Workly
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-3xl shadow-2xl p-6 gap-6">
          {/* Email Input */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Email Address
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <CustomInput
                placeholder="your.email@example.com"
                value={form.email}
                onChangeText={(text: string) =>
                  setForm((prev) => ({
                    ...prev,
                    email: text.trim().toLowerCase(),
                  }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                label=""
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Password Input with Toggle */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Password
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <View className="flex-1">
                <CustomInput
                  placeholder="Enter your password"
                  value={form.password}
                  onChangeText={(text: string) =>
                    setForm((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry={!showPassword}
                  label=""
                  editable={!isSubmitting}
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2 p-2"
                disabled={isSubmitting}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View className="items-end -mt-2">
            <Link href="/(auth)/forgot_password" asChild>
              <TouchableOpacity disabled={isSubmitting}>
                <Text className="text-blue-600 text-sm font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={isSubmitting || refreshing}
            activeOpacity={0.8}
            className="bg-blue-600 rounded-xl py-4 shadow-lg"
            style={{
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              opacity: isSubmitting || refreshing ? 0.6 : 1,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-center text-lg font-bold mr-2">
                  Login
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm font-medium">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-xl py-3.5"
              disabled={isSubmitting || refreshing}
            >
              <Ionicons name="logo-google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-xl py-3.5"
              disabled={isSubmitting || refreshing}
            >
              <Ionicons name="logo-facebook" size={22} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-xl py-3.5"
              disabled={isSubmitting || refreshing}
            >
              <Ionicons name="logo-apple" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-600 text-base">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity disabled={isSubmitting || refreshing}>
                <Text className="text-blue-600 font-bold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-8 mb-8">
          <Text className="text-gray-400 text-xs text-center">
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
          {refreshing && (
            <Text className="text-blue-500 text-xs mt-2 font-semibold">
              Refreshing...
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
