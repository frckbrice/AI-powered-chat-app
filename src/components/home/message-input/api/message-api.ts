import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";

export const useMessageAPI = () => {
  const me = useQuery(api.users.getMe);
  const sendTextMsg = useMutation(api.messages.sendTextMessage);

  const sendTextMessage = async (content: string, conversationId: Id<"conversations">) => {
    if (!me) {
      toast.error("User not authenticated");
      return false;
    }

    try {
      await sendTextMsg({
        content,
        conversationId,
        sender: me._id,
      });
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      toast.error(errorMessage);
      console.error(err);
      return false;
    }
  };

  return {
    sendTextMessage,
    me,
    isLoading: !me,
  };
};
