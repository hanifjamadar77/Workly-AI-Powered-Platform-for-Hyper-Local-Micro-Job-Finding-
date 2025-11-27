import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/lib/ThemeContext';

type JobCardProps = {
  title: string;
  userName?: string;
  peopleNeeded: string | number;
  price: number | string;
  duration: string;
  location?: string;
  icon?: string | { uri: string } | number;
  backgroundColor?: string; // fallback for light/dark mode
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
  backgroundColor,
  onPress
}: JobCardProps) {
  const { isDarkMode } = useTheme();

  // Helper function to get proper image source
  const getImageSource = () => {
    if (!icon) return null;
    if (typeof icon === 'object' && 'uri' in icon) return icon;
    if (typeof icon === 'string') return { uri: icon };
    if (typeof icon === 'number') return icon;
    return null;
  };

  const imageSource = getImageSource();

  // Tailwind classes based on dark/light mode
  const cardBg = backgroundColor ? backgroundColor : isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const textAccent = isDarkMode ? 'text-green-400' : 'text-green-700';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <TouchableOpacity
      className={`${cardBg} rounded-2xl p-4 shadow-sm`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Job Title */}
      <Text className={`text-base font-bold mb-2 ${textPrimary}`} numberOfLines={2}>
        {title}
      </Text>

      {/* Posted By User Avatar & Name */}
      {(icon || userName) && (
        <View className="flex-row items-center mb-3">
          <View className={`w-8 h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-full justify-center items-center shadow-sm mr-2`}>
            {imageSource ? (
              <Image
                source={imageSource}
                className="w-7 h-7 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className={`text-sm ${textSecondary}`}>👤</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className={`text-xs ${textSecondary}`}>Posted by</Text>
            <Text className={`text-xs font-semibold ${textPrimary}`} numberOfLines={1}>
              {userName || 'Unknown User'}
            </Text>
          </View>
        </View>
      )}

      {/* Location */}
      {location && (
        <View className="flex-row items-center mb-2">
          <Text className={`text-xs ${textSecondary}`}>📍</Text>
          <Text className={`text-xs ml-1 ${textSecondary}`} numberOfLines={1}>
            {location}
          </Text>
        </View>
      )}

      {/* Pay */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`text-sm ${textSecondary}`}>Pay:</Text>
        <Text className={`text-base font-bold ${textAccent}`}>₹{price}</Text>
      </View>

      {/* People Needed */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`text-sm ${textSecondary}`}>People:</Text>
        <Text className={`text-sm font-semibold ${textPrimary}`}>{peopleNeeded}</Text>
      </View>

      {/* Duration/Date */}
      {duration && (
        <View className={`mt-2 pt-2 border-t ${borderColor}`}>
          <Text className={`text-xs ${textSecondary}`}>📅 {duration}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
