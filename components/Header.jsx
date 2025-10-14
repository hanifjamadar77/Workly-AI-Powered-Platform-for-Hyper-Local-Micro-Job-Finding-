import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/ThemeContext";
import clsx from "clsx";

export default function Header({
  welcomeText = "Welcome Back",
  name = "User",
  profileImage, // can be require(...) or { uri: "https://..." }
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const sentenceCaseName = name
    .toLowerCase()
    .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase());

  const handleProfilePress = () => {
    router.push("supportPages/profile"); // Navigate to profile page
  };

  return (
  <View className={clsx("flex-row justify-between items-center p-5" , isDarkMode ? "bg-gray-900" : "bg-white")}>
      <View>
        <Text className={clsx("text-2xl", isDarkMode ? "text-white" : "text-gray-800")}>{welcomeText}</Text>
        <Text className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{sentenceCaseName}</Text>
      </View>

      {profileImage ? (
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={profileImage}
            className={clsx(
              "w-16 h-16 rounded-full border-2",
              isDarkMode ? "border-white" : "border-gray-700"
            )}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
