import { decode as atob } from 'base-64';
import { Camera } from "expo-camera";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useRouter } from "expo-router";
import jsQR from "jsqr";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const Pay = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const cameraRef = useRef<any | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);
    setPermissionError(null);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
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

  const scanQRCode = async () => {
    if (!cameraRef.current || scanned) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true, base64: true });
      if (!photo.base64) return;

      const manipulated = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 300 } }],
        { base64: true, format: SaveFormat.JPEG }
      );

      if (!manipulated.base64 || !manipulated.width || !manipulated.height) return;

      const imageData = atob(manipulated.base64);
      const uint8Array = new Uint8ClampedArray(imageData.length);
      for (let i = 0; i < imageData.length; i++) {
        uint8Array[i] = imageData.charCodeAt(i);
      }

      const qr = jsQR(uint8Array, manipulated.width, manipulated.height);
      if (qr && qr.data) {
        setScanned(true);
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowScanner(false);
          Toast.show({
            type: "success",
            text1: "Payment successful!",
            text2: `Paid fare: ${qr.data}`,
          });
          router.push("/home");
        }, 2000);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Scan failed",
        text2: "Something went wrong while scanning.",
      });
    }
  };

  useEffect(() => {
    let interval: any;
    if (showScanner && isCameraReady && !scanned) {
      interval = setInterval(scanQRCode, 1200);
    }
    return () => clearInterval(interval);
  }, [showScanner, isCameraReady, scanned]);

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
      {/* Same rest of your code... */}
      <Toast />
    </View>
  );
};

export default Pay;
