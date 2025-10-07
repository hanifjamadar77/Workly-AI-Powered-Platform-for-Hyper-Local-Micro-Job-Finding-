import * as sdk from "node-appwrite";

interface ReqType {
  body: string;
}

interface ResType {
  json: (body: any, status?: number) => void;
}

interface LogType {
  (message: string): void;
}

interface ErrorType {
  (message: string): void;
}

export default async ({ req, res, log, error }: { req: ReqType; res: ResType; log: LogType; error: ErrorType }) => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const database = new sdk.Databases(client);

  const { email } = JSON.parse(req.body);

  if (!email) return res.json({ success: false, message: "Email required" }, 400);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  try {
    await database.createDocument(
      "68ca6b03002783a0f2e1",
      process.env.OTP_COLLECTION_ID,
      sdk.ID.unique(),
      { email, otp, expiresAt }
    );

    // Send OTP via Appwrite's built-in Email or an external service like Resend / Twilio
    await client.call("mail.send", {
      to: email,
      subject: "Your Workly OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, message: err.message });
  }
};
