const FREDDY_BASE_URL = "https://freddy.coach";
const FREDDY_MCP_URL = "https://freddy.coach/mcp";

interface OAuthConfig {
  client_id: string;
  client_secret?: string;
  redirect_uri: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

// 1. Dynamic Client Registration
export async function registerClient(redirectUri: string): Promise<OAuthConfig> {
  const response = await fetch(`${FREDDY_BASE_URL}/oauth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Freddy Coach Dashboard",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_basic",
      scope: "mcp account:read connections:read",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to register OAuth client");
  }

  return response.json();
}

// 2. Get Authorization URL
export function getAuthorizationUrl(
  clientId: string,
  redirectUri: string,
  state: string,
  codeVerifier: string
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "mcp account:read connections:read",
    state,
    code_challenge: codeVerifier, // PKCE
    code_challenge_method: "S256",
  });

  return `${FREDDY_BASE_URL}/oauth/authorize?${params.toString()}`;
}

// 3. Exchange Code for Token
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string | undefined,
  redirectUri: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientSecret) {
    headers["Authorization"] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  } else {
    body.append("client_id", clientId);
  }

  const response = await fetch(`${FREDDY_BASE_URL}/oauth/token`, {
    method: "POST",
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || "Token exchange failed");
  }

  return response.json();
}

// 4. Refresh Token
export async function refreshToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string | undefined
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientSecret) {
    headers["Authorization"] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  }

  const response = await fetch(`${FREDDY_BASE_URL}/oauth/token`, {
    method: "POST",
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}

export { FREDDY_BASE_URL, FREDDY_MCP_URL };