"use client";

import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useState } from "react";

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
  const [mounted, setMounted] = useState(false);
  const { user } = useClerk();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const roomID = getUrlParams().get("roomID") || randomID(5);

  const myMeeting = (element: HTMLDivElement) => {
    const initMeeting = async () => {
      const res = await fetch(`/api/zegocloud?userID=${user?.id}`);
      const { token, appID } = await res.json();

      const username = user?.fullName || user?.emailAddresses[0]?.emailAddress.split("@")[0];

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        roomID,
        user?.id || "",
        username,
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
          // To implement 1-on-1 calls, modify the parameter here to
          // [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    };
    initMeeting();
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
