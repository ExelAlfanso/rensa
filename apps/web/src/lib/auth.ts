import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { DefaultSession, DefaultUser } from "next-auth";
import jwt from "jsonwebtoken";
import { api } from "./axios-client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),

    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        if (!user.verified) {
          try {
            await api.post("/auth/send-verification", { email: user.email });
          } catch (err) {
            console.error("Failed to resend verification email:", err);
          }
          throw new Error(
            "Email not verified. We’ve sent a verification email to your email address."
          );
        }
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid email or password");
        }
        // console.log("✅ User authenticated:", user.email);
        const accessToken = jwt.sign(
          {
            id: user._id.toString(),
            email: user.email,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "7d" }
        );
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          accessToken,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // rotate token only once every 24 hours
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log("JWT callback:", { token });
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // if (process.env.NODE_ENV !== "production") {
        //   console.log("Session callback id:", {
        //     id: token.id,
        //     accessToken: token.accessToken,
        //   });
        // }
        session.user = {
          ...(session.user as Session["user"]),
          id: token.id as string,
          name: token.name,
          email: token.email,
          provider: token.provider as string | undefined,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/not-found",
  },
};
