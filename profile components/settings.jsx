import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function settings() {
  const navigation = useNavigation();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    locationServices: true,
    darkMode: false,
    autoAcceptJobs: false,
    showOnlineStatus: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsGroups = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive job alerts and updates',
          type: 'toggle'
        },
        {
          key: 'emailUpdates',
          title: 'Email Updates',
          subtitle: 'Get weekly summary via email',
          type: 'toggle'
        },
        {
          title: 'Notification Settings',
          subtitle: 'Customize notification preferences',
          type: 'navigation',
          screen: 'NotificationSettings'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          key: 'locationServices',
          title: 'Location Services',
          subtitle: 'Share location for nearby jobs',
          type: 'toggle'
        },
        {
          key: 'showOnlineStatus',
          title: 'Show Online Status',
          subtitle: 'Let employers see when you\'re active',
          type: 'toggle'
        },
        {
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          type: 'navigation',
          screen: 'PrivacySettings'
        },
        {
          title: 'Security',
          subtitle: 'Password and security settings',
          type: 'navigation',
          screen: 'SecuritySettings'
        }
      ]
    },
    {
      title: 'App Preferences',
      items: [
        {
          key: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Enable dark theme',
          type: 'toggle'
        },
        {
          key: 'autoAcceptJobs',
          title: 'Auto Accept Jobs',
          subtitle: 'Automatically accept matching jobs',
          type: 'toggle'
        },
        {
          title: 'Language',
          subtitle: 'English',
          type: 'navigation',
          screen: 'LanguageSettings'
        },
        {
          title: 'App Theme',
          subtitle: 'Customize app appearance',
          type: 'navigation',
          screen: 'ThemeSettings'
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Account Information',
          subtitle: 'Manage your account details',
          type: 'navigation',
          screen: 'AccountInfo'
        },
        {
          title: 'Subscription',
          subtitle: 'Manage your premium features',
          type: 'navigation',
          screen: 'Subscription'
        },
        {
          title: 'Data Export',
          subtitle: 'Download your data',
          type: 'navigation',
          screen: 'DataExport'
        },
        {
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'navigation',
          screen: 'DeleteAccount',
          danger: true
        }
      ]
    }
  ];

  const handleNavigation = (screen) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  const renderSettingItem = (item) => {
    if (item.type === 'toggle') {
      return (
        <View key={item.key} className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-base font-medium text-gray-800">{item.title}</Text>
            {item.subtitle && (
              <Text className="text-sm text-gray-600 mt-1">{item.subtitle}</Text>
            )}
          </View>
          <Switch
            value={settings[item.key]}
            onValueChange={() => toggleSetting(item.key)}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor={settings[item.key] ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.title}
        className="flex-row items-center justify-between py-4 border-b border-gray-100"
        onPress={() => handleNavigation(item.screen)}
      >
        <View className="flex-1">
          <Text className={`text-base font-medium ${item.danger ? 'text-red-600' : 'text-gray-800'}`}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text className="text-sm text-gray-600 mt-1">{item.subtitle}</Text>
          )}
        </View>
        <Text className="text-gray-400 text-lg">›</Text>
      </TouchableOpacity>
    );
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
        <Text className="text-lg font-semibold text-gray-800">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={group.title} className="px-4 mb-6">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group.title}
            </Text>
            <View className="bg-white rounded-xl">
              {group.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderSettingItem(item)}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View className="px-4 py-8 items-center">
          <Text className="text-sm text-gray-500">Workly App</Text>
          <Text className="text-sm text-gray-400 mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}