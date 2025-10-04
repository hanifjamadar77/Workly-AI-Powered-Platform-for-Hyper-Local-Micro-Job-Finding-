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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { images } from "@/constants";

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

  const handleFormChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const handlePostJob = () => {
    const { title, description, category, houseNumber, street, city, state, pincode, pay, peopleNeeded } = form;

    if (
      !title ||
      !description ||
      !category ||
      !houseNumber ||
      !street ||
      !city ||
      !state ||
      !pincode ||
      !startDate ||
      !endDate ||
      !pay ||
      !peopleNeeded
    ) {
      alert("Please fill all fields");
      return;
    }
    if (pincode.length !== 6) {
      alert("Pincode must be 6 digits");
      return;
    }
    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    console.log({
      ...form,
      startDate,
      endDate,
    });
    alert("Job Posted Successfully ✅");
    router.back(); // go back to jobs page
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
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

          {/* Category
          <Text className="text-base font-semibold mb-2">Category</Text>         <TextInput
            value={form.category}
            onChangeText={(text) => handleFormChange("category", text)}
            placeholder="E.g. Babysitting, Plumber, Tutor"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          /> */}

          {/* House/Flat/Building No. */}
          <Text className="text-base font-semibold mb-2">House/Flat/Building No.</Text>
          <TextInput
            value={form.houseNumber}
            onChangeText={(text) => handleFormChange("houseNumber", text)}
            placeholder="Enter House/Flat/Building No."
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* Street/Address/Locality */}
          <Text className="text-base font-semibold mb-2">Street/Address/Locality</Text>
          <TextInput
            value={form.street}
            onChangeText={(text) => handleFormChange("street", text)}
            placeholder="Enter Street/Address/Locality"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* City/Town */}
          <Text className="text-base font-semibold mb-2">City/Town</Text>
          <TextInput
            value={form.city}
            onChangeText={(text) => handleFormChange("city", text)}
            placeholder="Enter City/Town"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* State */}
          <Text className="text-base font-semibold mb-2">State</Text>
          <TextInput
            value={form.state}
            onChangeText={(text) => handleFormChange("state", text)}
            placeholder="Enter state"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

          {/* Pincode */}
          <Text className="text-base font-semibold mb-2">Pincode</Text>
          <TextInput
            value={form.pincode}
            onChangeText={(text) => handleFormChange("pincode", text)}
            placeholder="Enter pincode"
            keyboardType="numeric"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
          />

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
              testID="dateTimePicker"
              value={startDate}
              mode={"date"}
              is24Hour={true}
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
              testID="dateTimePicker"
              value={endDate}
              mode={"date"}
              is24Hour={true}
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
            className="bg-blue-500 rounded-lg py-4 items-center mb-10"
          >
            <Text className="text-white font-bold text-lg">Post Job</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
