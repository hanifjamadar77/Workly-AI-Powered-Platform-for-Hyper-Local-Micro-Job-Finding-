import { Account, Client, Databases, Avatars, ID } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.workly.app",
  databaseId: "68ca6b03002783a0f2e1",
  userCollectionId: "user",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

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
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    await signup({ email, password });

    const avatarUrl = avatars.getInitials(name);

    return await databases.createDocument(
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
  } catch (e) {
    throw new Error(e as string);
  }
};

export const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailPasswordSession({email, password});
  } catch (e) {
    throw new Error(e as string);
  }
};
