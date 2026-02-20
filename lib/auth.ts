import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";

const ADMIN_EMAILS = ["rjha5516@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select(
          "+passwordHash"
        );

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const isAdmin = ADMIN_EMAILS.includes(user.email!);
          await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image,
            provider: "google",
            role: isAdmin ? "admin" : "student",
          });
        } else if (ADMIN_EMAILS.includes(user.email!) && existingUser.role !== "admin") {
          existingUser.role = "admin";
          await existingUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email || user?.email });
        if (dbUser) {
          if (ADMIN_EMAILS.includes(dbUser.email) && dbUser.role !== "admin") {
            dbUser.role = "admin";
            await dbUser.save();
          }
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.branch = dbUser.branch;
          token.year = dbUser.year;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).branch = token.branch;
        (session.user as any).year = token.year;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
