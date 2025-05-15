import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";

const routesData = [
  {
    id: 1,
    name: "CBD to Warren Park",
    price: 2.5,
    duration: "30 min",
    distance: "8 km",
    frequency: "Every 10 min",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&q=75&fit=crop&w=600",
  },
  {
    id: 2,
    name: "Avondale to City Center",
    price: 3.0,
    duration: "25 min",
    distance: "6.5 km",
    frequency: "Every 15 min",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&q=75&fit=crop&w=600",
  },
  {
    id: 3,
    name: "City Center to Mbare",
    price: 2.5,
    duration: "20 min",
    distance: "5 km",
    frequency: "Every 8 min",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&q=75&fit=crop&w=600",
  },
  {
    id: 4,
    name: "Borrowdale to CBD",
    price: 3.5,
    duration: "35 min",
    distance: "11 km",
    frequency: "Every 20 min",
    image:
      "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&q=75&fit=crop&w=600",
  },
  {
    id: 5,
    name: "Highfield to Town",
    price: 2.75,
    duration: "28 min",
    distance: "7.5 km",
    frequency: "Every 12 min",
    image:
      "https://images.unsplash.com/photo-1570125909504-9c0c35525b31?auto=format&q=75&fit=crop&w=600",
  },
];

export default function Routes() {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  function handleSelect(routeId: number) {
    setSelectedRoute(routeId);
    Toast.show({
      type: "success",
      text1: "Route Selected",
      text2: "Viewing route details...",
    });

    router.push(`/route-details/${routeId}` as any);
  }

  return (
    <View className="flex-1 bg-[#f2f7fb]" style={{ paddingTop: insets.top }}>
      <View className="bg-[#1b3c6e] p-4 flex-row items-center shadow-lg">
        <TouchableOpacity
          className="mr-2"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center pr-10">
          Kombi Routes
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: width < 360 ? 12 : 16
        }}
      >
        {routesData.map((route) => (
          <TouchableOpacity
            key={route.id}
            onPress={() => handleSelect(route.id)}
            activeOpacity={0.9}
            className={`mb-5 rounded-3xl overflow-hidden ${
              selectedRoute === route.id ? "border-2 border-[#1b3c6e]" : ""
            } bg-white shadow-md`}
          >
            <Image
              source={{ uri: route.image }}
              className={`w-full ${width < 360 ? 'h-40' : 'h-48'}`}
              resizeMode="cover"
            />
            <View className={`p-${width < 360 ? '3' : '4'} space-y-2`}>
              <Text className="font-extrabold text-lg text-[#1b3c6e]">{route.name}</Text>
              <View className="flex-row justify-between flex-wrap">
                <Text className="text-gray-500 text-sm">Price: ${route.price}</Text>
                <Text className="text-gray-500 text-sm">Duration: {route.duration}</Text>
              </View>
              <View className="flex-row justify-between flex-wrap">
                <Text className="text-gray-500 text-sm">Distance: {route.distance}</Text>
                <Text className="text-gray-500 text-sm">Freq: {route.frequency}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Toast />
    </View>
  );
}
