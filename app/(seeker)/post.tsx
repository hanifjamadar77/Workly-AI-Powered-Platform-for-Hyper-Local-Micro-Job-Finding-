import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { images } from "@/constants";
import { createJob, getCurrentUser } from "@/lib/appwrite"; // ✅ Appwrite helpers

export default function PostJobScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    pay: "",
    peopleNeeded: "",
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

const handlePostJob = async () => {
  const {
    title,
    description,
    category,
    houseNumber,
    street,
    city,
    state,
    pincode,
    pay,
    peopleNeeded,
  } = form;

  // Validation
  if (
    !title ||
    !description ||
    !houseNumber ||
    !street ||
    !city ||
    !state ||
    !pincode ||
    !pay ||
    !peopleNeeded
  ) {
    alert("⚠️ Please fill all fields");
    return;
  }

  if (pincode.length !== 6) {
    alert("⚠️ Pincode must be 6 digits");
    return;
  }

  try {
    setLoading(true);

    // Get logged-in user
    const user = await getCurrentUser();
    if (!user) {
      alert("You must be logged in to post a job.");
      return;
    }

    // Create new job in Appwrite
    const response = await createJob({
      title,
      description,
      // category: category || "General",
      houseNumber,
      street,
      city,
      state,
      pincode,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      pay,
      peopleNeeded,
      userId: user.accountId,
      createdDate: new Date().toISOString(), 
    });

    console.log("✅ Job Created:", response);
    alert("✅ Job Posted Successfully!");
    
    // Clear form
    setForm({
      title: "",
      description: "",
      category: "",
      houseNumber: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      pay: "",
      peopleNeeded: "",
    });
    
    // Navigate after successful creation
    router.push("/(seeker)/jobs");

  } catch (error: any) {
    console.error("❌ Error posting job:", error);
    alert(error?.message || "Failed to post job");
  } finally {
    setLoading(false);
  }
};
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push("/(seeker)/jobs")}>
          <Image
            source={images.arrowBack}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Post a Job</Text>
        <View className="w-6 h-6" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-5 py-6"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
        >
          {/* Job Title */}
          <Text className="text-base font-semibold mb-2">Job Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(text) => handleFormChange("title", text)}
            placeholder="Enter job title"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* Job Description */}
          <Text className="text-base font-semibold mb-2">Job Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(text) => handleFormChange("description", text)}
            placeholder="Enter job description"
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* Address Fields */}
          {[
            { label: "House/Flat/Building No.", field: "houseNumber" },
            { label: "Street/Address/Locality", field: "street" },
            { label: "City/Town", field: "city" },
            { label: "State", field: "state" },
            { label: "Pincode", field: "pincode", keyboard: "numeric" },
          ].map(({ label, field, keyboard }, i) => (
            <View key={i}>
              <Text className="text-base font-semibold mb-2">{label}</Text>
              <TextInput
                value={(form as any)[field]}
                onChangeText={(text) => handleFormChange(field, text)}
                placeholder={`Enter ${label}`}
                keyboardType={keyboard as any || "default"}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              />
            </View>
          ))}

          {/* Start Date */}
          <Text className="text-base font-semibold mb-2">Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          >
            <Text className="text-base">{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}

          {/* End Date */}
          <Text className="text-base font-semibold mb-2">End Date</Text>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          >
            <Text className="text-base">{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={startDate}
            />
          )}

          {/* Pay */}
          <Text className="text-base font-semibold mb-2">Pay</Text>
          <TextInput
            value={form.pay}
            onChangeText={(text) => handleFormChange("pay", text)}
            placeholder="Enter pay"
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
          />

          {/* No. of People Needed */}
          <Text className="text-base font-semibold mb-2">
            No. of People Needed
          </Text>
          <TextInput
            value={form.peopleNeeded}
            onChangeText={(text) => handleFormChange("peopleNeeded", text)}
            placeholder="Enter number of people"
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handlePostJob}
            disabled={loading}
            className={`rounded-lg py-4 items-center mb-10 ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Post Job</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
