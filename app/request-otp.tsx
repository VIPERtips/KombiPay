import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../src/contexts/auth-context';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestOtp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { requestOtp } = useAuth();

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email required',
        text2: 'Please enter your email address',
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestOtp(email.trim());
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Check your email for the code',
      });
      router.push({ pathname: '/confirm-otp', params: { email } });
    } catch (error:any) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: error?.message || 'Failed to send OTP, try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white rounded-3xl p-8 shadow-lg">
          <Text className="text-3xl font-extrabold text-center text-gray-800 mb-4">
            Request OTP
          </Text>
          <Text className="text-center text-gray-500 mb-8">
            Enter your email address to receive a{'\n'}verification code.
          </Text>

          <TextInput
            className="border-2 border-gray-200 p-4 rounded-xl text-lg bg-gray-50 mb-8 shadow-sm"
            placeholder="Email address"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            className={`p-4 rounded-2xl ${
              isLoading ? 'bg-blue-300' : 'bg-blue-600'
            }`}
            onPress={handleRequestOtp}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Send Verification Code
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 self-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text className="text-blue-500 font-medium">Back to Login</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
