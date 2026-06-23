/**
 * Serviço real de integração com freddy.coach MCP
 * Atualmente opera em modo 'Mock' enquanto a API não é provisionada.
 */

import { createMcpClient } from "../mcp/client";

export async function fetchRealData(userId: string) {
  // Em produção, descomentar isto:
  // const client = await createMcpClient(userId);
  // return client.callTool({ name: "get_athlete_summary", arguments: {} });

  // Fallback para mock por enquanto
  return null; 
}