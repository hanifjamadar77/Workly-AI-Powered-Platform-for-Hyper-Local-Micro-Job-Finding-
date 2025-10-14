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
import { createJob, getCurrentUser } from "@/lib/appwrite";
import { useTheme } from "@/lib/ThemeContext"; // ✅ Dark/Light theme

export default function PostJobScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme(); // ✅ get theme colors

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
    if (currentDate > endDate) setEndDate(currentDate);
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
      houseNumber,
      street,
      city,
      state,
      pincode,
      pay,
      peopleNeeded,
    } = form;

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
      const user = await getCurrentUser();
      if (!user) {
        alert("You must be logged in to post a job.");
        return;
      }

      await createJob({
        title,
        description,
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

      alert("✅ Job Posted Successfully!");
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

      router.push("/(seeker)/jobs");
    } catch (error: any) {
      console.error("❌ Error posting job:", error);
      alert(error?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const inputBg = isDarkMode ? "bg-gray-500" : "bg-gray-100";
  const inputText = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-white" : "border-gray-300";
  const labelColor = isDarkMode ? "text-white" : "text-gray-800";
  const headerBg = isDarkMode ? "bg-gray-500" : "bg-white";
  const headerText = isDarkMode ? "text-white" : "text-gray-800";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background}}>
      {/* Header */}
      <View className={`flex-row items-center justify-between px-5 py-4 ${headerBg} border-b ${borderColor}`}>
        <TouchableOpacity onPress={() => router.push("/(seeker)/jobs")}>
          <Image
            source={images.arrowBack}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${headerText}`}>Post a Job</Text>
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
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>Job Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(text) => handleFormChange("title", text)}
            placeholder="Enter job title"
            placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
            className={`rounded-lg px-4 py-3 mb-4 text-base ${inputBg} ${inputText} border ${borderColor}`}
          />

          {/* Job Description */}
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>Job Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(text) => handleFormChange("description", text)}
            placeholder="Enter job description"
            placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
            multiline
            numberOfLines={4}
            className={`rounded-lg px-4 py-3 mb-4 text-base ${inputBg} ${inputText} border ${borderColor}`}
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
              <Text className={`text-base font-semibold mb-2 ${labelColor}`}>{label}</Text>
              <TextInput
                value={(form as any)[field]}
                onChangeText={(text) => handleFormChange(field, text)}
                placeholder={`Enter ${label}`}
                placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
                keyboardType={keyboard as any || "default"}
                className={`rounded-lg px-4 py-3 mb-4 text-base ${inputBg} ${inputText} border ${borderColor}`}
              />
            </View>
          ))}

          {/* Start Date */}
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            className={`rounded-lg px-4 py-3 mb-4 border ${borderColor} ${inputBg}`}
          >
            <Text className={`${inputText}`}>{startDate.toLocaleDateString()}</Text>
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
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>End Date</Text>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            className={`rounded-lg px-4 py-3 mb-4 border ${borderColor} ${inputBg}`}
          >
            <Text className={`${inputText}`}>{endDate.toLocaleDateString()}</Text>
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
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>Pay</Text>
          <TextInput
            value={form.pay}
            onChangeText={(text) => handleFormChange("pay", text)}
            placeholder="Enter pay"
            placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
            keyboardType="numeric"
            className={`rounded-lg px-4 py-3 mb-6 text-base ${inputBg} ${inputText} border ${borderColor}`}
          />

          {/* People Needed */}
          <Text className={`text-base font-semibold mb-2 ${labelColor}`}>No. of People Needed</Text>
          <TextInput
            value={form.peopleNeeded}
            onChangeText={(text) => handleFormChange("peopleNeeded", text)}
            placeholder="Enter number of people"
            placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
            keyboardType="numeric"
            className={`rounded-lg px-4 py-3 mb-6 text-base ${inputBg} ${inputText} border ${borderColor}`}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handlePostJob}
            disabled={loading}
            className={`rounded-lg py-4 items-center mb-10 ${
              loading ? "bg-gray-400" : isDarkMode ? "bg-indigo-500" : "bg-blue-500"
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
