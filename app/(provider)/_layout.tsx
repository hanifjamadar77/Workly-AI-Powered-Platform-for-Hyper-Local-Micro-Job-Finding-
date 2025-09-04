import { Slot, Tabs } from 'expo-router';
import React from 'react';

import { images } from '@/constants';
import { TabBarIconProps } from '@/type';
// import cn from 'clsx';
import { Image, View } from 'react-native';

const TabBarIcon = ({ focused, icon , title} : TabBarIconProps) => (
  <View className='tab-icon'>
    <Image source={icon} className='size-7' resizeMode='contain' tintColor={focused ? '#FE8C00' : '#5D5F6D'}/>
  </View>
)

export default function TabLayout() {
//   const { isAuthenticated } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Redirect href="/(auth)/sign-in" />;
//   }

  return (
    <Tabs 
      screenOptions={{
        headerShown : false,
        tabBarShowLabel : true,
        tabBarStyle:{
          borderTopLeftRadius : 50,
          borderTopRightRadius : 50,
          borderBottomLeftRadius : 50,
          borderBottomRightRadius : 50,
          marginHorizontal: 20,
          height:60,
          position: 'absolute',
          bottom: 20,
          backgroundColor:'white',
          shadowColor:'#1a1a1a',
          shadowOffset:{width: 0, height: 0},
          shadowOpacity:0.1,
          shadowRadius:4,
          elevation:5,
        }
      }} 
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => <TabBarIcon title='Home' icon={images.home} focused={focused}/>,
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({focused}) => <TabBarIcon title='Search' icon={images.search} focused={focused}/>,
        }}
      />

      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarIcon: ({focused}) => <TabBarIcon title='Cart' icon={images.bag} focused={focused}/>,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({focused}) => <TabBarIcon title='Profile' icon={images.person} focused={focused}/>,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => <TabBarIcon title='Profile' icon={images.person} focused={focused}/>,
        }}
      />
      <Slot />
    </Tabs>
  )
}