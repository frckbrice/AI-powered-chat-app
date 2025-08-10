"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { ImageIcon, MessageSquareDiff } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

const UserListDialog = () => {
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [renderedImage, setRenderedImage] = useState("");

  const imgRef = useRef<HTMLInputElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const { isSignedIn, isLoaded } = useAuth();

  const me = useQuery(api.users.getMe, isLoaded && isSignedIn ? {} : "skip");
  const users = useQuery(api.users.getUsers, isLoaded && isSignedIn ? {} : "skip");

  const createConversation = useMutation(api.conversations.createConversation);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);

  console.log("me: ", me, "users: ", users);

  // const { setSelectedConversation } = useConversationStore();

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0 || !me?._id) return;
    setIsLoading(true);
    try {
      const isGroup = selectedUsers.length > 1;

      if (!isGroup) {
        await createConversation({
          participants: [...selectedUsers, me._id],
          isGroup: false,
        });
      } else {
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage?.type || "image/jpeg" },
          body: selectedImage,
        });

        const { storageId } = await result.json();

        await createConversation({
          participants: [...selectedUsers, me._id],
          isGroup: true,
          admin: me._id,
          groupName,
          groupImage: storageId,
        });
      }

      dialogCloseRef.current?.click();
      setSelectedUsers([]);
      setGroupName("");
      setSelectedImage(null);

      // TODO => Update a global state called "selectedConversation"
      // const conversationName = isGroup ? groupName : users?.find((user) => user._id === selectedUsers[0])?.name;

      // setSelectedConversation({
      // 	_id: conversationId,
      // 	participants: selectedUsers,
      // 	isGroup,
      // 	image: isGroup ? renderedImage : users?.find((user) => user._id === selectedUsers[0])?.image,
      // 	name: conversationName,
      // 	admin: me._id,
      // });
    } catch (err) {
      toast.error("Failed to create conversation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedImage) return setRenderedImage("");
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  return (
    <Dialog>
      <DialogTrigger>
        <MessageSquareDiff size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {/* DialogClose  will be here */}
          <DialogClose ref={dialogCloseRef} />
          <DialogTitle>USERS</DialogTitle>
        </DialogHeader>

        <DialogDescription>Start a new chat</DialogDescription>

        {!isLoaded ? (
          <div className="py-4 text-center">Checking authentication...</div>
        ) : !isSignedIn ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Please sign in to view users</p>
          </div>
        ) : me == null || (users && users.length === 0) ? (
          <div className="text-center py-4">
            <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading users...</p>
          </div>
        ) : (
          <>
            {renderedImage && (
              <div className="w-16 h-16 relative mx-auto">
                <Image
                  src={renderedImage}
                  fill
                  alt="user image"
                  className="rounded-full object-cover"
                />
              </div>
            )}
            {/*  input file */}
            <input
              type="file"
              accept="image/*"
              ref={imgRef}
              hidden
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            />
            {selectedUsers.length > 1 && (
              <>
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button className="flex gap-2" onClick={() => imgRef.current?.click()}>
                  <ImageIcon size={20} />
                  Group Image
                </Button>
              </>
            )}
            <div className="flex flex-col gap-3 overflow-auto max-h-64">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
									transition-all ease-in-out duration-300
								${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
                  onClick={() => {
                    if (selectedUsers.includes(user._id)) {
                      setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                    } else {
                      setSelectedUsers([...selectedUsers, user._id]);
                    }
                  }}
                >
                  <Avatar className="overflow-visible">
                    {user.isOnline && (
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground" />
                    )}

                    <AvatarImage src={user.image} className="rounded-full object-cover" />
                    <AvatarFallback>
                      <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full ">
                    <div className="flex items-center justify-between">
                      <p className="text-md font-medium">
                        {user.name || user.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant={"outline"}>Cancel</Button>
              <Button
                onClick={handleCreateConversation}
                disabled={
                  selectedUsers.length === 0 ||
                  (selectedUsers.length > 1 && !groupName) ||
                  isLoading
                }
              >
                {/* spinner */}
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default UserListDialog;
