import NextAuth from "next-auth";
import { MCPProvider } from "@/lib/auth/mcp-provider";

const handler = NextAuth({
  providers: [
    MCPProvider({
      clientId: process.env.MCP_CLIENT_ID!,
      clientSecret: process.env.MCP_CLIENT_SECRET!,
      authorization: {
        url: `${process.env.MCP_ENDPOINT}/oauth/authorize`,
        params: {
          scope: "garmin.read activity.read health.read profile.read",
        },
      },
      token: `${process.env.MCP_ENDPOINT}/oauth/token`,
      userinfo: `${process.env.MCP_ENDPOINT}/userinfo`,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };