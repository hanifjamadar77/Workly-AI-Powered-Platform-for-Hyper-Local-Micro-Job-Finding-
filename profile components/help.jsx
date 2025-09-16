import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function help() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const quickActions = [
    {
      id: 1,
      title: 'Chat with Us',
      subtitle: 'Get instant help',
      icon: '💬',
      action: () => Alert.alert('Chat', 'Opening chat support...')
    },
    {
      id: 2,
      title: 'Call Support',
      subtitle: '+91 1800-XXX-XXXX',
      icon: '📞',
      action: () => Linking.openURL('tel:+918001234567')
    },
    {
      id: 3,
      title: 'Email Us',
      subtitle: 'support@workly.com',
      icon: '📧',
      action: () => Linking.openURL('mailto:support@workly.com')
    },
    {
      id: 4,
      title: 'Video Tutorials',
      subtitle: 'Learn how to use app',
      icon: '🎥',
      action: () => navigation.navigate('VideoTutorials')
    }
  ];

  const faqData = [
    {
      id: 1,
      question: 'How do I find jobs near me?',
      answer: 'Enable location services in your settings, then use the search filter to find jobs within your preferred distance. You can also browse by category to find specific types of work.'
    },
    {
      id: 2,
      question: 'How do I get paid for completed jobs?',
      answer: 'Payments are processed automatically after job completion and employer confirmation. Money is transferred to your selected payment method within 24-48 hours.'
    },
    {
      id: 3,
      question: 'What if I can\'t complete a job?',
      answer: 'Contact the employer immediately through the app. If you need to cancel, do so at least 2 hours before the scheduled time to avoid penalties.'
    },
    {
      id: 4,
      question: 'How do I improve my profile rating?',
      answer: 'Complete jobs on time, communicate clearly with employers, maintain professional behavior, and ask for reviews after successful job completion.'
    },
    {
      id: 5,
      question: 'Can I work multiple jobs at once?',
      answer: 'Yes, you can accept multiple jobs as long as they don\'t conflict with each other\'s timing. Make sure you can fulfill all commitments.'
    },
    {
      id: 6,
      question: 'How do I report a problem with an employer?',
      answer: 'Use the "Report" button in the job details or chat screen. Our support team will review and take appropriate action within 24 hours.'
    },
    {
      id: 7,
      question: 'What are the app service fees?',
      answer: 'Workly charges a 5% service fee on completed jobs. This fee is automatically deducted from your earnings before payment.'
    },
    {
      id: 8,
      question: 'How do I delete my account?',
      answer: 'Go to Settings > Account > Delete Account. Note that this action is irreversible and all your data will be permanently removed.'
    }
  ];

  const categories = [
    { title: 'Getting Started', count: 12 },
    { title: 'Finding Jobs', count: 8 },
    { title: 'Payments', count: 15 },
    { title: 'Profile & Ratings', count: 6 },
    { title: 'Safety & Security', count: 10 },
    { title: 'Technical Issues', count: 9 }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text className="text-lg font-semibold text-gray-800">Help Center</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 mb-6">
          <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
            <Text className="text-gray-500 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base"
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-[48%] bg-gray-50 p-4 rounded-xl mb-3"
                onPress={action.action}
              >
                <Text className="text-2xl mb-2">{action.icon}</Text>
                <Text className="text-sm font-semibold text-gray-800">{action.title}</Text>
                <Text className="text-xs text-gray-600 mt-1">{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Browse by Category</Text>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => navigation.navigate('HelpCategory', { category: category.title })}
            >
              <Text className="text-base text-gray-800">{category.title}</Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-500 mr-2">{category.count} articles</Text>
                <Text className="text-gray-400">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Frequently Asked Questions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </Text>
          {filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              className="bg-gray-50 rounded-xl p-4 mb-3"
              onPress={() => toggleFAQ(faq.id)}
            >
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-base font-medium text-gray-800 pr-2">
                  {faq.question}
                </Text>
                <Text className={`text-lg transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}>
                  ▼
                </Text>
              </View>
              {expandedFAQ === faq.id && (
                <Text className="text-sm text-gray-600 mt-3 leading-6">
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View className="px-4 py-8 bg-blue-50 mx-4 rounded-xl mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-2 text-center">
            Still need help?
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            Our support team is available 24/7 to assist you
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 py-3 rounded-xl"
            onPress={() => Alert.alert('Contact Support', 'Connecting you with support...')}
          >
            <Text className="text-white text-center font-semibold">Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}