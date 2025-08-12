import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export const useMediaUpload = () => {
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const sendVideo = useMutation(api.messages.sendVideo);
  const me = useQuery(api.users.getMe);

  const uploadImage = async (image: File, conversationId: string) => {
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.status} ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      await sendImage({
        conversationId: conversationId as Id<"conversations">,
        imgId: storageId,
        sender: me!._id,
      });

      toast.success("Image sent successfully!");
      return true;
    } catch (err) {
      console.error("Image upload error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send image";
      toast.error(errorMessage);
      return false;
    }
  };

  const uploadVideo = async (video: File, conversationId: string) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": video.type },
        body: video,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.status} ${result.statusText}`);
      }

      const { storageId } = await result.json();

      await sendVideo({
        videoId: storageId,
        conversationId: conversationId as Id<"conversations">,
        sender: me!._id,
      });

      toast.success("Video sent successfully!");
      return true;
    } catch (error) {
      console.error("Video upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send video";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    uploadImage,
    uploadVideo,
    me,
    isLoading: !me,
  };
};
