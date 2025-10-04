import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View, Text } from "react-native";

export default function Header({ title }) {
  const router = useRouter();

  const handleBack = () => {
    router.push("supportPages/profile"); // always redirect to profile page
  };

  return (
    <View className="flex-row items-center p-4 bg-white shadow">
      {/* Left: Back Button */}
      <TouchableOpacity onPress={handleBack} className="mr-3 w-10">
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      {/* Center: Title */}
      <View className="flex-1 items-center">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>

      {/* Right: Spacer to balance back button */}
      <View className="w-10" />
    </View>
  );
}
