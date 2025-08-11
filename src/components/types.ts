import { Id } from "../../convex/_generated/dataModel";

export interface LastMessage {
  _id: string;
  messageType: "text" | "image" | "video";
  content: string;
  sender: string;
  _creationTime: number;
}

export interface ConversationType {
  _id: string;
  admin: string | null;
  groupImage: string | null;
  groupName: string | null;
  participants: string[];
  _creationTime: number;
  lastMessage?: LastMessage | null;
  sender: string;
  isOnline?: boolean;
  isGroup?: boolean;
}

export type Conversation = {
  _id: Id<"conversations">;
  image?: string;
  participants: Id<"users">[];
  isGroup: boolean;
  name?: string;
  groupImage?: string;
  groupName?: string;
  admin?: Id<"users">;
  isOnline?: boolean;
  lastMessage?: {
    _id: Id<"messages">;
    conversation: Id<"conversations">;
    content: string;
    sender: Id<"users">;
  };
};

export interface IMessage {
  _id: string;
  content: string;
  _creationTime: number;
  messageType: "text" | "image" | "video";
  sender: {
    _id: Id<"users">;
    image: string;
    name?: string;
    tokenIdentifier: string;
    email: string;
    _creationTime: number;
    isOnline: boolean;
  };
}

export interface IUser {
  _id: Id<"users">;
  name: string;
  image: string;
  email: string;
  tokenIdentifier: string;
  isOnline: boolean;
  _creationTime?: number;
}
