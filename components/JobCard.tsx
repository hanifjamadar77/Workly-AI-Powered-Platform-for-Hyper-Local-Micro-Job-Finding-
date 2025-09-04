import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

type JobCardProps = {
  title: string;
  description: string;
  price: number | string;
  duration: string;
  icon: string | { uri: string } | number;
  backgroundColor?: string;
  onPress?: () => void;
};

export default function JobCard({
  title,
  description,
  price,
  duration,
  icon,
  backgroundColor = 'bg-green-100',
  onPress
}: JobCardProps) {
  const renderIcon = () => {
    if (typeof icon === 'string') {
      // If icon is an emoji string
      return <Text className="text-2xl">{icon}</Text>;
    } else if (typeof icon === 'object' && icon !== null) {
      // If icon is an image object (require() or {uri: ''})
      return (
        <Image 
          source={icon} 
          className="w-8 h-8 rounded-full" 
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
      className={`${backgroundColor} rounded-2xl p-4 m-2 w-48 shadow-sm items-center`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Duration Badge */}
      <View className="absolute top-3 right-3">
        <Text className="text-xs text-gray-600 font-medium">{duration}</Text>
      </View>

      {/* Icon/Avatar */}
      <View className="w-14 h-14 bg-white rounded-full justify-center items-center mb-3 shadow-sm">
        {renderIcon()}
      </View>

      {/* Job Title */}
      <Text className="text-xl font-bold text-gray-800 mb-2 leading-tight text-center">
        {title}
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-600 mb-3 leading-relaxed">
        {description}
      </Text>

      {/* Price */}
      <Text className="text-lg font-bold text-gray-900">
        ${price}
      </Text>
    </TouchableOpacity>
  );
}