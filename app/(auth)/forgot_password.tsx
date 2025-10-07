import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { account } from "@/lib/appwrite";
import { sendOtpToUser, verifyOtp } from "@/lib/otpService";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  const handleSendOTP = async () => {
    if (!email.trim()) return Alert.alert("Error", "Enter your registered email");
    try {
      setLoading(true);
      const result = await sendOtpToUser(email);
      if (result.success) {
        Alert.alert("OTP Sent", "Please check your email for OTP");
        setStep(2);
      } else {
        Alert.alert("Error", result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) return;
    const updated = [...otp];
    updated[index] = text;
    setOtp(updated);
    if (text && index < 5) inputs.current[index + 1].focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return Alert.alert("Error", "Enter 6-digit OTP");
    try {
      setLoading(true);
      const result = await verifyOtp(email, code);
      if (result.success) {
        Alert.alert("Verified", "OTP verified successfully!");
        setStep(3);
      } else {
        Alert.alert("Error", "Invalid OTP or expired");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return Alert.alert("Error", "Enter a new password");
    try {
      setLoading(true);
      await account.updatePassword(newPassword);
      Alert.alert("Success", "Password updated successfully");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LinearGradient colors={["#6366f1", "#818cf8", "#a5b4fc"]} className="absolute top-0 left-0 right-0 h-1/3 rounded-b-3xl" />
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-6 mt-12">
            <Text className="text-white text-3xl font-bold mb-6">Reset Password</Text>

            {step === 1 && (
              <View className="bg-white w-full p-6 rounded-2xl shadow-lg mt-6">
                <Text className="text-gray-800 text-base font-semibold mb-2">Enter your registered email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-700"
                />
                <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl" onPress={handleSendOTP} disabled={loading}>
                  {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">Send OTP</Text>}
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View className="bg-white w-full p-6 rounded-2xl shadow-lg mt-6 items-center">
                <Text className="text-gray-800 text-base font-semibold mb-3">Enter OTP sent to your email</Text>
                <View className="flex-row justify-center mb-6">
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => (inputs.current[i] = ref)}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      className="border border-gray-400 text-center text-lg rounded-xl w-10 h-12 mx-1"
                    />
                  ))}
                </View>
                <TouchableOpacity className="bg-indigo-600 py-3 px-8 rounded-xl" onPress={handleVerifyOtp}>
                  {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">Verify OTP</Text>}
                </TouchableOpacity>
              </View>
            )}

            {step === 3 && (
              <View className="bg-white w-full p-6 rounded-2xl shadow-lg mt-6">
                <Text className="text-gray-800 text-base font-semibold mb-2">Enter your new password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2 mb-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#6366f1" />
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="New Password"
                    className="flex-1 ml-2 text-gray-700"
                  />
                </View>
                <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl" onPress={handleResetPassword}>
                  {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">Update Password</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
