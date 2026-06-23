import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createRealMCPClient } from "@/lib/mcp/real-client";
import { authOptions } from "@/lib/auth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await createRealMCPClient({
      accessToken: session.accessToken,
    });

    const healthData = await client.getHealthMetrics();
    const hrvStatus = await client.getHRVStatus();
    const vo2max = await client.getVO2Max();

    return NextResponse.json({
      health: healthData,
      hrv: hrvStatus,
      vo2max: vo2max,
    });
  } catch (error) {
    console.error("Error fetching health data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
EOF

cat > app/api/mcp/activities/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createRealMCPClient } from "@/lib/mcp/real-client";
import { authOptions } from "@/lib/auth/options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const end = searchParams.get("end") || new Date().toISOString();

    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await createRealMCPClient({
      accessToken: session.accessToken,
    });

    const activities = await client.getActivities(start, end);
    const personalBests = await client.getPersonalBests();

    return NextResponse.json({
      activities,
      personalBests,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
EOF

cat > app/api/mcp/sleep/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createRealMCPClient } from "@/lib/mcp/real-client";
import { authOptions } from "@/lib/auth/options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await createRealMCPClient({
      accessToken: session.accessToken,
    });

    const sleepData = await client.getSleepData(date || undefined);

    return NextResponse.json(sleepData);
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
EOF

cat > app/api/mcp/coach/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createRealMCPClient } from "@/lib/mcp/real-client";
import { authOptions } from "@/lib/auth/options";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await createRealMCPClient({
      accessToken: session.accessToken,
    });

    const response = await client.chatWithCoach(message, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error communicating with coach:", error);
    return NextResponse.json({ error: "Failed to communicate with coach" }, { status: 500 });
  }
}