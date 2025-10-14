import React, { useState } from 'react';
import Header from "../../components/profileHeader";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "@/lib/ThemeContext";

export default function Settings() {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    locationServices: true,
    darkMode: isDarkMode,
    autoAcceptJobs: false,
    showOnlineStatus: true,
  });

  const toggleSetting = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
      setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const settingsGroups = [
    {
      title: 'Notifications',
      items: [
        { key: 'notifications', title: 'Push Notifications', subtitle: 'Receive job alerts and updates', type: 'toggle' },
        { key: 'emailUpdates', title: 'Email Updates', subtitle: 'Get weekly summary via email', type: 'toggle' },
        { title: 'Notification Settings', subtitle: 'Customize notification preferences', type: 'navigation', screen: 'NotificationSettings' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { key: 'locationServices', title: 'Location Services', subtitle: 'Share location for nearby jobs', type: 'toggle' },
        { key: 'showOnlineStatus', title: 'Show Online Status', subtitle: 'Let employers see when you\'re active', type: 'toggle' },
        { title: 'Privacy Settings', subtitle: 'Manage your privacy preferences', type: 'navigation', screen: 'PrivacySettings' },
        { title: 'Security', subtitle: 'Password and security settings', type: 'navigation', screen: 'SecuritySettings' },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { key: 'darkMode', title: 'Dark Mode', subtitle: 'Enable dark theme', type: 'toggle' },
        { key: 'autoAcceptJobs', title: 'Auto Accept Jobs', subtitle: 'Automatically accept matching jobs', type: 'toggle' },
        { title: 'Language', subtitle: 'English', type: 'navigation', screen: 'LanguageSettings' },
        { title: 'App Theme', subtitle: 'Customize app appearance', type: 'navigation', screen: 'ThemeSettings' },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Account Information', subtitle: 'Manage your account details', type: 'navigation', screen: 'AccountInfo' },
        { title: 'Subscription', subtitle: 'Manage your premium features', type: 'navigation', screen: 'Subscription' },
        { title: 'Data Export', subtitle: 'Download your data', type: 'navigation', screen: 'DataExport' },
        { title: 'Delete Account', subtitle: 'Permanently delete your account', type: 'navigation', screen: 'DeleteAccount', danger: true },
      ]
    }
  ];

  const handleNavigation = (screen) => {
    if (screen) navigation.navigate(screen);
  };

  const renderSettingItem = (item, index) => {
    const key = item.key ?? item.title ?? index;
    if (item.type === 'toggle') {
      const value = item.key === 'darkMode' ? isDarkMode : settings[item.key];

      return (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#444' : '#E5E7EB',
          }}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text }}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={{ fontSize: 12, color: colors.subtitle, marginTop: 4 }}>
                {item.subtitle}
              </Text>
            )}
          </View>
          <Switch
            value={value}
            onValueChange={() => toggleSetting(item.key)}
            trackColor={{ false: '#E5E7EB', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      );
    }

    // Navigation items
    return (
      <TouchableOpacity
        key={key}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? '#444' : '#E5E7EB',
        }}
        onPress={() => handleNavigation(item.screen)}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: item.danger ? 'red' : colors.text }}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={{ fontSize: 12, color: colors.subtitle, marginTop: 4 }}>
              {item.subtitle}
            </Text>
          )}
        </View>
        <Text style={{ fontSize: 20, color: isDarkMode ? '#888' : '#AAA' }}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Header title="Settings" />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        {settingsGroups.map((group, gIndex) => (
          <View key={group.title ?? gIndex} style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.subtitle, marginBottom: 8, textTransform: 'uppercase' }}>
              {group.title}
            </Text>
            <View style={{ borderRadius: 12, backgroundColor: colors.card }}>
              {group.items.map((item, index) => renderSettingItem(item, index))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 24, alignItems: 'center' }}>
          <Text style={{ color: colors.subtitle }}>Workly App</Text>
          <Text style={{ color: colors.subtitle, marginTop: 4 }}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
