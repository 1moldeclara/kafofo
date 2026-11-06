import { HealthResponseSchema, type HealthResponse } from '@kafofo/contracts';
import { Value } from 'typebox/value';

export async function getHealth(signal: AbortSignal): Promise<HealthResponse> {
  const response = await fetch('/api/health', { signal });
  if (!response.ok) throw new Error('Servidor indisponível.');
  const data: unknown = await response.json();
  if (!Value.Check(HealthResponseSchema, data)) throw new Error('Resposta inválida do servidor.');
  return data;
}
