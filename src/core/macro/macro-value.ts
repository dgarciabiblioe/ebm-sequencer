declare const macroValueBrand: unique symbol;

export type MacroValue = number & {
  readonly [macroValueBrand]: "MacroValue";
};

export function createMacroValue(value: number): MacroValue {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("MacroValue must be a finite number in the range 0..100");
  }

  return value as MacroValue;
}

export function isMacroValue(value: number): value is MacroValue {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}
