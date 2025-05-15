import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../src/contexts/auth-context';
import Toast from 'react-native-toast-message';

export default function ConfirmOtp() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { confirmOtp } = useAuth();

  const handleConfirm = async () => {
    if (!email || typeof email !== 'string') return;

    setIsLoading(true);
    try {
      const success = await confirmOtp(email, otp);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Confirmed!',
          text2: 'You can now login',
        });
        router.back();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please check the code and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center items-center bg-blue-500"
    >
      <View className="w-[90%] bg-white p-6 rounded-2xl shadow-lg">
        <Text className="text-3xl font-extrabold text-center text-gray-800 mb-2">Verify OTP</Text>
        <Text className="text-center text-gray-500 mb-6">
          We've sent a verification code to{'\n'}
          <Text className="font-semibold text-gray-700">{email}</Text>
        </Text>

        <TextInput
          className="border-2 border-gray-300 text-center text-xl tracking-widest p-4 rounded-xl mb-6 bg-gray-50"
          placeholder="••••••"
          placeholderTextColor="#A0AEC0"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <TouchableOpacity
          className={`p-4 rounded-xl ${
            isLoading ? 'bg-blue-300' : 'bg-blue-600'
          }`}
          onPress={handleConfirm}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">Confirm Code</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
