export const ENGINE_IDS = ["electronic", "body", "machine"] as const;

export type EngineId = (typeof ENGINE_IDS)[number];

export function isEngineId(value: string): value is EngineId {
  return ENGINE_IDS.some((engineId) => engineId === value);
}
