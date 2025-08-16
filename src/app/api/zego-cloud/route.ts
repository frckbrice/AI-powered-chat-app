import { generateToken04 } from "../../../components/video-call/api/zegoc-cloud-assistant";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userID = url.searchParams.get("userID");

    if (!userID) {
      return Response.json({ error: "userID is required" }, { status: 400 });
    }

    // Use server-side environment variables (without NEXT_PUBLIC_ prefix)
    const appID = process.env.ZEGO_APP_ID || process.env.NEXT_PUBLIC_ZEGO_APP_ID;
    const serverSecret =
      process.env.ZEGO_SERVER_SECRET || process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

    // Debug logging
    // console.log("ZegoCloud API Debug:", {
    //   userID,
    //   appID: appID ? "present" : "missing",
    //   serverSecret: serverSecret ? "present" : "missing",
    //   envKeys: Object.keys(process.env).filter(key => key.includes('ZEGO')),
    //   allEnvVars: Object.keys(process.env).slice(0, 10) // Show first 10 env vars for debugging
    // });

    if (!appID || !serverSecret) {
      console.error("Missing ZegoCloud environment variables:", {
        appID: !!appID,
        serverSecret: !!serverSecret,
        availableEnvVars: Object.keys(process.env).filter((key) => key.includes("ZEGO")),
      });
      return Response.json(
        {
          error: "ZegoCloud configuration is missing. Check environment variables.",
          debug: {
            appID: !!appID,
            serverSecret: !!serverSecret,
            availableZegoVars: Object.keys(process.env).filter((key) => key.includes("ZEGO")),
          },
        },
        { status: 500 },
      );
    }

    const effectiveTimeInSeconds = 3600;
    const payload = "";

    const token = generateToken04(+appID, userID, serverSecret, effectiveTimeInSeconds, payload);

    return Response.json({ token, appID: +appID });
  } catch (error) {
    console.error("Error generating ZegoCloud token:", error);
    return Response.json(
      {
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
