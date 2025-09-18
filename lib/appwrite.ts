import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!, // e.g. https://cloud.appwrite.io/v1
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.workly.app",
  databaseId: "68ca6b03002783a0f2e1", // ✅ your database ID
  userCollectionId: "user", // ✅ match with your Table ID (from screenshot)
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

// 🔹 Create a new user (Appwrite Auth + DB)
export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    // Create account in Appwrite Auth
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    // Create session (login immediately)
    await signup({ email, password });

    // Avatar initials
    const avatarUrl = avatars.getInitialsURL(name);

    // Save user profile in DB (users collection)
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

    return newUserDoc;
  } catch (e: any) {
    console.error("❌ Error in createUser:", e);
    throw new Error(e?.message || "Unknown error while creating user");
  }
};

// 🔹 Login user
export const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (e: any) {
    console.error("❌ Signup error:", e);
    throw new Error(e?.message || "Signup failed");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw new Error("No user logged in");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [currentAccount.$id])],
    )

    if(!currentUser) throw Error;

    return currentUser.documents[0];
   
  } catch (e) {
    console.error(e);
    throw new Error(e as string);
  }
}
