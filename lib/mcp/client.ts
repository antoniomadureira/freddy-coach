import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class MCPRealClient {
  private client: Client;
  private tokens: AuthTokens | null = null;
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.client = new Client(
      { name: "freddy-dashboard", version: "1.0.0" },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );
  }

  async connect(tokens: AuthTokens) {
    this.tokens = tokens;

    const transport = new StreamableHTTPClientTransport(
      new URL(this.endpoint),
      {
        requestInit: {
          headers: {
            "Authorization": `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      }
    );

    await this.client.connect(transport);
    return this;
  }

  // Métricas de Saúde
  async getHealthMetrics(date?: string) {
    const result = await this.client.callTool({
      name: "garmin.health.get_daily",
      arguments: { date: date || new Date().toISOString().split("T")[0] },
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // Atividades
  async getActivities(start: string, end: string) {
    const result = await this.client.callTool({
      name: "garmin.activities.list",
      arguments: { start, end },
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : [];
  }

  // Personal Bests
  async getPersonalBests() {
    const result = await this.client.callTool({
      name: "garmin.activities.personal_bests",
      arguments: {},
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : [];
  }

  // Training Readiness
  async getTrainingReadiness() {
    const result = await this.client.callTool({
      name: "garmin.training.readiness",
      arguments: {},
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // HRV Status
  async getHRVStatus() {
    const result = await this.client.callTool({
      name: "garmin.hrv.get_status",
      arguments: {},
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // Sleep Data
  async getSleepData(date?: string) {
    const result = await this.client.callTool({
      name: "garmin.sleep.get_daily",
      arguments: { date: date || new Date().toISOString().split("T")[0] },
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // Steps/NEAT
  async getStepsData(date?: string) {
    const result = await this.client.callTool({
      name: "garmin.steps.get_daily",
      arguments: { date: date || new Date().toISOString().split("T")[0] },
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // VO2 Max
  async getVO2Max() {
    const result = await this.client.callTool({
      name: "garmin.vo2max.get",
      arguments: {},
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  // AI Coach Chat
  async chatWithCoach(message: string, context?: any) {
    const result = await this.client.callTool({
      name: "ai.coach.chat",
      arguments: { 
        message,
        context: context || {},
        stream: false,
      },
    });
    return result.content[0].text ? JSON.parse(result.content[0].text) : null;
  }

  async disconnect() {
    await this.client.close();
  }
}

// Factory function
export async function createRealMCPClient(tokens: AuthTokens) {
  const client = new MCPRealClient(process.env.MCP_ENDPOINT!);
  await client.connect(tokens);
  return client;
}