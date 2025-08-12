import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
  }

  // Only allow Convex storage URLs for security
  if (!url.includes("convex.cloud/api/storage")) {
    return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
  }

  try {
    // Fetch the video from Convex storage
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VideoProxy/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch video" }, { status: response.status });
    }

    const videoBlob = await response.blob();

    // Return the video with proper CORS headers
    return new NextResponse(videoBlob, {
      status: 200,
      headers: {
        "Content-Type": videoBlob.type || "video/mp4",
        "Content-Length": videoBlob.size.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Video proxy error:", error);
    return NextResponse.json({ error: "Failed to proxy video" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    },
  });
}
