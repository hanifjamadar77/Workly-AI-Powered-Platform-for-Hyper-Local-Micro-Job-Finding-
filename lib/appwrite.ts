import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
  Storage,
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
    // Create account in Appwrite Auth
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    // Automatically log user in
    await signup({ email, password });

    // Create avatar
    const avatarUrl = avatars.getInitialsURL(name);

    // Create user document in DB
    const newUserDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        name,
        email,
        avatar: avatarUrl,
        createdAt: new Date().toISOString(),
      }
    );

    return newUserDoc;
  } catch (e: any) {
    console.error("❌ Error in createUser:", e);
    throw new Error(e?.message || "Unknown error while creating user");
  }
};

// 🔹 Login user
export const signup = async ({ email, password }: { email: string; password: string }) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (e : any) {
    console.error("❌ Signup error:", e);
    throw new Error(e?.message || "Signup failed");
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
export const getAllJobs = async () => {
  try {
    const jobs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.jobCollectionId,
      [Query.orderDesc("createdDate")] // Changed from createdAt
    );
    console.log("✅ Jobs fetched:", jobs.total);
    return jobs.documents;
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
        aadhar: profileData.aadhar || "",
        // city: profileData.city || "",
        // state: profileData.state || "",
        availability: profileData.availability || "Available",
        age: profileData.age || "",
        profilePhoto: profileData.profilePhoto || "",
        rating: 0,
        completedJobs: 0,
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

export const getWorkerProfileByUserId = async (userId: string) => {
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

