import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export interface Activity {
  date: string;
  name: string;
  type: string;
  distance: number;
  duration: number;
  elevation: number;
  startTime: number;
  avgHR?: number;
  maxHR?: number;
  calories?: number;
  trainingLoad?: number;
}

export interface HealthMetric {
  date: string;
  metric: string;
  value: number;
  unit: string;
}

function extractText(result: any): string {
  try {
    if (result?.content?.[0]?.text) return result.content[0].text;
  } catch {}
  return '';
}

export class FreddyClient {
  private client: Client;
  private accessToken: string;
  private connected: boolean = false;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = new Client(
      { name: "freddy-dashboard", version: "1.0.0" },
      {}
    );
  }

  async connect() {
    if (this.connected) return this;
    const transport = new StreamableHTTPClientTransport(
      new URL("https://freddy.coach/mcp"),
      { requestInit: { headers: { "Authorization": `Bearer ${this.accessToken}`, "Content-Type": "application/json" } } }
    );
    await this.client.connect(transport);
    this.connected = true;
    return this;
  }

  private parseActivities(text: string): Activity[] {
    if (!text) return [];
    const activities: Activity[] = [];
    const lines = text.split('\n');
    let currentDate = '';
    let currentActivity: Partial<Activity> = {};

    for (const line of lines) {
      const dateMatch = line.match(/^(\d{4}-\d{2}-\d{2}):/);
      if (dateMatch) {
        if (currentActivity.name && currentDate) {
          activities.push({ ...currentActivity, date: currentDate } as Activity);
        }
        currentDate = dateMatch[1];
        currentActivity = {};
        continue;
      }

      if (currentDate && line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const metricName = line.substring(0, colonIndex).trim();
        const restOfLine = line.substring(colonIndex + 1).trim();
        const valueMatch = restOfLine.match(/^(.+?)\s+\(Garmin/);
        if (valueMatch) {
          const value = valueMatch[1].trim();
          const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
          
          if (metricName.includes('activityName')) currentActivity.name = value;
          else if (metricName.includes('activityType')) currentActivity.type = value;
          else if (metricName.includes('distanceInMeters')) currentActivity.distance = numValue;
          else if (metricName.includes('durationInSeconds')) currentActivity.duration = numValue;
          else if (metricName.includes('totalElevationGainInMeters')) currentActivity.elevation = numValue;
          else if (metricName.includes('startTimeOffsetInSeconds')) currentActivity.startTime = numValue;
          else if (metricName.includes('averageHeartRateInBeatsPerMinute')) currentActivity.avgHR = numValue;
          else if (metricName.includes('maxHeartRateInBeatsPerMinute')) currentActivity.maxHR = numValue;
          else if (metricName.includes('activeKilocalories')) currentActivity.calories = numValue;
        }
      }
    }

    if (currentActivity.name && currentDate) {
      activities.push({ ...currentActivity, date: currentDate } as Activity);
    }
    return activities;
  }

  private parseHealthMetrics(text: string): HealthMetric[] {
    if (!text) return [];
    const metrics: HealthMetric[] = [];
    const lines = text.split('\n');
    let currentDate = '';

    for (const line of lines) {
      const dateMatch = line.match(/^(\d{4}-\d{2}-\d{2}):/);
      if (dateMatch) { currentDate = dateMatch[1]; continue; }

      if (currentDate && line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const metricName = line.substring(0, colonIndex).trim();
        const restOfLine = line.substring(colonIndex + 1).trim();
        const valueMatch = restOfLine.match(/^([\d.]+)\s+([^\s(]+)/);
        if (valueMatch) {
          metrics.push({ date: currentDate, metric: metricName, value: parseFloat(valueMatch[1]), unit: valueMatch[2] });
        }
      }
    }
    return metrics;
  }

  async getProfile(): Promise<string | null> {
    try {
      const result: any = await this.client.callTool({ name: "get_profile", arguments: {} });
      return extractText(result) || null;
    } catch { return null; }
  }

  async listAvailableMetrics(): Promise<string | null> {
    try {
      const result: any = await this.client.callTool({ name: "list_metrics", arguments: {} });
      return extractText(result) || null;
    } catch { return null; }
  }

  async getActivities(days: number = 30): Promise<Activity[]> {
    try {
      const result: any = await this.client.callTool({
        name: "query_metrics",
        arguments: {
          metrics: [
            "activity_activityName", "activity_activityType", "activity_distanceInMeters",
            "activity_durationInSeconds", "activity_totalElevationGainInMeters",
            "activity_startTimeOffsetInSeconds", "activity_averageHeartRateInBeatsPerMinute",
            "activity_maxHeartRateInBeatsPerMinute", "activity_activeKilocalories"
          ],
          start_date: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        },
      });
      return this.parseActivities(extractText(result));
    } catch { return []; }
  }

  async getAllHealthMetrics(days: number = 30): Promise<HealthMetric[]> {
    try {
      // Pedir métricas com nomes EXATOS da API
      const result: any = await this.client.callTool({
        name: "query_metrics",
        arguments: {
          metrics: [
            // FC - NOMES CORRETOS
            "daily_averageHeartRateInBeatsPerMinute",
            "daily_maxHeartRateInBeatsPerMinute",
            "daily_minHeartRateInBeatsPerMinute",
            // ACWR/Training Load - NOMES CORRETOS
            "acuteTrainingLoad_dailyAcuteChronicWorkloadRatio",
            "acuteTrainingLoad_dailyTrainingLoadAcute",
            "acuteTrainingLoad_dailyTrainingLoadChronic",
            // Stress - NOME CORRETO
            "daily_averageStressLevel",
            // Calorias e Passos - NOMES CORRETOS
            "daily_activeKilocalories",
            "daily_bmrKilocalories",
            "daily_steps",
            "daily_activeTimeInSeconds",
          ],
          start_date: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        },
      });
      const text = extractText(result);
      console.log("📥 Health metrics raw:", text.substring(0, 1000));
      return this.parseHealthMetrics(text);
    } catch (err) {
      console.error("❌ Error fetching health metrics:", err);
      return [];
    }
  }

  async disconnect() {
    if (this.connected) { await this.client.close(); this.connected = false; }
  }
}