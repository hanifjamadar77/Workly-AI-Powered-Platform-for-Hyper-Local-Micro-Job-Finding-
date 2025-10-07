import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MapPin } from "lucide-react-native";

type JobCardProps = {
  title: string;
  peopleNeeded: string | number;
  price: number | string;
  duration: string;
  location?: string;
  icon?: string | { uri: string } | number; // user avatar or emoji
  backgroundColor?: string;
  onPress?: () => void;
};

export default function JobCard({
  title,
  peopleNeeded,
  price,
  duration,
  location,
  icon,
  backgroundColor = "bg-green-100",
  onPress,
}: JobCardProps) {
  const renderIcon = () => {
    if (typeof icon === "string" && icon.startsWith("http")) {
      // If icon is an Appwrite image URL (or external URL)
      return (
        <Image
          source={{ uri: icon }}
          className="w-14 h-14 rounded-full"
          resizeMode="cover"
        />
      );
    } else if (typeof icon === "object" && icon !== null) {
      // If icon is a local image or {uri: ""}
      return (
        <Image
          source={icon}
          className="w-14 h-14 rounded-full"
          resizeMode="cover"
        />
      );
    } else if (typeof icon === "string") {
      // If icon is an emoji
      return <Text className="text-3xl">{icon}</Text>;
    } else {
      // Default fallback
      return <Text className="text-3xl">👤</Text>;
    }
  };

  return (
    <TouchableOpacity
      className={`${backgroundColor} flex-1 rounded-2xl p-4 m-2 shadow-md justify-evenly`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Duration Badge */}
      <View className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow-sm">
        <Text className="text-xs text-gray-600 font-medium">{duration}</Text>
      </View>

      {/* Icon / Avatar */}
      <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-3 mt-8 shadow-sm self-center overflow-hidden">
        {renderIcon()}
      </View>

      {/* Job Title */}
      <Text className="text-base font-semibold text-gray-800 text-center mb-1">
        {title}
      </Text>

      {/* Location */}
      <View className="flex-row items-center justify-center mb-1">
        <MapPin size={14} color="gray" />
        <Text className="text-xs text-gray-600 ml-1 text-center">{location}</Text>
      </View>

      {/* People Needed */}
      <Text className="text-xs text-gray-700 text-center mb-1">
        👥 Need: {peopleNeeded}
      </Text>

      {/* Price */}
      <Text className="text-sm font-bold text-blue-600 text-center">
        ₹{price}
      </Text>
    </TouchableOpacity>
  );
}
