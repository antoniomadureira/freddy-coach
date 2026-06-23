import type { OAuthConfig } from "next-auth";

export interface MCPProfile {
  sub: string;
  email: string;
  name: string;
  garmin_connected: boolean;
}

export function MCPProvider<P extends MCPProfile>(
  options: OAuthConfig<P>
) {
  return {
    id: "mcp",
    name: "freddy.coach MCP",
    type: "oauth" as const,
    wellKnown: `${options.authorization?.url?.replace("/oauth/authorize", "") || options.authorization}/.well-known/oauth-authorization-server`,
    authorization: options.authorization,
    token: options.token,
    userinfo: options.userinfo,
    profile(profile: P) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
        garminConnected: profile.garmin_connected,
      };
    },
    options,
  };
}