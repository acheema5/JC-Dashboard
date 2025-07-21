// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultUser } from "next-auth";

const authOptions = {  // Remove 'export' here
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: DefaultUser }) {
      const allowedEmails = [
        "cheemarjun@gmail.com",
        "team@ascflow.com",
        "sfba.jeremy@gmail.com",
        "charliepriceco23@gmail.com",
        "sohandandu@gmail.com",
      ];
      return allowedEmails.includes(user?.email || "");
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };