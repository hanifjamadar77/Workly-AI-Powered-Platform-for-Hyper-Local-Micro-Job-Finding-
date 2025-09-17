import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onSubmit = () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      Alert.alert("Success", "Logged in successfully");
      router.replace("/(intro)/IntroPage1"); // ✅ navigate to seeker dashboard
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-2">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text : string) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text : string) => setForm((prev) => ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry
      />

      <CustomButton
        title="Login"
        onPress={onSubmit}
        isLoading={isSubmitting} style={undefined} textStyle={undefined} leftIcon={undefined}      />

      <View className="flex-row justify-center mt-5">
        <Text>Don't have an account? </Text>
        <Link href="/(auth)/signup">
          <Text className="text-blue-500 font-semibold">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}
