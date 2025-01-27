import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';
import { Center, useTheme } from 'native-base';
import { Platform } from 'react-native';

type AppTabRoutes = {
  home: undefined;
  history: undefined;
  profile: undefined;
};

type AppStackRoutes = {
  AppTabs: undefined;
  Exercise: { exerciseId: string;  };
};

export type AppTabNavigationProp = BottomTabNavigationProp<AppTabRoutes>;
 
const Tab = createBottomTabNavigator<AppTabRoutes>();
const Stack = createNativeStackNavigator<AppStackRoutes>();

function AppTabs() {
  const { sizes, colors } = useTheme();
  const iconSize = sizes[7];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          paddingTop: sizes[5],
          paddingBottom: Platform.OS === 'ios' ? sizes[16] : sizes[10],
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Center h={sizes[4]} w={sizes[4]}>
              <HomeSvg fill={color} width={iconSize} height={iconSize} />
            </Center>
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <Center h={sizes[4]} w={sizes[4]}>
              <HistorySvg fill={color} width={iconSize} height={iconSize} />
            </Center>
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Center h={sizes[4]} w={sizes[4]}>
              <ProfileSvg fill={color} width={iconSize} height={iconSize} />
            </Center>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppTabs" component={AppTabs} />
      <Stack.Screen name="Exercise" component={Exercise} />
    </Stack.Navigator>
  );
}
