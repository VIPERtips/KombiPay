import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/contexts/theme-context';

export default function _layout() {
  const { darkMode, toggleDarkMode } = useTheme();

  const activeColor = darkMode ? '#93C5FD' : '#1E3A64';    // light blue vs dark blue
  const inactiveColor = darkMode ? '#64748B' : '#8E8E93';  // grayish shades
  const backgroundColor = darkMode ? '#1E293B' : 'white';  // dark bg vs white

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: darkMode ? '#334155' : '#D1D5DB',
          height: 60,
          paddingTop: 10,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <MaterialCommunityIcons name="home" color={color} size={size} />
              <Text className="text-xs" style={{ color }}>Home</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
              <Text className="text-xs" style={{ color }}>Activity</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="pay"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <MaterialCommunityIcons name="credit-card" color={color} size={size} />
              <Text className="text-xs" style={{ color }}>Pay</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center">
              <MaterialCommunityIcons name="account" color={color} size={size} />
              <Text className="text-xs" style={{ color }}>Profile</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="darkmode"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TouchableOpacity
              onPress={toggleDarkMode}
              activeOpacity={0.7}
              style={{ alignItems: 'center' }}
            >
              <MaterialCommunityIcons
                name={darkMode ? 'weather-sunny' : 'weather-night'}
                color={color}
                size={size}
              />
              <Text style={{ color }} className="text-xs">
                {darkMode ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
