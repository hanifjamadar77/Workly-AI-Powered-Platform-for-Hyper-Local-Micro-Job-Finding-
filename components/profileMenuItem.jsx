import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function ProfileMenuItem({ 
  icon, 
  title, 
  screenName, 
  iconColor = 'text-gray-800',
  textColor = 'text-indigo-600'
}) {
  const router = useRouter();

  const handlePress = () => {
    if (screenName) {
      router.replace(screenName);
    }
  };

  return (
    <TouchableOpacity
      className="bg-gray-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 justify-center items-center mr-4">
          <Text className={`text-2xl ${iconColor}`}>{icon}</Text>
        </View>
        <Text className={`text-lg font-medium ${textColor}`}>{title}</Text>
      </View>
      <Text className="text-gray-400 text-xl">›</Text>
    </TouchableOpacity>
  );
}