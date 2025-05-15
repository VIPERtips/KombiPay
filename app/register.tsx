import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";
import { useAuth } from "../src/contexts/auth-context";
import { RegisterFormValues, registerSchema } from "../src/lib/schemas";

const Register = () => {
  const { register, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values.name, values.email, values.password, values.confirmPassword);
      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: "Welcome to KombiPay!",
      });
      router.replace("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error instanceof Error ? error.message : "Please check your details and try again",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="px-4 w-full">
          <View className={`bg-white rounded-3xl p-${width < 360 ? '6' : '8'} shadow-lg`}>
            <Text className="text-blue-500 text-2xl font-extrabold mb-4 text-center">
              Register for KombiPay
            </Text>
            <Text className="text-neutral-500 text-base mb-8 text-center">
              Create your account to start using KombiPay.
            </Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    className={`border border-gray-300 rounded-full p-3`}
                    placeholder="Full Name"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.name && <Text className="text-red-500 text-sm mt-1 ml-3">{errors.name.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    className={`border border-gray-300 rounded-full p-3`}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.email && <Text className="text-red-500 text-sm mt-1 ml-3">{errors.email.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    className={`border border-gray-300 rounded-full p-3`}
                    placeholder="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.password && <Text className="text-red-500 text-sm mt-1 ml-3">{errors.password.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <View className="mb-6">
                  <TextInput
                    className={`border border-gray-300 rounded-full p-3`}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1 ml-3">{errors.confirmPassword.message}</Text>}
                </View>
              )}
            />

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-kombi-blue-light py-4 rounded-full items-center mb-2"
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Register</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            <Text className="text-neutral-100 text-base">
              Already have an account?{' '}
              <Text
                className="text-blue-400 font-bold"
                onPress={() => router.push('/login')}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
