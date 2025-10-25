import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  QueryTypesList,
  Storage
} from "react-native-appwrite";

// ⚙️ Appwrite Configuration
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.workly.app",
  databaseId: "68ca6b03002783a0f2e1", // ✅ your database ID
  userCollectionId: "user", // ✅ users collection ID
  jobCollectionId: "post", // ✅ jobs collection ID
  workerCollectionId: "profile", // ✅ workers collection ID

  notificationsCollectionId: "notifications",
  applicationsCollectionId : "applications",
  bucketId: "68e419d9000d5c34f15a", // ✅ your storage bucket ID
};

// 🔹 Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

// ======================================================================
// 🧍‍♂️ USER AUTHENTICATION FUNCTIONS
// ======================================================================

// 🔹 Create a new user (Appwrite Auth + DB)
export const createUser = async ({
  name,
  email,
  password,
}: { name: string; email: string; password: string }) => {
  try {
    // 1️⃣ Create Appwrite Auth account
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    // 2️⃣ Login to activate session
    await signIn({ email, password });

    // 3️⃣ Wait for session to become active
    await account.get();

    // 4️⃣ Create avatar
    const avatarUrl = avatars.getInitialsURL(name);

    // 5️⃣ Create user document
    const newUserDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        name,
        email,
        avatar: avatarUrl,
      }
    );

    console.log("✅ User created in DB:", newUserDoc.$id);
    return newUserDoc;
  } catch (e: any) {
    console.error("❌ Error in createUser:", e.message || e);
    throw new Error(e?.message || "Unknown error while creating user");
  }
};

// 🔹 Login user
// 🔹 SIGN IN (Login)
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    try {
      await account.deleteSession('current');
    } catch (error) {
      // No existing session
    }

    const session = await account.createEmailPasswordSession(email, password);
    console.log("✅ Login successful");
    return session;
  } catch (e: any) {
    console.error("❌ Login error:", e);
    throw new Error(e?.message || "Login failed");
  }
};


// 🔹 Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No user logged in");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [currentAccount.$id])]
    );

    if (!currentUser || currentUser.total === 0)
      throw new Error("User not found");

    return currentUser.documents[0];
  } catch (e : any) {
    console.error("❌ getCurrentUser error:", e);
    throw new Error(e?.message || "Failed to fetch user");
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession('current');
    console.log("✅ User logged out successfully");
    return true;
  } catch (error: any) {
    console.error("❌ Logout error:", error);
    throw new Error(error?.message || "Failed to logout");
  }
};

// ======================================================================
// 💼 JOB MANAGEMENT FUNCTIONS
// ======================================================================

// 🔹 Create (Post) a Job
export const createJob = async (jobData: any) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.jobCollectionId,
      ID.unique(),
      {
        title: jobData.title,
        description: jobData.description,
        // category: jobData.category || "",
        houseNumber: jobData.houseNumber,
        street: jobData.street,
        city: jobData.city,
        state: jobData.state,
        pincode: jobData.pincode,
        startDate: jobData.startDate,
        endDate: jobData.endDate,
        pay: jobData.pay,
        peopleNeeded: jobData.peopleNeeded,
        userId: jobData.userId,
        createdDate: new Date().toISOString(),
      }
    );
    console.log("✅ Job Created:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Error creating job:", error);
    throw new Error(error?.message || "Failed to create job");
  }
};

// Fetch All Jobs
// Fetch All Jobs with User Avatar
export const getAllJobs = async () => {
  try {
    // Step 1: Fetch all job posts
    const jobDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.jobCollectionId,
      [Query.orderDesc("createdDate")]
    );

    console.log("✅ Jobs fetched:", jobDocs.total);

    // Step 2: For each job, get the user info from users collection
    const jobsWithUser = await Promise.all(
      jobDocs.documents.map(async (job) => {
        let avatarUrl = null;
        let userName = "Unknown";

        try {
          if (job.userId) {
            // Fetch user document by accountId
            const userDocs = await databases.listDocuments(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              [Query.equal("accountId", job.userId)]
            );

            if (userDocs.documents.length > 0) {
              const user = userDocs.documents[0];
              userName = user.name || "Unknown";
              avatarUrl = user.avatar || null;
            }
          }
        } catch (err) {
          console.warn(`⚠️ Failed to fetch user for job: ${job.$id}`);
        }

        return { 
          ...job, 
          avatarUrl, 
          userName 
        };
      })
    );

    return jobsWithUser;
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs");
  }
};

// Fetch Jobs by User
export const getJobsByUser = async (userId: any) => {
  try {
    const jobs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.jobCollectionId,
      [Query.equal("userId", [userId]), Query.orderDesc("createdDate")] // Changed from createdAt
    );
    console.log("✅ User Jobs fetched:", jobs.total);
    return jobs.documents;
  } catch (error) {
    console.error("❌ Error fetching user jobs:", error);
    throw new Error("Failed to fetch user jobs");
  }
};

// ======================================================================
// 🗑️ DELETE JOB (and related applications + notifications)
// ======================================================================
export const deleteJobAndApplications = async (jobId: string) => {
  try {
    console.log("🧹 Starting full delete for job:", jobId);

    // 1️⃣ Delete all applications related to this job
    const applications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      [Query.equal("jobId", jobId)]
    );

    for (const app of applications.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        app.$id
      );
    }

    console.log(`🗑️ Deleted ${applications.total} applications for job ${jobId}`);

    // 2️⃣ Delete all notifications related to this job
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId, // ⚠️ Make sure this ID is set correctly in appwriteConfig
      [Query.equal("jobId", jobId)]
    );

    for (const notif of notifications.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.notificationsCollectionId,
        notif.$id
      );
    }

    console.log(`🗑️ Deleted ${notifications.total} notifications for job ${jobId}`);

    // 3️⃣ Delete the actual job post
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.jobCollectionId,
      jobId
    );

    console.log("✅ Job deleted successfully:", jobId);
    return true;
  } catch (error: any) {
    console.error("❌ Error deleting job completely:", error);
    throw new Error(error?.message || "Failed to delete job completely");
  }
};

// Export ID for external use
export { ID };


// ======================================================================
// 🧑‍🔧 WORKER PROFILE FUNCTIONS
// ======================================================================

// Add Worker Profile Functions
export const createWorkerProfile = async (profileData: any) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workerCollectionId,
      ID.unique(),
      {
        userId: profileData.userId,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        about: profileData.about || "",
        skills: profileData.skills || [],
        experience: profileData.experience || "",
        gender: profileData.gender || "",
        address: profileData.address || "",
        city: profileData.city || "", // ✅ NEW
        state: profileData.state || "", // ✅ NEW
        latitude: profileData.latitude || null, // ✅ NEW
        longitude: profileData.longitude || null, // ✅ NEW
        aadhar: profileData.aadhar || "",
        availability: profileData.availability || "Available",
        age: profileData.age || "",
        profilePhoto: profileData.profilePhoto || "",
        rating: 0,
        completedJobs: profileData.completedJobs || "0",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }
    );
    console.log("✅ Worker Profile Created:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Error creating worker profile:", error);
    throw new Error(error?.message || "Failed to create worker profile");
  }
};

export const updateWorkerProfile = async (profileId: string, profileData: any) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workerCollectionId,
      profileId,
      {
        ...profileData,
        updatedDate: new Date().toISOString(),
      }
    );
    console.log("✅ Worker Profile Updated:", response);
    return response;
  } catch (error: any) {
    console.error("❌ Error updating worker profile:", error);
    throw new Error(error?.message || "Failed to update worker profile");
  }
};

export const getWorkerProfileByUserId = async (userId: string | number | boolean | QueryTypesList) => {
  try {
    const profiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workerCollectionId,
      [Query.equal("userId", userId)]
    );
    return profiles.documents[0] || null;
  } catch (error: any) {
    console.error("❌ Error fetching worker profile:", error);
    throw new Error(error?.message || "Failed to fetch worker profile");
  }
};

export const getAllWorkerProfiles = async () => {
  try {
    const profiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.workerCollectionId,
      [Query.orderDesc("rating"), Query.limit(100)]
    );
    console.log("✅ Worker Profiles fetched:", profiles.total);
    return profiles.documents;
  } catch (error: any) {
    console.error("❌ Error fetching worker profiles:", error);
    throw new Error(error?.message || "Failed to fetch worker profiles");
  }
};




/**
 * Create an application record when worker applies for a job
 */
// export const createJobApplication = async (applicationData: {
//   jobId: string;
//   workerId: string;
//   posterId: string;
//   workerName: string;
//   workerEmail: string;
//   workerPhone?: string;
//   workerAvatar: string;
//   jobTitle: string;
//   jobPay: string;
//   jobCity: string;
//   jobStartDate: string;
// }) => {
//   try {
//     console.log("📝 Creating job application...");

//     const application = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.applicationsCollectionId,
//       ID.unique(),
//       {
//         ...applicationData,
//         status: "PENDING",
//         appliedAt: new Date().toISOString(),
//       }
//     );

//     console.log("✅ Application created:", application.$id);
//     return application;
//   } catch (error) {
//     console.error("❌ Error creating application:", error);
//     throw error;
//   }
// };


// ======================================================================
// 📋 APPLICATION MANAGEMENT FUNCTIONS
// ======================================================================

export const createJobApplication = async (applicationData: any) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      ID.unique(),
      {
        jobId: applicationData.jobId,
        workerId: applicationData.workerId,
        posterId: applicationData.posterId,
        workerName: applicationData.workerName,
        workerEmail: applicationData.workerEmail,
        workerPhone: applicationData.workerPhone || "",
        workerAvatar: applicationData.workerAvatar || "",
        jobTitle: applicationData.jobTitle,
        jobPay: applicationData.jobPay,
        jobCity: applicationData.jobCity,
        jobStartDate: applicationData.jobStartDate,
        status: "PENDING",
        appliedAt: new Date().toISOString(),
      }
    );
    console.log("✅ Application Created:", response.$id);
    return response;
  } catch (error: any) {
    console.error("❌ Error creating application:", error);
    throw new Error(error?.message || "Failed to create application");
  }
};

export const getApplicationsByWorker = async (workerId: string) => {
  try {
    const applications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      [Query.equal("workerId", workerId), Query.orderDesc("appliedAt")]
    );
    return applications.documents;
  } catch (error: any) {
    console.error("❌ Error fetching worker applications:", error);
    throw new Error(error?.message || "Failed to fetch applications");
  }
};

export const getApplicationsByJob = async (jobId: string) => {
  try {
    const applications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      [Query.equal("jobId", jobId), Query.orderDesc("appliedAt")]
    );
    return applications.documents;
  } catch (error: any) {
    console.error("❌ Error fetching job applications:", error);
    throw new Error(error?.message || "Failed to fetch applications");
  }
};

export const checkIfAlreadyApplied = async (jobId: string, workerId: string) => {
  try {
    const applications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      [Query.equal("jobId", jobId), Query.equal("workerId", workerId)]
    );
    return applications.total > 0;
  } catch (error: any) {
    console.error("❌ Error checking application status:", error);
    return false;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.applicationsCollectionId,
      applicationId,
      {
        status,
        ...(status === "ACCEPTED" && { acceptedAt: new Date().toISOString() }),
        ...(status === "REJECTED" && { rejectedAt: new Date().toISOString() }),
      }
    );
    console.log("✅ Application Status Updated:", status);
    return response;
  } catch (error: any) {
    console.error("❌ Error updating application:", error);
    throw new Error(error?.message || "Failed to update application");
  }
};

// ======================================================================
// 🔔 NOTIFICATION MANAGEMENT FUNCTIONS
// ======================================================================

// Helper: Convert objects safely to string
const stringifyData = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error("Error stringifying data:", e);
    return "";
  }
};

// Helper: Parse string back to object
export const parseNotificationData = (dataString: string): any => {
  try {
    return dataString ? JSON.parse(dataString) : {};
  } catch (e) {
    console.error("Error parsing notification data:", e);
    return {};
  }
};

export const createNotification = async (notificationData: any) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      ID.unique(),
      {
        recipientId: notificationData.recipientId,
        senderId: notificationData.senderId || "",
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        jobId: notificationData.jobId || "",
        applicationId: notificationData.applicationId || "",
        isRead: false,
        createdAt: new Date().toISOString(),
        jobDetails: stringifyData(notificationData.jobDetails || {}),
        workerDetails: stringifyData(notificationData.workerDetails || {}),
      }
    );
    console.log("✅ Notification Created:", response.$id);
    return response;
  } catch (error: any) {
    console.error("❌ Error creating notification:", error);
    throw new Error(error?.message || "Failed to create notification");
  }
};

export const getNotifications = async (userId: string | number | boolean | any[]) => {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.notificationsCollectionId,
    [
      Query.equal("recipientId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]
  );
  return res.documents;
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      notificationId,
      { isRead: true }
    );
    console.log("✅ Notification marked as read");
  } catch (error: any) {
    console.error("❌ Error marking notification as read:", error);
    throw new Error(error?.message || "Failed to mark notification as read");
  }
};

export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const unread = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      [Query.equal("recipientId", userId), Query.equal("isRead", false)]
    );
    return unread.total;
  } catch (error: any) {
    console.error("❌ Error fetching unread count:", error);
    return 0;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      notificationId
    );
    console.log("✅ Notification deleted");
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    throw new Error(error?.message || "Failed to delete notification");
  }
};

export const updateNotificationStatus = async (
  notificationId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  try {
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      notificationId,
      {
        status: status,
        $updatedAt: new Date().toISOString(),
      }
    );
    console.log("Notification updated:", updated);
    return updated;
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};

// ======================================================================
// ✅ ACCEPT & REJECT APPLICATION HELPERS + AUTO NOTIFICATIONS
// ======================================================================

export const acceptApplication = async (application: any, workerDetails: any, jobDetails: any) => {
  try {
    const updated = await updateApplicationStatus(application.$id, "ACCEPTED");

    // Send notification to worker
    await createNotification({
      recipientId: application.workerId,
      senderId: application.posterId,
      type: "APPLICATION_ACCEPTED",
      title: "🎉 Application Accepted",
      message: `Your application for "${application.jobTitle}" has been accepted!`,
      jobId: application.jobId,
      applicationId: application.$id,
      jobDetails: {
        title: application.jobTitle,
        pay: application.jobPay,
        city: application.jobCity,
      },
      workerDetails: {
        id: application.workerId,
        name: application.workerName,
        email: application.workerEmail,
        avatar: application.workerAvatar,
      },
    });

    return updated;
  } catch (error: any) {
    console.error("❌ Error accepting application:", error);
    throw new Error(error?.message || "Failed to accept application");
  }
};

export const rejectApplication = async (application: any, workerDetails: any, jobDetails: any) => {
  try {
    const updated = await updateApplicationStatus(application.$id, "REJECTED");

    // Send notification to worker
    await createNotification({
      recipientId: application.workerId,
      senderId: application.posterId,
      type: "APPLICATION_REJECTED",
      title: "❌ Application Rejected",
      message: `Your application for "${application.jobTitle}" has been rejected.`,
      jobId: application.jobId,
      applicationId: application.$id,
      jobDetails: {
        title: application.jobTitle,
        pay: application.jobPay,
        city: application.jobCity,
      },
      workerDetails: {
        id: application.workerId,
        name: application.workerName,
        email: application.workerEmail,
        avatar: application.workerAvatar,
      },
    });

    return updated;
  } catch (error: any) {
    console.error("❌ Error rejecting application:", error);
    throw new Error(error?.message || "Failed to reject application");
  }
};
