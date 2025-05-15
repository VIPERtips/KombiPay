import { useAuth } from "@/src/contexts/auth-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const currentDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { logout, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Tadiwa Blessed");
  const [tempName, setTempName] = useState(name);
  const [darkMode, setDarkMode] = useState(false);

  const toggleFeature = (feature: string) => {
    Toast.show({ type: "info", text1: `${feature} toggled` });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    Toast.show({ type: "info", text1: `Dark Mode ${!darkMode ? "enabled" : "disabled"}` });
  };

  const saveName = () => {
    if (!tempName.trim()) {
      Toast.show({ type: "error", text1: "Name cannot be empty" });
      return;
    }
    setName(tempName.trim());
    setIsEditing(false);
    Toast.show({ type: "success", text1: "Profile updated" });
  };

  const cancelEdit = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Toast.show({ type: "info", text1: "Account deleted" });
            // simulate user deletion
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-100">
        <Text className="text-xl mb-4">Please log in to view profile</Text>
        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace("/login");
          }}
          className="border border-blue-600 rounded-lg py-3 px-6 mt-4"
        >
          <Text className="text-blue-600 font-semibold text-lg">Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${darkMode ? "bg-blue-900" : "bg-blue-500"}`}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        <View
          className={`relative rounded-lg overflow-hidden mb-8`}
          style={{ width: width - 32, alignSelf: "center" }}
        >
          <View className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg" />
          <View
            className="absolute top-16 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-blue-600 justify-center items-center"
            style={{ width: 100, height: 100 }}
          >
            <Text className="text-white text-3xl font-bold">TB</Text>
          </View>
          <View className="mt-20 mb-6 items-center px-4">
            {isEditing ? (
              <>
                <TextInput
                  className={`border rounded-md px-4 py-2 w-full ${
                    darkMode ? "bg-blue-800 text-white border-blue-600" : "bg-white text-black border-gray-300"
                  }`}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  maxLength={30}
                />
                <View className="flex-row mt-4 space-x-4">
                  <TouchableOpacity onPress={saveName} className="bg-blue-600 px-6 py-2 rounded-md">
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelEdit}
                    className={`${darkMode ? "bg-blue-700" : "bg-gray-300"} px-6 py-2 rounded-md`}
                  >
                    <Text className={darkMode ? "text-white" : "text-black"}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>{name}</Text>
                <Text className={`text-gray-600 ${darkMode ? "text-gray-300" : ""}`}>
                  Joined {currentDate}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="mt-3 bg-blue-700 rounded px-4 py-1"
                >
                  <Text className="text-white font-semibold">Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Text className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-blue-800"}`}>
          Settings
        </Text>

        {[
          {
            title: "Notifications",
            onPress: () => toggleFeature("Notifications"),
            icon: "bell-outline",
          },
          {
            title: "Dark Mode",
            onPress: toggleDarkMode,
            icon: darkMode ? "weather-sunny" : "weather-night",
          },
          {
            title: "Account Security",
            onPress: () => toggleFeature("Account Security"),
            icon: "shield-lock-outline",
          },
          {
            title: "Payment Methods",
            onPress: () => toggleFeature("Payment Methods"),
            icon: "credit-card-outline",
          },
          {
            title: "Delete Account",
            onPress: confirmDelete,
            icon: "account-remove-outline",
          },
        ].map(({ title, onPress, icon }) => (
          <TouchableOpacity
            key={title}
            onPress={onPress}
            activeOpacity={0.7}
            className={`rounded-lg p-4 mb-4 flex-row justify-between items-center shadow ${
              darkMode ? "bg-blue-800" : "bg-white"
            }`}
          >
            <View className="flex-row items-center space-x-3">
              <MaterialCommunityIcons name={icon as any} size={24} color="#3b82f6" />
              <Text className={`${darkMode ? "text-white" : "text-black"} font-medium text-lg`}>
                {title}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#3b82f6" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace("/login");
          }}
          className="border border-blue-600 rounded-lg py-3 mt-8 items-center"
        >
          <Text className="font-semibold text-lg text-blue-600">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
