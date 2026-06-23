import type { NextConfig } from "next";
const config: NextConfig = {
  experimental: { authInterrupts: true },
  serverExternalPackages: ["@modelcontextprotocol/sdk"],
};
export default config;
