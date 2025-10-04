import React, { useState } from 'react';
import Header from "../../components/profileHeader";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function payment() {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState('card');

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      subtitle: '**** **** **** 1234',
      icon: '💳',
      isDefault: true
    },
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'laal@paytm',
      icon: '📱',
      isDefault: false
    },
    {
      id: 'wallet',
      title: 'Digital Wallet',
      subtitle: 'Paytm Wallet',
      icon: '👛',
      isDefault: false
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      subtitle: 'HDFC Bank ***1234',
      icon: '🏦',
      isDefault: false
    }
  ];

  const handleAddPayment = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleSetDefault = () => {
    Alert.alert('Success', 'Payment method set as default!');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Use custom Header component */}
      <Header title="Payment" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View className="mx-4 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6">
          <Text className="text-white text-sm opacity-90">Current Balance</Text>
          <Text className="text-white text-3xl font-bold mt-1">₹2,450.00</Text>
          <TouchableOpacity className="bg-white bg-opacity-20 px-4 py-2 rounded-xl mt-4 self-start">
            <Text className="text-white font-medium">Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Payment Methods</Text>
            <TouchableOpacity onPress={handleAddPayment}>
              <Text className="text-blue-500 font-medium">+ Add New</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className={`flex-row items-center p-4 rounded-xl mb-3 ${
                selectedMethod === method.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
              onPress={() => handleMethodSelect(method.id)}
            >
              <View className="w-12 h-12 bg-white rounded-xl justify-center items-center mr-4 shadow-sm">
                <Text className="text-2xl">{method.icon}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold text-gray-800">{method.title}</Text>
                  {method.isDefault && (
                    <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                      <Text className="text-green-700 text-xs font-medium">Default</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-600 mt-1">{method.subtitle}</Text>
              </View>
              <View className={`w-5 h-5 rounded-full border-2 ${
                selectedMethod === method.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <Text className="text-white text-xs text-center">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="flex-1 bg-blue-50 p-4 rounded-xl mr-2">
              <Text className="text-2xl mb-2">💸</Text>
              <Text className="text-sm font-medium text-gray-800">Withdraw</Text>
              <Text className="text-xs text-gray-600">Money</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-50 p-4 rounded-xl mx-1">
              <Text className="text-2xl mb-2">📊</Text>
              <Text className="text-sm font-medium text-gray-800">Transaction</Text>
              <Text className="text-xs text-gray-600">History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-purple-50 p-4 rounded-xl ml-2">
              <Text className="text-2xl mb-2">🎁</Text>
              <Text className="text-sm font-medium text-gray-800">Rewards</Text>
              <Text className="text-xs text-gray-600">& Offers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Set Default Button */}
        {selectedMethod && (
          <View className="px-4 mb-6">
            <TouchableOpacity 
              className="bg-blue-500 py-4 rounded-xl"
              onPress={handleSetDefault}
            >
              <Text className="text-white text-center font-semibold">Set as Default</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}