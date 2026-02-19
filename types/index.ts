import { IUser } from "@/models/User";
import { IListing } from "@/models/Listing";
import { IBooking } from "@/models/Booking";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  branch?: string;
  year?: number;
};

export type ListingWithOwner = IListing & {
  owner: Pick<IUser, "name" | "avatar" | "_id">;
};

export type BookingWithDetails = IBooking & {
  listing: IListing;
  borrower: Pick<IUser, "name" | "avatar" | "_id">;
  lender: Pick<IUser, "name" | "avatar" | "_id">;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
};

export type ChatRoom = {
  id: string;
  participants: Record<string, boolean>;
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageTime?: number;
};

export const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Software Engineering",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Production & Industrial",
  "Environmental Engineering",
  "Biotechnology",
  "Engineering Physics",
  "Mathematics & Computing",
] as const;

export const CAMPUS_LOCATIONS = [
  "Boys Hostel",
  "Girls Hostel",
  "Library",
  "Main Building",
  "Mechanical Block",
  "CSE Block",
  "ECE Block",
  "OAT",
  "Canteen",
  "Sports Complex",
  "Gate No. 1",
  "Gate No. 2",
] as const;

export const CATEGORIES = [
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "sports", label: "Sports Equipment" },
  { value: "clothing", label: "Clothing" },
  { value: "other", label: "Other" },
] as const;

export const RESOURCE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "pyq", label: "Previous Year Questions" },
  { value: "assignment", label: "Assignments" },
  { value: "book", label: "E-Books" },
  { value: "other", label: "Other" },
] as const;
