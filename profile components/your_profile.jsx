import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function your_profile() {
  const navigation = useNavigation();
  
  const [profileData, setProfileData] = useState({
    name: 'Laal Singh Chaddha',
    email: 'laal.singh@example.com',
    phone: '+91 9876543210',
    location: 'Mumbai, Maharashtra',
    bio: 'Looking for part-time work opportunities. Available for flexible hours.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  });

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Your Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-blue-500 font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View className="items-center py-6">
          <TouchableOpacity className="relative">
            <View className="w-24 h-24 bg-red-500 rounded-full justify-center items-center">
              <Image
                source={{ uri: profileData.avatar }}
                className="w-20 h-20 rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full justify-center items-center">
              <Text className="text-white text-sm">✏️</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 mt-2">Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View className="px-4">
          {/* Full Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl text-base"
              value={profileData.name}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl text-base"
              value={profileData.email}
              onChangeText={(text) => setProfileData({...profileData, email: text})}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl text-base"
              value={profileData.phone}
              onChangeText={(text) => setProfileData({...profileData, phone: text})}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Location */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl text-base"
              value={profileData.location}
              onChangeText={(text) => setProfileData({...profileData, location: text})}
              placeholder="Enter your location"
            />
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Bio</Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl text-base"
              value={profileData.bio}
              onChangeText={(text) => setProfileData({...profileData, bio: text})}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Skills Section */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">Skills</Text>
            <View className="flex-row flex-wrap">
              {['Painting', 'Cleaning', 'Gardening', 'Cooking', 'Tutoring'].map((skill, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-700 text-sm">{skill}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="bg-gray-200 px-3 py-2 rounded-full">
                <Text className="text-gray-600 text-sm">+ Add Skill</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Experience */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-700 mb-3">Experience Level</Text>
            <View className="flex-row">
              {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                <TouchableOpacity
                  key={level}
                  className={`flex-1 py-3 mx-1 rounded-xl ${
                    level === 'Intermediate' ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-center text-sm font-medium ${
                    level === 'Intermediate' ? 'text-white' : 'text-gray-700'
                  }`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}