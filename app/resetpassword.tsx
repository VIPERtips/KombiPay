import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Card, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { useAuth } from "../src/contexts/auth-context";

type ResetPasswordRouteParams = { token?: string };

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordScreen = () => {
 const router = useRouter();
  const route = useRoute<RouteProp<Record<string, ResetPasswordRouteParams>, string>>();
  const token = route.params?.token;
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Invalid Request",
        text2: "Missing reset token",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, values.password);
      Toast.show({
        type: "success",
        text1: "Password reset successful",
        text2: "Your password has been updated",
      });
      router.push("/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Reset failed",
        text2: error instanceof Error ? error.message : "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-blue-500 dark:bg-blue-900 p-4">
        <Card style={{ width: "100%", maxWidth: 400 }}>
          <Card.Title title="Invalid Request" />
          <Card.Content>
            <Text className="text-center text-gray-700 dark:text-gray-300">
              Missing reset token. Please request a new password reset link.
            </Text>
          </Card.Content>
          <Card.Actions className="justify-center">
            <TouchableOpacity onPress={() => router.push("/forgotpassword")} className="mt-4 bg-blue-500 px-4 py-2 rounded">
              <Text className="text-white">Request New Link</Text>
            </TouchableOpacity>
          </Card.Actions>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-500 dark:bg-blue-900 p-4 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center text-gray-800 dark:text-white">KombiPay</Text>
        <Text className="text-center text-gray-100 dark:text-gray-300 mt-2">Set your new password</Text>
      </View>

      <Card style={{ width: "100%", maxWidth: 400, alignSelf: "center" }}>
        <Card.Title title="Reset Password" />
        <Card.Content>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="New Password"
                secureTextEntry
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
              />
            )}
          />
          {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Confirm Password"
                secureTextEntry
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.confirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                className="mt-4"
              />
            )}
          />
          {errors.confirmPassword && <Text className="text-red-500 mt-1">{errors.confirmPassword.message}</Text>}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6 bg-blue-600 py-3 rounded flex-row justify-center items-center"
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text className="text-white ml-2">Resetting...</Text>
              </>
            ) : (
              <Text className="text-white">Reset Password</Text>
            )}
          </TouchableOpacity>
        </Card.Content>
      </Card>
      <Toast />
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
