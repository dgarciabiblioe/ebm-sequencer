import type { EngineId } from "../model/engine-id";
import type { MacroValue } from "./macro-value";
import { isMacroValue } from "./macro-value";

export type ElectronicMacroId =
  | "density"
  | "repeat"
  | "sync"
  | "variation"
  | "octave"
  | "tension";

export type BodyMacroId = ElectronicMacroId;

export type MachineMacroId =
  | "density"
  | "repeat"
  | "phase"
  | "anchor"
  | "gap"
  | "variation";

export interface MacroIdByEngine {
  readonly electronic: ElectronicMacroId;
  readonly body: BodyMacroId;
  readonly machine: MachineMacroId;
}

export type EngineMacroId<E extends EngineId> = MacroIdByEngine[E];

export type MacroTargets<E extends EngineId> = Readonly<{
  [MacroId in EngineMacroId<E>]: MacroValue;
}>;

const ENGINE_MACRO_IDS: Readonly<{
  [E in EngineId]: readonly EngineMacroId<E>[];
}> = Object.freeze({
  electronic: Object.freeze(["density", "repeat", "sync", "variation", "octave", "tension"] as const),
  body: Object.freeze(["density", "repeat", "sync", "variation", "octave", "tension"] as const),
  machine: Object.freeze(["density", "repeat", "phase", "anchor", "gap", "variation"] as const),
});

export function getEngineMacroIds<E extends EngineId>(engineId: E): readonly EngineMacroId<E>[] {
  return Object.freeze([...ENGINE_MACRO_IDS[engineId]]) as readonly EngineMacroId<E>[];
}

export function createMacroTargets<E extends EngineId>(
  engineId: E,
  values: MacroTargets<E>,
): MacroTargets<E> {
  const macroIds = getEngineMacroIds(engineId);
  const valueKeys = Object.keys(values);

  if (valueKeys.length !== macroIds.length || !macroIds.every((macroId) => macroId in values)) {
    throw new Error(`MacroTargets must contain exactly the macros for ${engineId}`);
  }

  for (const macroId of macroIds) {
    if (!isMacroValue(values[macroId])) {
      throw new Error(`MacroTargets.${macroId} must be a MacroValue in the range 0..100`);
    }
  }

  return Object.freeze({ ...values }) as MacroTargets<E>;
}
