import type { PatternLength } from "./pattern";
import type { EngineId } from "./engine-id";
import { getEngineMacroIds, type EngineMacroId } from "../macro/macro-targets";

export interface EngineCapabilities<E extends EngineId = EngineId> {
  readonly engineId: E;
  readonly supportedPatternLengths: readonly PatternLength[];
  readonly scaleRelevant: boolean;
  readonly macroIds: readonly EngineMacroId<E>[];
}

const CAPABILITY_VALUES: Readonly<{
  [E in EngineId]: {
    readonly supportedPatternLengths: readonly PatternLength[];
    readonly scaleRelevant: boolean;
  };
}> = Object.freeze({
  electronic: Object.freeze({
    supportedPatternLengths: Object.freeze([8, 16, 32] as const),
    scaleRelevant: true,
  }),
  body: Object.freeze({
    supportedPatternLengths: Object.freeze([16] as const),
    scaleRelevant: false,
  }),
  machine: Object.freeze({
    supportedPatternLengths: Object.freeze([16] as const),
    scaleRelevant: false,
  }),
});

export function getEngineCapabilities<E extends EngineId>(engineId: E): EngineCapabilities<E> {
  const capabilities = CAPABILITY_VALUES[engineId];

  return Object.freeze({
    engineId,
    supportedPatternLengths: Object.freeze([...capabilities.supportedPatternLengths]),
    scaleRelevant: capabilities.scaleRelevant,
    macroIds: getEngineMacroIds(engineId),
  });
}
