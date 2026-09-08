import {
  createMacroTargets,
  createMacroValue,
  getEngineCapabilities,
  getEngineMacroIds,
} from "../../../src/core";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, message: string): void {
  let didThrow = false;

  try {
    action();
  } catch {
    didThrow = true;
  }

  assert(didThrow, message);
}

for (const value of [0, 25, 50, 75, 100, 83.5]) {
  assert(createMacroValue(value) === value, `MacroValue must accept ${value}`);
}

for (const value of [-1, 100.001, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  assertThrows(() => createMacroValue(value), `MacroValue must reject ${value}`);
}

assert(
  getEngineMacroIds("electronic").join(",") === "density,repeat,sync,variation,octave,tension",
  "ELECTRONIC macro IDs must remain canonical",
);
assert(
  getEngineMacroIds("body").join(",") === "density,repeat,sync,variation,octave,tension",
  "BODY macro IDs must remain canonical",
);
assert(
  getEngineMacroIds("machine").join(",") === "density,repeat,phase,anchor,gap,variation",
  "MACHINE macro IDs must remain canonical",
);

const electronicCapabilities = getEngineCapabilities("electronic");
const bodyCapabilities = getEngineCapabilities("body");
const machineCapabilities = getEngineCapabilities("machine");
assert(
  electronicCapabilities.supportedPatternLengths.join(",") === "8,16,32" && electronicCapabilities.scaleRelevant,
  "ELECTRONIC capabilities must preserve lengths and scale relevance",
);
assert(
  bodyCapabilities.supportedPatternLengths.join(",") === "16" && !bodyCapabilities.scaleRelevant,
  "BODY capabilities must preserve lengths and scale relevance",
);
assert(
  machineCapabilities.supportedPatternLengths.join(",") === "16" && !machineCapabilities.scaleRelevant,
  "MACHINE capabilities must preserve lengths and scale relevance",
);

const value = createMacroValue(50);
const electronicTargets = createMacroTargets("electronic", {
  density: value,
  repeat: value,
  sync: value,
  variation: value,
  octave: value,
  tension: value,
});
const machineTargets = createMacroTargets("machine", {
  density: value,
  repeat: value,
  phase: value,
  anchor: value,
  gap: value,
  variation: value,
});
assert(electronicTargets.tension === value, "Valid ELECTRONIC targets must be constructible");
assert(machineTargets.phase === value, "Valid MACHINE targets must be constructible");
assertThrows(
  () => createMacroTargets("body", {
    density: value,
    repeat: value,
    sync: value,
    variation: value,
    octave: value,
  } as never),
  "MacroTargets must reject missing macros",
);
assertThrows(
  () => createMacroTargets("machine", {
    density: value,
    repeat: value,
    phase: value,
    anchor: value,
    gap: value,
    variation: value,
    tension: value,
  } as never),
  "MacroTargets must reject unknown macros",
);
assertThrows(
  () => createMacroTargets("body", {
    density: 101,
    repeat: value,
    sync: value,
    variation: value,
    octave: value,
    tension: value,
  } as never),
  "MacroTargets must reject values outside 0..100",
);
assert(!getEngineMacroIds("machine").includes("minimal" as never), "minimal must not be a macro alias");
assert(!getEngineCapabilities("machine").engineId.includes("minimal"), "minimal must not be an engine alias");

const returnedMacroIds = getEngineMacroIds("electronic") as string[];
assertThrows(() => returnedMacroIds.push("minimal"), "Public macro ID arrays must be immutable");
const returnedCapabilities = getEngineCapabilities("electronic");
assertThrows(
  () => (returnedCapabilities.supportedPatternLengths as number[]).push(64),
  "Public capability arrays must be immutable",
);
assert(
  getEngineMacroIds("electronic").join(",") === "density,repeat,sync,variation,octave,tension",
  "Mutating a returned macro ID array must not affect later reads",
);
