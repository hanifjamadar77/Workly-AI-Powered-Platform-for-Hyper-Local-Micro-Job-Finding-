import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

export default function signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({name, email, password});
      Alert.prompt("Success", "Account created successfully");
      router.push("/(intro)/IntroPage1"); // ✅ navigate to seeker dashboard
    } catch (err: any) {
      console.error("Signup error:", err); // logs to Metro console
  Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-2">
      <CustomInput
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, name: text }))
        }
        label="Username"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, email: text }))
        }
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry
      />

      <CustomButton
        title="Sign Up"
        onPress={onSubmit}
        isLoading={isSubmitting}
        style={undefined}
        textStyle={undefined}
        leftIcon={undefined}
      />

      <View className="flex-row justify-center">
        <Text>Allready have account ? </Text>
        <Link href="/(auth)/login">
          <Text className="text-blue-500 font-semibold">Log In</Text>
        </Link>
      </View>
    </View>
  );
}
