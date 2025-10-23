import { account, appwriteConfig, databases } from "@/lib/appwrite";
import { useIsFocused } from "@react-navigation/native";
import { ID, Query } from "appwrite";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NotificationData {
  applicationId: any;
  $id: string;
  $createdAt: string;
  recipientId: string;
  senderId: string;
  message?: string;
  title?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  type?: string;
  jobDetails?: string | any;
  workerDetails?: string | any;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filter, setFilter] = useState
   < "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const isFocused = useIsFocused();

  // ✅ Get logged-in user
  const loadUserId = useCallback(async () => {
    try {
      const session = await account.get();
      setUserId(session.$id);
      return session.$id;
    } catch (err) {
      setError("Not authenticated. Please log in.");
      return null;
    }
  }, []);

  // ✅ Safely parse stringified JSON
  const safeParse = (data: any) => {
    if (!data) return null;
    if (typeof data === "object") return data;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  // ✅ Load notifications for this user
  const loadNotifications = useCallback(async (currentUserId: string) => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      console.log("📥 Fetching notifications for user:", currentUserId);

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.notificationsCollectionId,
        [
          Query.equal("recipientId", currentUserId),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ]
      );

      console.log("✅ Fetched notifications count:", response.documents.length);

      const parsed = await Promise.all(
        response.documents.map(async (doc: any) => {
          let jobStatus = "PENDING";
          let workerProfileId = null;

          // ✅ Only fetch application status if applicationId exists
          if (doc.applicationId) {
            try {
              const application = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.applicationsCollectionId,
                doc.applicationId
              );
              jobStatus = application.status;

              // ✅ Get worker profile ID from application
              if (application.workerId) {
                try {
                  const workerProfiles = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.workerCollectionId,
                    [Query.equal("userId", application.workerId), Query.limit(1)]
                  );

                  if (workerProfiles.documents.length > 0) {
                    workerProfileId = workerProfiles.documents[0].$id;
                    console.log("✅ Found worker profile:", workerProfileId);
                  }
                } catch (profileErr) {
                  console.warn("⚠️ Could not fetch worker profile:", profileErr);
                }
              }
            } catch (err) {
              console.warn("⚠️ Could not fetch application status:", err);
            }
          }

          const parsedWorkerDetails = safeParse(doc.workerDetails);

          return {
            ...doc,
            jobDetails: safeParse(doc.jobDetails),
            workerDetails: parsedWorkerDetails
              ? {
                  ...parsedWorkerDetails,
                  profileId: workerProfileId || parsedWorkerDetails.profileId,
                }
              : null,
            status: jobStatus,
          };
        })
      );

      console.log("✅ Parsed notifications:", parsed.length);
      setNotifications(parsed);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to load notifications:", err);
      setError("Failed to load notifications: " + err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ✅ Send notification to worker when job poster accepts/rejects
  const sendResponseNotification = async (
    workerId: string,
    jobTitle: string,
    action: "ACCEPTED" | "REJECTED",
    workerDetails?: any,
    jobDetails?: any
  ) => {
    try {
      // ✅ Fetch worker profile to get the actual profile document ID
      const workerProfile = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.workerCollectionId,
        [Query.equal("userId", workerId), Query.limit(1)]
      );

      const profileId = workerProfile.documents[0]?.$id || workerId;

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.notificationsCollectionId,
        ID.unique(),
        {
          recipientId: workerId,
          senderId: userId,
          title: `Your application for ${jobTitle} was ${action.toLowerCase()}`,
          message:
            action === "ACCEPTED"
              ? "🎉 Congratulations! Your job request was accepted."
              : "❌ Unfortunately, your job request was rejected.",
          type: "RESPONSE",
          workerDetails: JSON.stringify({
            ...workerDetails,
            profileId: profileId,
          }),
          jobDetails: jobDetails ? JSON.stringify(jobDetails) : null,
          createdAt: new Date().toISOString(),
        }
      );
      console.log("✅ Worker notified successfully");
    } catch (err) {
      console.error("❌ Failed to notify worker:", err);
    }
  };

  // ✅ Handle Accept
  const handleAccept = async (notification: NotificationData) => {
    try {
      if (!notification.applicationId)
        throw new Error("Missing application ID");

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        notification.applicationId,
        { status: "ACCEPTED" }
      );

      if (notification.workerDetails?.id) {
        await sendResponseNotification(
          notification.workerDetails.id,
          notification.jobDetails?.title || "Job",
          "ACCEPTED",
          notification.workerDetails,
          notification.jobDetails
        );
      }

      // ✅ Reload notifications to get updated profile IDs
      if (userId) {
        await loadNotifications(userId);
      }

      Alert.alert(
        "✅ Success",
        "You have accepted this request. Tap the notification to view worker profile."
      );
    } catch (err: any) {
      console.error("Failed to accept request:", err);
      Alert.alert("Error", "Failed to accept request: " + err.message);
    }
  };

  // ✅ Handle Reject
  const handleReject = async (notification: NotificationData) => {
    try {
      if (!notification.applicationId)
        throw new Error("Missing application ID");

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        notification.applicationId,
        { status: "REJECTED" }
      );

      if (notification.workerDetails?.id) {
        await sendResponseNotification(
          notification.workerDetails.id,
          notification.jobDetails?.title || "Job",
          "REJECTED",
          notification.workerDetails,
          notification.jobDetails
        );
      }

      // ✅ Reload notifications
      if (userId) {
        await loadNotifications(userId);
      }

      Alert.alert("❌ Rejected", "You have rejected this request.");
    } catch (err: any) {
      console.error("Failed to reject notification:", err);
      Alert.alert("Error", "Failed to reject request: " + err.message);
    }
  };

  // ✅ Handle notification card click - Navigate to worker profile
const handleNotificationPress = async (notification: NotificationData) => {
  console.log("🔍 Notification clicked:", notification);

  // ✅ Step 1: Allow only ACCEPTED notifications
  if (notification.status !== "ACCEPTED") {
    Alert.alert(
      "Request Pending",
      notification.status === "REJECTED"
        ? "This worker’s request was rejected."
        : "You can view the worker profile only after accepting the request."
    );
    return;
  }

  const worker = notification.workerDetails;
  if (!worker) {
    Alert.alert("⚠️ Error", "Worker details missing in this notification.");
    return;
  }

  try {
    let workerProfile = null;

    console.log("🔎 Searching for worker by userId:", worker.id);

    // ✅ Step 2: Search by userId (most accurate)
    const byUserId = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workerCollectionId,
      [Query.equal("userId", worker.id)]
    );

    if (byUserId.total > 0) {
      workerProfile = byUserId.documents[0];
      console.log("✅ Worker found by userId:", workerProfile.$id);
    } else {
      // ✅ Step 3: Fallback search by name (in case userId not stored)
      console.log("🔎 No match by userId, searching by name:", worker.name);

      const byName = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.workerCollectionId,
        [Query.equal("fullName", worker.name)]
      );

      if (byName.total > 0) {
        workerProfile = byName.documents[0];
        console.log("✅ Worker found by name:", workerProfile.$id);
      }
    }

    // ✅ Step 4: If no match, show alert
    if (!workerProfile) {
      Alert.alert(
        "Profile Not Found",
        "This worker hasn’t created their profile yet."
      );
      return;
    }

    // ✅ Step 5: Navigate to the worker profile screen
    router.push({
      pathname: "./supportPages/WorkerProfile",
      params: { profileId: workerProfile.$id },
    });
  } catch (error) {
    console.error("❌ Error fetching worker profile:", error);
    Alert.alert("Error", "Something went wrong while fetching worker profile.");
  }
};


  // ✅ Initial load
  useEffect(() => {
    (async () => {
      const id = await loadUserId();
      if (id) await loadNotifications(id);
    })();
  }, [loadUserId, loadNotifications]);

  // ✅ Refresh on focus
  useEffect(() => {
    if (isFocused && userId) {
      loadNotifications(userId);
    }
  }, [isFocused, userId, loadNotifications]);

  const onRefresh = useCallback(() => {
    if (userId) {
      setRefreshing(true);
      loadNotifications(userId);
    }
  }, [userId, loadNotifications]);

  // ✅ Filter notifications
  const filtered = notifications.filter((n) =>
    filter === "ALL" ? true : n.status === filter
  );

  const getStatusColors = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { border: "#10B981", bg: "#ECFDF5", text: "#059669" };
      case "REJECTED":
        return { border: "#EF4444", bg: "#FEF2F2", text: "#DC2626" };
      default:
        return { border: "#F59E0B", bg: "#FFFBEB", text: "#D97706" };
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#5B7FFF" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => userId && loadNotifications(userId)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Filter Buttons */}
      <View style={styles.filterContainer}>
        {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(status as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Notification List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const colors = getStatusColors(item.status || "PENDING");
          const job = item.jobDetails || {};
          const worker = item.workerDetails || {};
          const isAccepted = item.status === "ACCEPTED";

          return (
            <TouchableOpacity
              style={[
                styles.card,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={isAccepted ? 0.7 : 1}
            >
              <Text style={styles.workerName}>
                👷 {worker.name || "Unknown Worker"}
              </Text>
              <Text style={styles.jobTitle}>
                💼 {job.title || "Untitled Job"}
              </Text>
              <Text style={styles.jobPay}>💰 ₹{job.pay || "N/A"}</Text>
              <Text style={styles.jobCity}>📍 {job.city || "Unknown"}</Text>

              <Text style={[styles.status, { color: colors.text }]}>
                Status: {item.status || "PENDING"}
              </Text>

              <Text style={styles.message}>{item.message}</Text>

              {/* ✅ Show tap hint for accepted notifications */}
              {isAccepted && (
                <Text style={styles.tapHint}>
                  👆 Tap to view worker profile & contact
                </Text>
              )}

              {(item.status || "PENDING") === "PENDING" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.btn, styles.acceptBtn]}
                    onPress={() => handleAccept(item)}
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleReject(item)}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {filter.toLowerCase()} notifications
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 30,
    paddingTop: 30,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#6B7280", fontWeight: "500" },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#5B7FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterButtonActive: { backgroundColor: "#5B7FFF" },
  filterText: { color: "#6B7280", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  card: { borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 10 },
  workerName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
    marginBottom: 4,
  },
  jobTitle: { fontSize: 13, color: "#374151", marginBottom: 4 },
  jobPay: { fontSize: 13, color: "#374151", marginBottom: 4 },
  jobCity: { fontSize: 13, color: "#374151", marginBottom: 8 },
  status: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  message: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 4,
  },
  tapHint: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    paddingVertical: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
  },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  actionButtons: { flexDirection: "row", marginTop: 10 },
  acceptBtn: {
    backgroundColor: "#10B981",
    width: "48%",
    height: 40,
    marginRight: "4%",
  },
  rejectBtn: { backgroundColor: "#EF4444", width: "48%", height: 40 },
  btnText: { color: "#fff", fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#9CA3AF", fontWeight: "500" },
});

export default NotificationsScreen;