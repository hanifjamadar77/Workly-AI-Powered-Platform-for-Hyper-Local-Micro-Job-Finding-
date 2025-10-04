import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MapPin } from "lucide-react-native";

type JobCardProps = {
  title: string;
  date: string;
  price: number | string;
  duration: string;
  location?: string;
  icon: string | { uri: string } | number;
  backgroundColor?: string;
  onPress?: () => void;
};

export default function JobCard({
  title,
  date,
  price,
  duration,
  location,
  icon,
  backgroundColor = "bg-green-100",
  onPress,
}: JobCardProps) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      // If icon is an emoji string
      return <Text className="text-2xl">{icon}</Text>;
    } else if (typeof icon === "object" && icon !== null) {
      // If icon is an image object (require() or {uri: ''})
      return (
        <Image
          source={icon}
          className="w-12 h-12 rounded-full"
          resizeMode="cover"
        />
      );
    } else {
      // Default fallback icon
      return <Text className="text-2xl">👤</Text>;
    }
  };

  return (
   <TouchableOpacity
      className={`${backgroundColor} flex-1 rounded-2xl p-4 m-2 shadow-md justify-evenly`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Duration Badge */}
      <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-sm">
        <Text className="text-xs text-gray-600 font-medium">{duration}</Text>
      </View>

      {/* Icon/Avatar */}
      <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-3 shadow-sm self-center">
        {renderIcon()}
      </View>

      {/* Job Title */}
      <Text className="text-base font-semibold text-gray-800 text-center mb-1">
        {title}
      </Text>

      {/* Description */}
      <Text className="text-xs text-gray-600 text-center mb-2 px-1">
        {location}
      </Text>

      {/* Location */}
      <View className="flex-row items-center justify-center mb-2">
        <Text className="text-xs text-gray-600">{date}</Text>
      </View>

      {/* Price */}
      <Text className="text-sm font-bold text-blue-600 text-center">
        ${price}
      </Text>
    </TouchableOpacity>


  );
}
