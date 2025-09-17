import React from "react";
import { Image, Text, View } from "react-native";

export default function Header({
  welcomeText = "Welcome Back",
  name = "User",
  profileImage, // can be require(...) or { uri: "https://..." }
}) {
  return (
    <View className="flex-row justify-between items-center bg-white p-5 ">
      <View>
        <Text className="text-black text-2xl ">{welcomeText}</Text>
        <Text className="text-black text-2xl font-bold">{name}</Text>
      </View>

      {profileImage ? (
        <Image
          source={profileImage}
          className="w-[4rem] h-[4rem] rounded-full border-2 border-white"
          resizeMode="cover"
          
        />
      ) : null}
    </View>
  );
}
