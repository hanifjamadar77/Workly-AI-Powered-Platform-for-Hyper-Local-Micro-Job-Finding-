import { useNavigation } from '@react-navigation/native';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from "@/constants";

export default function WorkerProfileScreen({ route }) {
  const navigation = useNavigation();
  const { profile } = route?.params || {};

  // Extended profile data (in real app, fetch from API)
  const workerData = {
    ...profile,
    about: "Hello, my name is [Your Name]. I am a professional plumber with experience in installing, repairing, and maintaining water supply and drainage systems. I specialize in fixing leaks, unclogging drains, and installing new fixtures for both homes and businesses. I am dedicated to providing reliable service and high-quality workmanship.",
    experience: [
      {
        id: 1,
        title: "Plumber | XYZ Plumbing Services | 2 Years",
        description: "Installed, repaired, and maintained residential and commercial plumbing systems including water supply lines, drainage systems, and fixtures."
      },
      {
        id: 2,
        title: "Plumber | ABC Home Solutions | 3 Years",
        description: "Installed and repaired piping systems for water supply, heating, and sanitation in homes and small businesses."
      }
    ],
    address: {
      name: "Mr. Cris Ronaldo",
      flat: "Flat No. 204, Sai Residency Apartment",
      area: "Shivaji Nagar, Near D.H. Ration College",
      city: "Pune",
      state: "Maharashtra, India",
      mobile: "+91 98765 43210",
      email: "crisronaldo@gmail.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200"
    ],
    skills: ["Plumbing", "Pipe Installation", "Leak Repair", "Drain Cleaning", "Fixture Installation"],
    rating: 4.8,
    reviewCount: 156,
    completedJobs: 89,
    responseTime: "Within 2 hours"
  };

  const handleHire = () => {
    Alert.alert('Hire Worker', `Send job request to ${workerData.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Request', onPress: () => console.log('Hiring...') }
    ]);
  };

  const handleCall = () => {
    Alert.alert('Call Worker', `Call ${workerData.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling...') }
    ]);
  };

  const handleMessage = () => {
    navigation.navigate('Chat', { worker: workerData });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
    <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white"> 
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center"
        >
          {/* <Text className="text-lg">←</Text> */}
          <Image className = "size-5" source={images.arrowBack}/>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Worker Profile</Text>
        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
          <Text className="text-lg">⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="items-center">
            <View className="w-20 h-20 bg-red-500 rounded-full justify-center items-center mb-3">
              <Image
                source={{ uri: workerData.avatar }}
                className="w-18 h-18 rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {workerData.name}
            </Text>
            <Text className="text-gray-600 mb-2">{workerData.profession}</Text>
            
            {/* Stats Row */}
            <View className="flex-row items-center space-x-6 mb-4">
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{workerData.rating}</Text>
                <Text className="text-xs text-gray-600">Rating</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{workerData.completedJobs}</Text>
                <Text className="text-xs text-gray-600">Jobs Done</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{workerData.reviewCount}</Text>
                <Text className="text-xs text-gray-600">Reviews</Text>
              </View>
            </View>

            {/* Response Time */}
            <View className="bg-green-100 px-3 py-2 rounded-full">
              <Text className="text-green-700 text-sm font-medium">
                Responds {workerData.responseTime}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">About</Text>
          <Text className="text-gray-700 leading-6">
            {workerData.about}
          </Text>
        </View>

        {/* Skills */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Skills</Text>
          <View className="flex-row flex-wrap">
            {workerData.skills.map((skill, index) => (
              <View key={index} className="bg-blue-100 px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-blue-700 text-sm">{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Experience</Text>
          {workerData.experience.map((exp) => (
            <View key={exp.id} className="mb-4 last:mb-0">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                {exp.title}
              </Text>
              <Text className="text-gray-600 text-sm leading-5">
                {exp.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Address Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Address</Text>
          <View className="space-y-2">
            <Text className="text-base font-semibold text-gray-800">
              {workerData.address.name}
            </Text>
            <Text className="text-gray-600">{workerData.address.flat}</Text>
            <Text className="text-gray-600">{workerData.address.area}</Text>
            <Text className="text-gray-600">
              {workerData.address.city}, {workerData.address.state}
            </Text>
            <Text className="text-gray-600 mt-2">
              <Text className="font-medium">Mobile:</Text> {workerData.address.mobile}
            </Text>
            <Text className="text-gray-600">
              <Text className="font-medium">Email:</Text> {workerData.address.email}
            </Text>
          </View>
        </View>

        {/* Photos Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {workerData.photos.map((photo, index) => (
                <TouchableOpacity key={index} className="mr-3">
                  <Image
                    source={{ uri: photo }}
                    className="w-24 h-24 rounded-xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="flex-row mx-4 mt-4 mb-8 space-x-3">
          <TouchableOpacity
            className="flex-1 bg-green-500 py-4 rounded-xl"
            onPress={handleCall}
          >
            <Text className="text-white text-center font-semibold">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-500 py-4 rounded-xl"
            onPress={handleMessage}
          >
            <Text className="text-white text-center font-semibold">Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Hire Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={handleHire}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}