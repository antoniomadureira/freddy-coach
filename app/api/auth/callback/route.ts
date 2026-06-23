import { NextRequest, NextResponse } from "next/server";

function getCookie(name: string, cookieString: string): string | null {
  const match = cookieString.split(";").find(row => row.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    const errorDesc = searchParams.get("error_description");
    console.error("❌ OAuth Error:", error, errorDesc);
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url));
  }

  if (!code || !state) {
    console.error("❌ Missing code or state");
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  try {
    const cookieString = request.headers.get("cookie") || "";
    const storedState = getCookie("oauth_state", cookieString);
    const codeVerifier = getCookie("code_verifier", cookieString);
    const clientId = getCookie("client_id", cookieString);
    const clientSecret = getCookie("client_secret", cookieString);

    if (state !== storedState) {
      console.error("❌ State mismatch");
      return NextResponse.json({ error: "Invalid state" }, { status: 400 });
    }

    if (!clientId || !codeVerifier) {
      console.error("❌ Missing credentials");
      return NextResponse.json({ error: "Missing OAuth data" }, { status: 400 });
    }

    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    const tokenHeaders: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (clientSecret) {
      const credentials = btoa(`${clientId}:${clientSecret}`);
      tokenHeaders["Authorization"] = `Basic ${credentials}`;
    }

    console.log("🔄 Exchanging code for token...");
    
    const tokenResponse = await fetch("https://freddy.coach/oauth/token", {
      method: "POST",
      headers: tokenHeaders,
      body: tokenBody.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("❌ Token exchange failed:", errorData);
      throw new Error(errorData.error_description || "Token exchange failed");
    }

    const tokens = await tokenResponse.json();
    console.log("✅ Token received!");
    console.log("  Expires in:", tokens.expires_in);

    // Redirect to dashboard with tokens (MAX AGE = 7 dias)
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    const maxAge = tokens.expires_in || 3600; // 1 hora default
    
    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: false,  // Precisa ser false para o client ler
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    if (tokens.refresh_token) {
      response.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
      });
    }

    // Clean up temp cookies
    response.cookies.delete("oauth_state");
    response.cookies.delete("code_verifier");
    response.cookies.delete("client_id");
    response.cookies.delete("client_secret");

    return response;
  } catch (error) {
    console.error("❌ Callback error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=auth_failed", request.url));
  }
}