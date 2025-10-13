import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Header({
  welcomeText = "Welcome Back",
  name = "User",
  profileImage, // can be require(...) or { uri: "https://..." }
}) {
  const router = useRouter();
  const { t } = useTranslation();
  // Convert name to sentence case
  const sentenceCaseName = name
    .toLowerCase()
    .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase());

  const handleProfilePress = () => {
    router.push("supportPages/profile"); // Navigate to profile page
  };

  return (
    <View className="flex-row justify-between items-center bg-white p-5">
      <View>
        <Text className="text-black text-2xl">{welcomeText}</Text>
        <Text className="text-black text-2xl font-bold">{sentenceCaseName}</Text>
      </View>

      {profileImage ? (
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={profileImage}
            className="w-[4rem] h-[4rem] rounded-full border-2 border-white"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
