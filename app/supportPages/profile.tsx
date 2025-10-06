import ProfileMenuItem from "@/components/profileMenuItem";
import { images } from "@/constants";
import { appwriteConfig, databases, getCurrentUser, storage } from "@/lib/appwrite";
import { useNavigation } from "@react-navigation/native";
import { ID } from "appwrite";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

 const handleEditProfile = async () => {
  try {
    // Step 1: Request permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    // Step 2: Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const selectedImage = result.assets[0];
    const response = await fetch(selectedImage.uri);
    const blob = await response.blob();

    // Step 3: Upload to Appwrite storage
    // The SDK expects a File/Blob or stream depending on environment. In React Native
    // we pass the Blob returned by fetch.
    const fileObj = {
      name: `avatar-${Date.now()}.jpg`,
      type: blob.type || "image/jpeg",
      size: blob.size || 0,
      uri: selectedImage.uri,
    };

    const uploaded = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj,
      // Removed invalid permissions parameter
    );

    // Step 4: Get the public image URL
    // getFileView returns an object with .href; ensure uploaded has $id
    if (!uploaded || !uploaded.$id) {
      throw new Error("File upload failed: no file id returned");
    }

    // Attempt to get a usable URL from the SDK. Some SDKs return a string, others an object.
    let fileView: any = null;
    try {
      fileView = await storage.getFileView(appwriteConfig.bucketId, uploaded.$id);
    } catch (e) {
      // Some environments may not need await or may throw; continue to fallback below
      // keep the caught error for logging
      console.warn("getFileView threw, will try to construct URL fallback:", e);
    }

    let imageUrl = "";
    if (fileView) {
      if (typeof fileView === "string") imageUrl = fileView;
      else if (fileView.href) imageUrl = fileView.href;
    }

    // Fallback: construct direct download/view URL based on Appwrite REST path
    if (!imageUrl && uploaded && uploaded.$id) {
      // Normalize endpoint: remove trailing slash and any trailing '/v1' segment
      let endpoint = appwriteConfig.endpoint.replace(/\/$/, "");
      endpoint = endpoint.replace(/\/v1$/, "");
      imageUrl = `${endpoint}/v1/storage/buckets/${appwriteConfig.bucketId}/files/${uploaded.$id}/view?project=${appwriteConfig.projectId}`;
    }

    console.log("Uploaded file:", uploaded);
    console.log("Resolved imageUrl:", imageUrl);

    if (!imageUrl) {
      throw new Error("Failed to resolve uploaded file URL (no href returned and fallback failed)");
    }

    // Step 5: Update user's document avatar
    // databases.updateDocument requires a non-empty data object. Ensure we pass valid data.
    if (!user || !user.$id) {
      throw new Error("User document id is missing; cannot update avatar");
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("Resolved imageUrl is invalid");
    }

  const updatePayload = { avatar: imageUrl };
    console.log("Updating user document", {
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.userCollectionId,
      documentId: user.$id,
      updatePayload,
    });

    try {
      const updateResponse: any = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        updatePayload
      );
      console.log("Appwrite update response:", updateResponse);
    } catch (updateError: any) {
      console.error("Appwrite updateDocument error:", updateError);
      // If AppwriteException contains response or message, surface it
      const details = updateError?.message || JSON.stringify(updateError);
      throw new Error(`Appwrite update error: ${details}`);
    }

    // Step 6: Re-fetch user from DB to ensure database was updated and refresh UI
    try {
      const refreshedUser = await getCurrentUser();
      console.log("Refreshed user from DB:", refreshedUser);
      // Append a cache-busting query param to force Image component to reload the remote image
      const refreshedAvatar = refreshedUser?.avatar
        ? `${refreshedUser.avatar}${refreshedUser.avatar.includes('?') ? '&' : '?'}ts=${Date.now()}`
        : refreshedUser?.avatar;
      setUser({ ...refreshedUser, avatar: refreshedAvatar });
    } catch (refetchError) {
      console.warn("Failed to refetch user after avatar update, falling back to local state update:", refetchError);
      const busted = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}ts=${Date.now()}`;
      setUser((prev: any) => ({ ...prev, avatar: busted }));
    }

    alert("✅ Profile photo updated successfully!");
  } catch (error: any) {
    console.error("Error updating profile photo:", error);
    // Provide more useful feedback including SDK error messages
    alert(`Error updating profile photo: ${error?.message || JSON.stringify(error)}`);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header with Background Banner */}
        <View className="relative">
          <View className="flex-row items-center justify-between px-5 py-6 bg-transparent">
            <TouchableOpacity onPress={() => router.replace("/(seeker)")}>
              <Image
                source={images.arrowBack}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Content Overlay */}
          <View className="absolute -bottom-16 left-0 right-0 items-center">
            {/* Profile Avatar with Edit Button */}
            <View className="relative">
              <View className="w-28 h-28  rounded-full justify-center items-center border-4 border-white shadow-lg">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full justify-center items-center border-2 border-white"
                onPress={handleEditProfile}
              >
                <Text className="text-white text-sm">✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Name Section */}
        <View className="items-center mt-20 mb-4">
          <Text className="text-xl font-bold text-indigo-600">{user.name}</Text>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          <ProfileMenuItem
            icon="👤"
            title="Create your worker profile"
            screenName="profileScreens/yourProfile"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="👤"
            title="Posted Jobs"
            screenName="profileScreens/postedJobs"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="💳"
            title="Payment Method"
            screenName="profileScreens/payment"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="⚙️"
            title="Settings"
            screenName="profileScreens/settings"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="❓"
            title="Help Center"
            screenName="profileScreens/help"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="🛡️"
            title="Privacy Policy"
            screenName="profileScreens/policy"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="👥"
            title="Invites Friends"
            screenName="profileScreens/invite"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="🚪"
            title="Log Out"
            screenName="Logout"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
