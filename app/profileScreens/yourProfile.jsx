import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  getCurrentUser, 
  getWorkerProfileByUserId, 
  createWorkerProfile, 
  updateWorkerProfile 
} from '@/lib/appwrite';

export default function WorkerProfileEdit() {
  const navigation = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    about: '',
    experience: 'Beginner',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    availability: 'Available',
    age: '',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please login first');
        return;
      }
      setCurrentUser(user);

      // Try to fetch existing worker profile
      const existingProfile = await getWorkerProfileByUserId(user.accountId);
      
      if (existingProfile) {
        setProfileId(existingProfile.$id);
        setFormData({
          fullName: existingProfile.fullName || user.name,
          email: existingProfile.email || user.email,
          phone: existingProfile.phone || '',
          about: existingProfile.about || '',
          experience: existingProfile.experience || 'Beginner',
          gender: existingProfile.gender || 'Male',
          address: existingProfile.address || '',
          // city: existingProfile.city || '',
          // state: existingProfile.state || '',
          availability: existingProfile.availability || 'Available',
          age: existingProfile.age || '',
          profilePhoto: existingProfile.profilePhoto || user.avatar,
        });
        setSkills(existingProfile.skills || []);
      } else {
        // Pre-fill with user data
        setFormData(prev => ({
          ...prev,
          fullName: user.name,
          email: user.email,
          profilePhoto: user.avatar,
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill required fields (Name, Email, Phone)');
      return;
    }

    try {
      setSaving(true);
      const profileData = {
        ...formData,
        userId: currentUser.accountId,
        skills: skills,
      };

      if (profileId) {
        // Update existing profile
        await updateWorkerProfile(profileId, profileData);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        // Create new profile
        const newProfile = await createWorkerProfile(profileData);
        setProfileId(newProfile.$id);
        Alert.alert('Success', 'Profile created successfully!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text className="text-indigo-600 font-semibold text-base">
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View className="bg-white px-4 py-8 mb-4 items-center">
          <TouchableOpacity className="relative">
            <View className="w-28 h-28 bg-indigo-500 rounded-full justify-center items-center">
              <Image
                source={{ uri: formData.profilePhoto }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full justify-center items-center border-4 border-white">
              <Text className="text-white text-lg">📷</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-gray-500 text-sm mt-3">Tap to change photo</Text>
        </View>

        {/* Personal Information */}
        <View className="bg-white px-4 py-6 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-4">Personal Information</Text>
          
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Full Name *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              placeholder="Enter your full name"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Email *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
            />
          </View>

           <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Aadhar Number *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.aadhar}
              onChangeText={(text) => setFormData({...formData, aadhar: text})}
              placeholder="9876 5432 1022"
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Age</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.age}
              onChangeText={(text) => setFormData({...formData, age: text})}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Gender</Text>
            <View className="flex-row">
              {['Male', 'Female', 'Other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className={`flex-1 py-3 mx-1 rounded-xl ${
                    formData.gender === gender ? 'bg-indigo-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setFormData({...formData, gender})}
                >
                  <Text className={`text-center text-sm font-medium ${
                    formData.gender === gender ? 'text-white' : 'text-gray-700'
                  }`}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* About */}
        <View className="bg-white px-4 py-6 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-4">About</Text>
          
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Bio</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.about}
              onChangeText={(text) => setFormData({...formData, about: text})}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Address */}
        <View className="bg-white px-4 py-6 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-4">Address</Text>
          
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-2">Street Address</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
              placeholder="Enter your address"
            />
          </View>

        </View>

        {/* Skills */}
        <View className="bg-white px-4 py-6 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-4">Skills</Text>
          
          <View className="flex-row mb-4">
            <TextInput
              className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-base mr-2"
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add a skill"
            />
            <TouchableOpacity
              className="bg-indigo-600 px-4 py-3 rounded-xl"
              onPress={addSkill}
            >
              <Text className="text-white font-medium">Add</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap">
            {skills.map((skill, index) => (
              <View key={index} className="bg-indigo-100 px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center">
                <Text className="text-indigo-700 text-sm mr-2">{skill}</Text>
                <TouchableOpacity onPress={() => removeSkill(skill)}>
                  <Text className="text-indigo-700 text-lg">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Experience & Availability */}
        <View className="bg-white px-4 py-6 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-4">Work Details</Text>
          
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-3">Experience Level</Text>
            <View className="flex-row">
              {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                <TouchableOpacity
                  key={level}
                  className={`flex-1 py-3 mx-1 rounded-xl ${
                    formData.experience === level ? 'bg-indigo-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setFormData({...formData, experience: level})}
                >
                  <Text className={`text-center text-sm font-medium ${
                    formData.experience === level ? 'text-white' : 'text-gray-700'
                  }`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-3">Availability</Text>
            <View className="flex-row">
              {['Available', 'Busy', 'Not Available'].map((status) => (
                <TouchableOpacity
                  key={status}
                  className={`flex-1 py-3 mx-1 rounded-xl ${
                    formData.availability === status ? 'bg-green-600' : 'bg-gray-100'
                  }`}
                  onPress={() => setFormData({...formData, availability: status})}
                >
                  <Text className={`text-center text-xs font-medium ${
                    formData.availability === status ? 'text-white' : 'text-gray-700'
                  }`}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className={`py-4 rounded-2xl ${saving ? 'bg-gray-400' : 'bg-indigo-600'}`}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Save Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}