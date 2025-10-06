import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function JobProfileCard({
  profile,
  onPress,
}) {
  // Extract data with fallbacks
  const {
    fullName = 'Unknown',
    experience = 'N/A',
    rating = 0,
    availability = 'Available',
    profilePhoto,
    address,
    // city = '',
    // state = '',
    skills = []
  } = profile;

  // Determine card color based on availability
  const getBackgroundColor = () => {
    if (availability === 'Available') return 'bg-green-100';
    if (availability === 'Busy') return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  return (
    <TouchableOpacity
      className={`${getBackgroundColor()} rounded-2xl p-4 m-2 w-44 shadow-sm`}
      onPress={() => onPress(profile)}
      activeOpacity={0.7}
    >
      {/* Top Rated Badge */}
      {rating >= 4.5 && (
        <View className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">Top Rated</Text>
        </View>
      )}

      {/* Profile Avatar */}
      <View className="items-center mb-3">
        <View className="w-16 h-16 bg-white rounded-full justify-center items-center shadow-sm mb-2">
          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              className="w-14 h-14 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-2xl">👤</Text>
          )}
        </View>
        
        {/* Name */}
        <Text className="text-base font-bold text-gray-800 text-center leading-tight" numberOfLines={2}>
          {fullName}
        </Text>
      </View>

      {/* Top Skill */}
      {skills.length > 0 && (
        <Text className="text-sm font-medium text-gray-700 text-center mb-2">
          {skills[0]}
        </Text>
      )}

      {/* Experience */}
      <Text className="text-xs text-gray-600 text-center mb-3">
        {experience}
      </Text>

      {/* Rating */}
      <View className="flex-row items-center justify-center mb-3">
        <Text className="text-yellow-500 mr-1">⭐</Text>
        <Text className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</Text>
      </View>

      {/* Location */}
      {address && (
        <Text className="text-xs text-gray-500 text-center mb-2">
          📍 {address}
        </Text>
      )}

      {/* Availability */}
      <View className={`px-3 py-1 rounded-full self-center ${
        availability === 'Available' ? 'bg-green-200' : 
        availability === 'Busy' ? 'bg-yellow-200' : 'bg-gray-200'
      }`}>
        <Text className={`text-xs font-medium ${
          availability === 'Available' ? 'text-green-700' : 
          availability === 'Busy' ? 'text-yellow-700' : 'text-gray-600'
        }`}>
          {availability}
        </Text>
      </View>
    </TouchableOpacity>
  );
}