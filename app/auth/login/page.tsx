"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const redirectUri = "http://localhost:3000/api/auth/callback";
      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(64);
      
      console.log("🔐 Starting OAuth Flow...");
      console.log("State:", state);
      console.log("Code Verifier:", codeVerifier);

      // 1. Dynamic Client Registration
      const regResponse = await fetch("https://freddy.coach/oauth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: "Freddy Coach Dashboard",
          redirect_uris: [redirectUri],
          grant_types: ["authorization_code", "refresh_token"],
          response_types: ["code"],
          token_endpoint_auth_method: "none",
          scope: "mcp account:read",
        }),
      });

      if (!regResponse.ok) {
        const err = await regResponse.json();
        throw new Error(`Registration failed: ${JSON.stringify(err)}`);
      }

      const client = await regResponse.json();
      console.log("✅ Client Registered:", client.client_id);

      // 2. Generate PKCE Challenge
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // 3. Store in Cookies
      document.cookie = `oauth_state=${state}; Path=/; Max-Age=600; SameSite=Lax; Secure`;
      document.cookie = `code_verifier=${codeVerifier}; Path=/; Max-Age=600; SameSite=Lax; Secure`;
      document.cookie = `client_id=${client.client_id}; Path=/; Max-Age=600; SameSite=Lax; Secure`;
      if (client.client_secret) {
        document.cookie = `client_secret=${client.client_secret}; Path=/; Max-Age=600; SameSite=Lax; Secure`;
      }

      // 4. Build Authorization URL
      const authUrl = new URL("https://freddy.coach/oauth/authorize");
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("client_id", client.client_id);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "mcp account:read");
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("code_challenge", codeChallenge);
      authUrl.searchParams.set("code_challenge_method", "S256");

      console.log("🔗 Redirecting to:", authUrl.toString());
      
      // 5. Redirect
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("❌ Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao conectar");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 p-8 card-neon">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">freddy</span>
            <span className="text-foreground">.coach</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Conecta os teus dados de corrida
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> A conectar...</span> : "Entrar com freddy.coach"}
        </button>

        <div className="text-center text-xs text-muted-foreground">
          OAuth 2.1 · PKCE · Dados seguros
        </div>
      </div>
    </div>
  );
}