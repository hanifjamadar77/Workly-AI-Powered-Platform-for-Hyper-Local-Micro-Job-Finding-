import { View, Text, ScrollView } from "react-native";
import Header from "../../components/profileHeader";

export default function postedJobs() {
  return (
    <View className="flex-1 bg-white">
      <Header title="Posted Jobs" />
      <ScrollView className="p-5">
        <Text className="text-gray-700 leading-6">
          We value your privacy. Your personal information is safe with us and
          will not be shared without your consent. {"\n\n"}
          ✅ We collect only necessary data. {"\n"}
          ✅ We never sell your information. {"\n"}
          ✅ You can delete your data anytime. {"\n\n"}
          For full details, visit our website.
        </Text>
      </ScrollView>
    </View>
  );
}
