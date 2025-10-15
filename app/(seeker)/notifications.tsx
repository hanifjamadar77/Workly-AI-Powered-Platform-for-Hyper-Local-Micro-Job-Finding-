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
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
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
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.notificationsCollectionId,
        [
          Query.equal("recipientId", currentUserId),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ]
      );

      const parsed = await Promise.all(
        response.documents.map(async (doc: any) => {
          const jobStatus = doc.applicationId
            ? (
                await databases.getDocument(
                  appwriteConfig.databaseId,
                  appwriteConfig.applicationsCollectionId,
                  doc.applicationId
                )
              ).status
            : "PENDING";

          return {
            ...doc,
            jobDetails: safeParse(doc.jobDetails),
            workerDetails: safeParse(doc.workerDetails),
            status: jobStatus,
          };
        })
      );

      setNotifications(parsed);
    } catch (err: any) {
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
    action: "ACCEPTED" | "REJECTED"
  ) => {
    try {
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
          // status: action,
          applicationStatus: action,
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
    // 1️⃣ Check if applicationId exists
    if (!notification.applicationId)
      throw new Error("Missing application ID");

    // 2️⃣ Update application status permanently
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      notification.applicationId,
      { status: "ACCEPTED" }
    );

    // 3️⃣ Notify the worker
    if (notification.workerDetails?.id) {
      await sendResponseNotification(
        notification.workerDetails.id,
        notification.jobDetails?.title,
        "ACCEPTED"
      );
    }

    // 4️⃣ Notify the job requester (poster)
    const posterId = notification.jobDetails?.posterId;
    if (posterId) {
      await sendResponseNotification(
        posterId,
        notification.jobDetails?.title,
        "ACCEPTED"
      );
    }

    // 5️⃣ Update local notifications state for UI
    setNotifications((prev) =>
      prev.map((n) =>
        n.$id === notification.$id ? { ...n, status: "ACCEPTED" } : n
      )
    );

    // 6️⃣ Show success alert
    Alert.alert("✅ Success", "You have accepted this request.");
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

      // 1️⃣ Update the application status permanently
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        notification.applicationId,
        { status: "REJECTED" }
      );

      // 2️⃣ Send a notification to the worker
      await sendResponseNotification(
        notification.workerDetails?.id,
        notification.jobDetails?.title,
        "REJECTED"
      );

      // 3️⃣ Update local UI immediately
      setNotifications((prev) =>
        prev.map((n) =>
          n.$id === notification.$id
            ? { ...n, status: "REJECTED" } // optional for UI only
            : n
        )
      );

      // 4️⃣ Correct alert message
      Alert.alert("❌ Rejected", "You have rejected this request.");
    } catch (err: any) {
      console.error("Failed to reject notification:", err);
      Alert.alert("Error", "Failed to reject request: " + err.message);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    (async () => {
      const id = await loadUserId();
      if (id) await loadNotifications(id);
    })();
  }, []);

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
          //  console.log("Rendering notification:", item.$id, item.status, item.workerDetails, item.jobDetails);
          const colors = getStatusColors(item.status || "PENDING");
          const job = item.jobDetails || {};
          const worker = item.workerDetails || {};

          return (
            <View
              style={[
                styles.card,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
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
            </View>
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
  // actionButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
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
