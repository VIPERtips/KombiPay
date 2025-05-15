import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const Pay = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const requestPermission = async () => {
    setIsRequesting(true);
    setPermissionError(null);
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') setPermissionError("Camera permission denied. Please enable it in your device settings.");
    } catch (e: any) {
      setPermissionError(e.message || "Unknown error requesting camera permission.");
      setHasPermission(false);
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScanClick = () => {
    if (hasPermission === false) {
      Toast.show({
        type: "error",
        text1: "Camera permission denied",
        text2: "Please enable camera permissions to scan QR codes.",
      });
      return;
    }
    setShowScanner(prev => !prev);
    setScanned(false);
    if (!showScanner) {
      Toast.show({
        type: "info",
        text1: "QR Scanner activated.",
        text2: "Point at a kombi fare code to pay.",
      });
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Toast.show({
      type: "success",
      text1: "Payment successful!",
      text2: `Paid fare: ${data}`,
    });
    setTimeout(() => {
      setShowScanner(false);
      router.push("/home");
    }, 2000);
  };

  if (isRequesting) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting camera permission...</Text>
        <TouchableOpacity onPress={requestPermission} className="mt-4 px-4 py-2 bg-blue-600 rounded">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">No access to camera. Please enable it from settings.</Text>
        {permissionError && <Text className="text-red-500 text-center mb-4">{permissionError}</Text>}
        <TouchableOpacity onPress={requestPermission} className="px-4 py-2 bg-blue-600 rounded">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-100 dark:bg-blue-900">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleScanClick}
            className="w-32 h-32 rounded-full bg-blue-600 justify-center items-center mb-6"
          >
            <MaterialCommunityIcons name="qrcode-scan" size={40} color="white" />
            <Text className="text-xs text-white mt-1">Scan & Pay</Text>
          </TouchableOpacity>

          {showScanner && (
            <View className="w-full aspect-square rounded-xl overflow-hidden relative mb-6" style={{ height: 300, width: 300 }}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}

          {!showScanner && (
            <View className="w-full">
              <Text className="text-xl font-semibold mb-6 text-blue-800 dark:text-white text-center">
                Recent Routes
              </Text>

              {[
                { title: "CBD to Warren Park", lastUsed: "Last used today", price: "$2.50" },
                { title: "Avondale to City Center", lastUsed: "Last used yesterday", price: "$3.00" },
              ].map((route, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={handleScanClick}
                  className="bg-white rounded-lg p-4 mb-4 shadow-md"
                  activeOpacity={0.8}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-medium text-gray-900">{route.title}</Text>
                      <Text className="text-sm text-gray-500">{route.lastUsed}</Text>
                    </View>
                    <Text className="font-bold text-blue-600">{route.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
};

export default Pay;
