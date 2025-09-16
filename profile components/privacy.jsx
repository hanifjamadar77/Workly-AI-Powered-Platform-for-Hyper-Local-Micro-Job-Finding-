import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function privacy() {
  const navigation = useNavigation();

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, profile picture, and location data when you create an account.',
        'Job-Related Information: Skills, experience, availability, and work preferences to help match you with suitable opportunities.',
        'Transaction Data: Payment information, job history, and earnings for billing and tax purposes.',
        'Usage Data: How you interact with our app, including pages visited, features used, and time spent on the platform.',
        'Device Information: Device type, operating system, unique device identifiers, and mobile network information.'
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'Matching Services: To connect you with relevant job opportunities based on your skills and preferences.',
        'Communication: To send you job alerts, updates, and important notifications about our services.',
        'Payment Processing: To facilitate secure payments and maintain transaction records.',
        'Platform Improvement: To analyze usage patterns and improve our app\'s functionality and user experience.',
        'Safety and Security: To verify user identities, prevent fraud, and ensure platform safety.'
      ]
    },
    {
      title: '3. Information Sharing',
      content: [
        'With Employers: Your profile information, skills, and ratings are shared with potential employers when you apply for jobs.',
        'Service Providers: We work with trusted third-party services for payment processing, analytics, and customer support.',
        'Legal Requirements: We may disclose information when required by law, legal process, or government requests.',
        'Business Transfers: In case of merger, acquisition, or asset sale, user information may be transferred to the new entity.',
        'We never sell your personal information to advertisers or marketing companies.'
      ]
    },
    {
      title: '4. Data Security',
      content: [
        'Encryption: All sensitive data is encrypted both in transit and at rest using industry-standard protocols.',
        'Access Controls: Limited access to personal data on a need-to-know basis with proper authentication.',
        'Regular Audits: We conduct regular security assessments and vulnerability testing.',
        'Secure Infrastructure: Our servers are hosted on secure, certified cloud platforms with 24/7 monitoring.',
        'However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
      ]
    },
    {
      title: '5. Your Privacy Rights',
      content: [
        'Access: Request a copy of all personal information we have about you.',
        'Correction: Update or correct any inaccurate personal information in your profile.',
        'Deletion: Request deletion of your account and associated personal data (subject to legal requirements).',
        'Portability: Export your data in a machine-readable format for transfer to another service.',
        'Opt-out: Unsubscribe from marketing communications while maintaining essential service notifications.'
      ]
    },
    {
      title: '6. Data Retention',
      content: [
        'Active Accounts: We retain your information as long as your account is active and for legitimate business purposes.',
        'Closed Accounts: Most personal data is deleted within 30 days of account closure, except as required by law.',
        'Transaction Records: Financial and tax-related information may be retained for up to 7 years for compliance purposes.',
        'Anonymous Data: We may retain anonymized usage data indefinitely for analytics and service improvement.'
      ]
    },
    {
      title: '7. Cookies and Tracking',
      content: [
        'Essential Cookies: Required for basic app functionality, authentication, and security.',
        'Analytics Cookies: Help us understand how users interact with our platform to improve services.',
        'You can manage cookie preferences in your device settings, but disabling essential cookies may affect app functionality.'
      ]
    },
    {
      title: '8. Third-Party Services',
      content: [
        'Payment Processors: Stripe, PayPal, and other payment services have their own privacy policies.',
        'Map Services: Location features use Google Maps or Apple Maps, subject to their respective privacy policies.',
        'Social Media: If you connect social media accounts, their privacy policies also apply.',
        'We encourage you to review the privacy policies of any third-party services you use through our platform.'
      ]
    },
    {
      title: '9. Children\'s Privacy',
      content: [
        'Our service is not intended for users under 18 years of age.',
        'We do not knowingly collect personal information from children under 18.',
        'If we discover we have collected information from a child under 18, we will delete it immediately.',
        'Parents who believe their child has provided us with personal information should contact us immediately.'
      ]
    },
    {
      title: '10. International Data Transfers',
      content: [
        'Your information may be transferred to and processed in countries other than your residence.',
        'We ensure appropriate safeguards are in place for international transfers.',
        'By using our service, you consent to the transfer of your information to these countries.'
      ]
    },
    {
      title: '11. Policy Updates',
      content: [
        'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements.',
        'We will notify you of material changes via email or app notification.',
        'Continued use of our service after changes constitutes acceptance of the updated policy.',
        'Previous versions of our privacy policy are available upon request.'
      ]
    },
    {
      title: '12. Contact Us',
      content: [
        'If you have questions about this privacy policy or our data practices, please contact us:',
        'Email: privacy@workly.com',
        'Phone: +91 1800-XXX-XXXX',
        'Address: Workly Inc., 123 Tech Street, Mumbai, Maharashtra, India',
        'We will respond to your inquiry within 30 days.'
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
        >
          <Text className="text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Privacy Policy</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Content */}
        <View className="px-4 py-6 bg-blue-50 mx-4 mt-4 rounded-xl">
          <Text className="text-xl font-bold text-gray-800 mb-2">Our Commitment to Privacy</Text>
          <Text className="text-sm text-gray-600 leading-6">
            At Workly, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy explains how we collect, use, and protect your data.
          </Text>
          <Text className="text-xs text-gray-500 mt-3">Last updated: March 15, 2024</Text>
        </View>

        {/* Policy Sections */}
        <View className="px-4 py-4">
          {sections.map((section, index) => (
            <View key={index} className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                {section.title}
              </Text>
              {section.content.map((paragraph, pIndex) => (
                <View key={pIndex} className="mb-3">
                  <Text className="text-sm text-gray-700 leading-6">
                    • {paragraph}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Agreement Section */}
        <View className="px-4 py-6 bg-gray-50 mx-4 mb-6 rounded-xl">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            By using Workly, you agree to this Privacy Policy
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            If you do not agree with any part of this policy, please do not use our service. 
            You can delete your account at any time from the Settings page.
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 bg-blue-50 rounded-xl px-4 mb-3"
            onPress={() => navigation.navigate('DataExport')}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">📄</Text>
              <View>
                <Text className="text-base font-medium text-gray-800">Download My Data</Text>
                <Text className="text-sm text-gray-600">Export all your personal information</Text>
              </View>
            </View>
            <Text className="text-blue-500">›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 bg-green-50 rounded-xl px-4 mb-3"
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🔒</Text>
              <View>
                <Text className="text-base font-medium text-gray-800">Privacy Settings</Text>
                <Text className="text-sm text-gray-600">Manage your privacy preferences</Text>
              </View>
            </View>
            <Text className="text-green-500">›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 bg-red-50 rounded-xl px-4"
            onPress={() => navigation.navigate('DeleteAccount')}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🗑️</Text>
              <View>
                <Text className="text-base font-medium text-red-600">Delete Account</Text>
                <Text className="text-sm text-gray-600">Permanently remove your data</Text>
              </View>
            </View>
            <Text className="text-red-500">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}