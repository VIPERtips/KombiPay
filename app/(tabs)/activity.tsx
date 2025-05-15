import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const transactions = [
  {
    id: "1",
    date: new Date().toISOString(),
    amount: -2.5,
    route: "Sunningdale to CBD",
    type: "payment",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000).toISOString(),
    amount: -3.0,
    route: "CBD to UZ",
    type: "payment",
  },
  {
    id: "3",
    date: new Date(Date.now() - 172800000).toISOString(),
    amount: 20.0,
    route: null,
    type: "topup",
  },
  {
    id: "4",
    date: new Date(Date.now() - 259200000).toISOString(),
    amount: -2.5,
    route: "UZ to Vainona",
    type: "payment",
  },
  {
    id: "5",
    date: new Date(Date.now() - 300000000).toISOString(),
    amount: -3.5,
    route: "CBD to Avondale",
    type: "payment",
  },
  {
    id: "6",
    date: new Date(Date.now() - 350000000).toISOString(),
    amount: -2.8,
    route: "CBD to Mabvuku",
    type: "payment",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Activity = () => {
  const navigation = useNavigation();
  const [selectedRoute, setSelectedRoute] = useState<string>("All");

  const filteredTransactions =
    selectedRoute === "All"
      ? transactions
      : transactions.filter((t) => t.route === selectedRoute);

  const renderTransaction = ({ item }: any) => (
    <View className="border-l-4 border-blue-500 bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-gray-900 dark:text-white">
            {item.type === "payment" ? item.route : "Account Top Up"}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {formatDate(item.date)}
          </Text>
        </View>
        <Text
          className={`font-bold ${
            item.amount > 0
              ? "text-green-500"
              : "text-blue-600 dark:text-blue-400"
          }`}
        >
          {item.amount > 0 ? "+" : ""}
          {item.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 dark:bg-blue-900 mt-3">
  <View style={{ flex: 1, width: '100%', paddingHorizontal: 20, paddingTop: 80 }}>
        <Text className="text-xl font-semibold mb-4 text-blue-300 text-center">
          Recent Transactions
        </Text>

        {/* Route Filter */}
        <View className="mb-5 bg-white rounded-3xl p-2 border border-gray-300 dark:border-gray-700 overflow-hidden">
          <Picker
            selectedValue={selectedRoute}
            onValueChange={(itemValue) => setSelectedRoute(itemValue)}
            style={{
              color: "#1E40AF",
              height: 56,
              width: '100%',
            }}
            dropdownIconColor="#1E40AF"
          >
            <Picker.Item label="All Routes" value="All" />
            <Picker.Item label="Sunningdale to CBD" value="Sunningdale to CBD" />
            <Picker.Item label="CBD to UZ" value="CBD to UZ" />
            <Picker.Item label="UZ to Vainona" value="UZ to Vainona" />
            <Picker.Item label="CBD to Avondale" value="CBD to Avondale" />
            <Picker.Item label="CBD to Mabvuku" value="CBD to Mabvuku" />
          </Picker>
        </View>

        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-4" />}
          contentContainerStyle={{
            paddingBottom: 50,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No transactions for this route.
            </Text>
          }
        />
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default Activity;
