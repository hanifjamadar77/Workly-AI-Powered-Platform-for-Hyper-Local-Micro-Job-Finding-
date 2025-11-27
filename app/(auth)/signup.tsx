import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { createUser,getCurrentUser } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useAuth } from '@/lib/AuthContext';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onRefresh = async () => {
  setRefreshing(true);

  try {
    // Clear signup form
    setForm({ name: "", email: "", password: "" });
    console.log("🔄 Signup screen refreshed & user state updated");
  } catch (error) {
    console.log("⚠️ Refresh error:", error);
  } finally {
    setRefreshing(false);
  }
};

  const onSubmit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({ name, email, password });

      const userData = await getCurrentUser();

      signIn(userData);

      Alert.alert("Success", "Account created successfully");
    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
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
          colors={["#3B82F6"]}
          tintColor="#3B82F6"
          title="Pull to refresh"
          titleColor="#6B7280"
        />
      }
    >
      <View className="px-6">
        {/* Header */}
        <View className="items-center pt-10 pb-8">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4 shadow-xl">
            {/* <Ionicons name="person-add-outline" size={48} color="white" /> */}
            <Image source ={images.logo} className='size-48 color-white' ></Image>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </Text>
          <Text className="text-base text-gray-500">
            Sign up to get started with Workly
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-3xl shadow-2xl p-6 gap-6">
          {/* Name Input */}
          <View>
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Full Name
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text: string) =>
                  setForm((prev) => ({ ...prev, name: text }))
                }
                label=""
                editable={!isSubmitting}
              />
            </View>
          </View>

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
                  setForm((prev) => ({ ...prev, email: text.trim().toLowerCase() }))
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
                  placeholder="Create a strong password"
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
            <Text className="text-gray-400 text-xs mt-1 ml-1">
              Must be at least 8 characters
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={isSubmitting || refreshing}
            activeOpacity={0.8}
            className="bg-blue-600 rounded-xl py-4 shadow-lg mt-2"
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
                  Sign Up
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

          {/* Login Link */}
          <View className="flex-row justify-center mt-2">
            <Text className="text-gray-600 text-base">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={isSubmitting || refreshing}>
                <Text className="text-blue-600 font-bold text-base">
                  Log In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Terms & Privacy */}
        <View className="items-center mt-8 mb-8 px-8">
          <Text className="text-gray-400 text-xs text-center">
            By signing up, you agree to our{" "}
            <Text className="text-blue-500 font-semibold">Terms of Service</Text>{" "}
            and{" "}
            <Text className="text-blue-500 font-semibold">Privacy Policy</Text>
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