import { images } from "@/constants";
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';


export default function TabLayout() {
  // const isAuthenticated = false; // replace with real check

  // if (isAuthenticated) {
  //   return <Redirect href="/(seeker)" />; // or wherever you want after login
  // }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView className='bg-white h-full' keyboardShouldPersistTaps='handled'>
        <View className='w-full relative' style={{ height: Dimensions.get('screen').height / 2.25 }}>
          <ImageBackground source={images.keyBg} className='size-full rounded-b-lg' resizeMode='stretch' />
          <View className='absolute self-center my-72 rounded-full bg-blue-100'>
          <Image source={images.logo} className="self-center size-48 z-10" />
          </View>
        </View>
        
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
    
  );
}