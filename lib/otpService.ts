import { appwriteConfig } from "./appwrite";

const FUNCTION_URL = "https://cloud.appwrite.io/v1/functions/send-otp/executions";

export const sendOtpToUser = async (email) => {
  try {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": appwriteConfig.projectId,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch(`${FUNCTION_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": appwriteConfig.projectId,
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
