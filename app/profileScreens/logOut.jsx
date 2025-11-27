import { signOut as appwriteSignOut } from "@/lib/appwrite"; // ✅ Rename to avoid confusion
import { useTheme } from "@/lib/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from '@/lib/AuthContext';
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogoutScreen() {
  const { signOut } = useAuth(); // ✅ Fixed: lowercase signOut
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout from your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);

              // 1️⃣ Sign out from Appwrite (clears server session)
              await appwriteSignOut();

              // 2️⃣ Update Auth Context (clears local state & triggers navigation)
              await signOut();

              // 3️⃣ Show success message
              Alert.alert("Logged Out", "You have been successfully logged out.");

              // Navigation happens automatically via AuthContext

            } catch (error) {
              console.error("❌ Logout error:", error);
              Alert.alert("Error", error.message || "Failed to logout");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCancel = () => {
    router.replace('/supportPages/profile');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      className="px-6"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 mb-8">
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-xl font-bold">
          Logout
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center">
        {/* Logout Icon */}
        <View
          style={{ backgroundColor: isDarkMode ? "#991b1b" : "#fee2e2" }}
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
        >
          <Ionicons
            name="log-out-outline"
            size={64}
            color={isDarkMode ? "#fca5a5" : "#dc2626"}
          />
        </View>

        {/* Title */}
        <Text
          style={{ color: colors.text }}
          className="text-2xl font-bold mb-4 text-center"
        >
          Ready to Logout?
        </Text>

        {/* Description */}
        <Text
          style={{ color: colors.textSecondary }}
          className="text-base text-center mb-12 px-8"
        >
          You will be signed out of your account and redirected to the login
          screen.
        </Text>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#dc2626" : "#ef4444",
          }}
          className="w-full py-4 rounded-xl items-center justify-center mb-4"
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text className="text-white text-lg font-bold ml-2">
                Logout
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
            borderWidth: 1,
            borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
          }}
          className="w-full py-4 rounded-xl items-center justify-center"
          onPress={handleCancel}
          disabled={loggingOut}
        >
          <Text
            style={{ color: colors.text }}
            className="text-lg font-semibold"
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View className="pb-8">
        <Text
          style={{ color: colors.textSecondary }}
          className="text-xs text-center"
        >
          You can always sign back in anytime
        </Text>
      </View>
    </SafeAreaView>
  );
}