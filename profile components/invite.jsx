import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function invite() {
  const navigation = useNavigation();
  const [referralCode] = useState('LAAL2024');
  const [totalReferrals] = useState(12);
  const [totalEarnings] = useState(2400);
  const [pendingRewards] = useState(600);

  const shareOptions = [
    {
      id: 1,
      title: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      action: () => shareViaApp('whatsapp')
    },
    {
      id: 2,
      title: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      action: () => shareViaApp('facebook')
    },
    {
      id: 3,
      title: 'Instagram',
      icon: '📷',
      color: 'bg-purple-500',
      action: () => shareViaApp('instagram')
    },
    {
      id: 4,
      title: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-400',
      action: () => shareViaApp('twitter')
    },
    {
      id: 5,
      title: 'Email',
      icon: '📧',
      color: 'bg-red-500',
      action: () => shareViaApp('email')
    },
    {
      id: 6,
      title: 'SMS',
      icon: '💬',
      color: 'bg-green-600',
      action: () => shareViaApp('sms')
    }
  ];

  const recentReferrals = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      status: 'Joined',
      reward: '₹200',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      status: 'Pending',
      reward: '₹200',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      status: 'Completed',
      reward: '₹200',
      date: '2 weeks ago'
    }
  ];

  const shareMessage = `Hey! I've been earning money with Workly - a great app for finding flexible work. Join using my code ${referralCode} and we both get ₹200! Download: https://workly.com/download`;

  const shareViaApp = (platform) => {
    Share.share({
      message: shareMessage,
      title: 'Join Workly and Earn Money!'
    });
  };

  const copyReferralCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const copyInviteLink = () => {
    const inviteLink = `https://workly.com/invite/${referralCode}`;
    Clipboard.setString(inviteLink);
    Alert.alert('Copied!', 'Invite link copied to clipboard');
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
        <Text className="text-lg font-semibold text-gray-800">Invite Friends</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Reward Banner */}
        <View className="mx-4 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6">
          <Text className="text-white text-2xl font-bold mb-2">₹200 for You!</Text>
          <Text className="text-white text-base opacity-90 mb-4">
            ₹200 for Your Friend Too! 🎉
          </Text>
          <Text className="text-white text-sm opacity-80">
            Invite friends to join Workly and you both earn ₹200 when they complete their first job!
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mb-6">
          <View className="flex-1 bg-blue-50 rounded-xl p-4 mr-2">
            <Text className="text-2xl font-bold text-blue-600">{totalReferrals}</Text>
            <Text className="text-sm text-gray-600">Friends Joined</Text>
          </View>
          <View className="flex-1 bg-green-50 rounded-xl p-4 mx-1">
            <Text className="text-2xl font-bold text-green-600">₹{totalEarnings}</Text>
            <Text className="text-sm text-gray-600">Total Earned</Text>
          </View>
          <View className="flex-1 bg-orange-50 rounded-xl p-4 ml-2">
            <Text className="text-2xl font-bold text-orange-600">₹{pendingRewards}</Text>
            <Text className="text-sm text-gray-600">Pending</Text>
          </View>
        </View>

        {/* Referral Code */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Your Referral Code</Text>
          <View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-1">{referralCode}</Text>
              <Text className="text-sm text-gray-600">Share this code with friends</Text>
            </View>
            <TouchableOpacity 
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={copyReferralCode}
            >
              <Text className="text-white font-medium">Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Link */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Invite Link</Text>
          </View>
            </ScrollView>
        </SafeAreaView>

    );  
}

