import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";
import { useAuth } from "../../src/contexts/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getCurrentTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Home = () => {
  const [balance, setBalance] = useState(45.75);
  const router = useRouter();
  const timeGreeting = getCurrentTimeGreeting();
  const { logout, user } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();


  useEffect(() => {
  AsyncStorage.clear();
    Toast.show({
      type: "info",
      text1: "Welcome to KombiPay!",
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Signed out",
        text2: "See you next time, Tadiwa",
      });
      router.replace("/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <View className="flex-1 bg-blue-100 dark:bg-blue-900" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <View className="bg-blue-600 py-4 px-3 shadow-md flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold flex-1 text-center">
          <Text className="text-green-400">Kombi</Text>Pay
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="px-3 py-1.5 bg-red-600 rounded"
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold text-sm">Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ 
          padding: width < 360 ? 12 : 16,
          paddingBottom: insets.bottom + 16
        }} 
        className="flex-grow"
      >
        <Text className="text-lg font-bold mb-3 text-blue-700 dark:text-white">
          {timeGreeting}, {user?.name.split(' ')[0] || "Tadiwa"}
        </Text>

        <View className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-4 mb-4 shadow-lg">
          <Text className="text-green-300 text-lg mb-1">Available Balance</Text>
          <Text className="text-white text-3xl font-bold mb-1">${balance.toFixed(2)}</Text>
          <Text className="text-white/70 text-xs mb-3">
            Updated: {new Date().toLocaleString()}
          </Text>
          <View className="flex-row justify-between space-x-2">
            <TouchableOpacity
              className="flex-1 border border-green-400 rounded px-3 py-1.5"
              activeOpacity={0.7}
              onPress={() => Toast.show({ type: "info", text1: "Top Up clicked" })}
            >
              <Text className="text-green-400 text-center text-sm">Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-white rounded px-3 py-1.5"
              activeOpacity={0.7}
              onPress={() => Toast.show({ type: "info", text1: "Transfer clicked" })}
            >
              <Text className="text-white text-center text-sm">Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={() => router.push('/pay')}
            className={`${width < 360 ? 'w-28 h-28' : 'w-32 h-32'} rounded-full bg-blue-600 flex items-center justify-center space-y-2`}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={width < 360 ? 32 : 40} color="white" />
            <Text className="text-white text-xs">Scan & Pay</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-3 text-blue-900 dark:text-white">Quick Access</Text>
        <View className="flex-row justify-between space-x-2">
          <TouchableOpacity
            onPress={() => router.push('/activity')}
            className="flex-1 bg-white rounded-lg p-3 shadow-md items-center"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="history" size={width < 360 ? 24 : 28} color="#2563EB" />
            <Text className="font-medium mt-1 text-sm">Payment History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/routes')}
            className="flex-1 bg-white rounded-lg p-3 shadow-md items-center"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="map-marker-path" size={width < 360 ? 24 : 28} color="#2563EB" />
            <Text className="font-medium mt-1 text-sm">Routes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
