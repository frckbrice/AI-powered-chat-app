"use client";

import dynamic from "next/dynamic";

const VideoUIKit = dynamic(() => import("@/components/video-call/components/video-ui-kit"), {
  ssr: false,
});

export default function VideoCall() {
  return <VideoUIKit />;
}
