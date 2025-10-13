import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

type JobCardProps = {
  title: string;
  userName?: string;
  peopleNeeded: string | number;
  price: number | string;
  duration: string;
  location?: string;
  icon?: string | { uri: string } | number;
  backgroundColor?: string;
  onPress?: () => void;
};

export default function JobCard({
  title,
  price,
  duration,
  location,
  peopleNeeded,
  icon,
  userName,
  backgroundColor = 'bg-green-100',
  onPress
}: JobCardProps) {
  
  // Helper function to get proper image source
  const getImageSource = () => {
    if (!icon) return null;
    
    // If it's already an object with uri, return it
    if (typeof icon === 'object' && 'uri' in icon) {
      return icon;
    }
    
    // If it's a string URL, wrap it in uri object
    if (typeof icon === 'string') {
      return { uri: icon };
    }
    
    // If it's a number (local image require), return as is
    if (typeof icon === 'number') {
      return icon;
    }
    
    return null;
  };

  const imageSource = getImageSource();

  return (
    <TouchableOpacity
      className={`${backgroundColor} rounded-2xl p-4 shadow-sm`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Job Title */}
      <Text className="text-base font-bold text-gray-800 mb-2" numberOfLines={2}>
        {title}
      </Text>

      {/* Posted By User Avatar & Name */}
      {(icon || userName) && (
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 bg-white rounded-full justify-center items-center shadow-sm mr-2">
            {imageSource ? (
              <Image
                source={imageSource}
                className="w-7 h-7 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-sm">👤</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Posted by</Text>
            <Text className="text-xs font-semibold text-gray-700" numberOfLines={1}>
              {userName || 'Unknown User'}
            </Text>
          </View>
        </View>
      )}

      {/* Location */}
      {location && (
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-500 text-xs">📍</Text>
          <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
            {location}
          </Text>
        </View>
      )}

      {/* Pay */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-gray-600">Pay:</Text>
        <Text className="text-base font-bold text-green-700">₹{price}</Text>
      </View>

      {/* People Needed */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-gray-600">People:</Text>
        <Text className="text-sm font-semibold text-gray-800">{peopleNeeded}</Text>
      </View>

      {/* Duration/Date */}
      {duration && (
        <View className="mt-2 pt-2 border-t border-gray-200">
          <Text className="text-xs text-gray-500">📅 {duration}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}