import {
  createMacroTargets,
  createMacroValue,
  type EngineMacroId,
} from "../../../src/core";

const value = createMacroValue(50);

const machineMacro: EngineMacroId<"machine"> = "phase";
const electronicMacro: EngineMacroId<"electronic"> = "tension";
const bodyMacro: EngineMacroId<"body"> = "sync";

// @ts-expect-error MACHINE does not support tension.
const invalidMachineMacro: EngineMacroId<"machine"> = "tension";
// @ts-expect-error ELECTRONIC does not support phase.
const invalidElectronicMacro: EngineMacroId<"electronic"> = "phase";
// @ts-expect-error BODY does not support anchor.
const invalidBodyMacro: EngineMacroId<"body"> = "anchor";

const machineTargets = createMacroTargets("machine", {
  density: value,
  repeat: value,
  phase: value,
  anchor: value,
  gap: value,
  variation: value,
});

const invalidMachineTargets = createMacroTargets("machine", {
  density: value,
  repeat: value,
  phase: value,
  anchor: value,
  gap: value,
  variation: value,
  // @ts-expect-error MACHINE targets cannot include tension.
  tension: value,
});

void machineMacro;
void electronicMacro;
void bodyMacro;
void invalidMachineMacro;
void invalidElectronicMacro;
void invalidBodyMacro;
void machineTargets;
void invalidMachineTargets;
