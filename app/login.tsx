import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../src/contexts/auth-context';
import Toast from 'react-native-toast-message';
import { loginSchema, type LoginFormValues } from '../src/lib/schemas';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    console.log('BRO... onSubmit called with values:', values);
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: 'Welcome to KombiPay!',
      });
     
      setTimeout(() => {
        router.replace('/home');
      }, 500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error instanceof Error ? error.message : 'Invalid credentials, try again',
      });
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <SafeAreaView className="flex-1 bg-[#1b3c6e]" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="px-4 w-full">
          <View className={`bg-white rounded-3xl p-${width < 360 ? '6' : '8'} shadow-lg`}>
            <Text className="text-blue-500 text-2xl font-extrabold mb-4 text-center">
              Login to KombiPay
            </Text>
            <Text className="text-neutral-500 text-base mb-8 text-center">
              Tap, ride, pay. Making kombi payments stress-free.
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="mb-4">
                  <TextInput
                    className={`border rounded-full p-3 ${error ? "border-red-500" : "border-gray-300"}`}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                  {error && <Text className="text-red-500 text-sm mt-1 ml-3">{error.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="mb-6">
                  <TextInput
                    className={`border rounded-full p-3 ${error ? "border-red-500" : "border-gray-300"}`}
                    placeholder="••••••••"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {error && <Text className="text-red-500 text-sm mt-1 ml-3">{error.message}</Text>}
                </View>
              )}
            />

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-kombi-green-dark py-4 rounded-full items-center mb-2"
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            <Text className="text-neutral-100 text-base">
              Don't have an account?{' '}
              <Text
                className="text-blue-400 font-bold"
                onPress={() => router.push('/register')}
              >
                Register
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
