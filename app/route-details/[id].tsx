import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const mockDetails = {
  nextDeparture: "12:30 PM",
  driver: "Tonderai Mupfumi",
  plate: "ABX 2345",
  availableSeats: 8,
  kombiImage:
    "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&q=75&fit=crop&w=600",
};

export default function RouteDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f2f7fb]">
      <View className="bg-[#1b3c6e] p-4 flex-row items-center shadow-lg">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center pr-10">
          Route #{id} Details
        </Text>
      </View>

      <View className="p-4 space-y-4">
        <Image
          source={{ uri: mockDetails.kombiImage }}
          className="w-full h-52 rounded-2xl"
          resizeMode="cover"
        />

        <Text className="text-xl font-bold text-[#1b3c6e]">Next Departure: {mockDetails.nextDeparture}</Text>
        <Text className="text-lg text-gray-600">Driver: {mockDetails.driver}</Text>
        <Text className="text-lg text-gray-600">Plate No: {mockDetails.plate}</Text>
        <Text className="text-lg text-gray-600">Available Seats: {mockDetails.availableSeats}</Text>

        <TouchableOpacity
          className="bg-[#1b3c6e] py-4 rounded-full items-center mt-6"
          onPress={() => router.replace('/home')}
        >
          <Text className="text-white font-bold text-lg">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
