import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../src/contexts/auth-context";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Yeah, that doesn’t look like a real email." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      setEmailSent(true);
      Toast.show({
        type: "success",
        text1: "Email sent!",
        text2: "Check your inbox — and don’t forget to open it this time.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Request failed",
        text2: error instanceof Error ? error.message : "Couldn’t send the reset link. Try again or blame your internet.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-blue-500 dark:to-kombi-blue-dark p-4">
      <View className="w-full max-w-md mx-auto mt-10">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">KombiPay</Text>
          <Text className="text-gray-300 dark:text-gray-300 mt-2">Recover your account, because yeah, that password is important.</Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Text className="text-2xl font-bold text-center mb-2">Reset Password</Text>
          <Text className="text-center text-gray-600 dark:text-gray-300 mb-4">
            {emailSent
              ? "Check your email for reset instructions. No, seriously, check it."
              : "Enter your email to get a reset link. Don’t mess it up this time."}
          </Text>

          {emailSent ? (
            <View className="items-center py-8">
              <MaterialCommunityIcons name="check-circle" size={48} color="green" />
              <Text className="mt-4 text-gray-600 dark:text-gray-300 text-center">
                Password reset link sent. Inbox is your new best friend.
              </Text>
            </View>
          ) : (
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="mb-1 font-medium">Email</Text>
                    <TextInput
                      placeholder="email@example.com"
                      className="border border-gray-300 dark:border-gray-600 rounded-3xl px-4 py-3 bg-white dark:bg-gray-700 text-black dark:text-white"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.email && (
                      <Text className="text-red-500 mt-1">{errors.email.message}</Text>
                    )}
                  </View>
                )}
              />

              <TouchableOpacity
                className="bg-kombi-blue-light py-4 rounded-3xl items-center"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="mt-6 items-center">
          <Text className="text-sm text-neutral-200 dark:text-gray-400">
            Remember your password?{" "}
            <Text
              onPress={() => {router.push("/login")}}
              className="text-blue-300 font-bold underline"
            >
              Back to Login
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default ForgotPassword;
