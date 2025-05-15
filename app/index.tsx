import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-blue-500 p-4">
      <View className="bg-white rounded-3xl p-8 mb-8 w-64 h-48 justify-center items-center shadow-lg">
        <Image
          source={require('../assets/images/kombipay_app_icon.png')}
          style={{ width: 120, height: 80 }}
          resizeMode="contain"
        />
      </View>
      <Text className="text-white text-3xl font-extrabold mb-4 text-center">
        Welcome to KombiPay
      </Text>
      <Text className="text-neutral-100 text-base mb-8 text-center">
        Tap, ride, pay. Kombi payments, the easy way. Like, seriously, if you’re still paying cash, what are you even doing?
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/login')}
        className="bg-kombi-blue-light px-10 py-4 rounded-full shadow-md"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
