export type ValidationResult = ValidValidationResult | InvalidValidationResult;

export interface ValidValidationResult {
  readonly status: "valid";
}

export interface InvalidValidationResult {
  readonly status: "invalid";
  readonly reason: string;
}

export type Validator<T> = (candidate: T) => ValidationResult;

const VALID_RESULT: ValidValidationResult = Object.freeze({ status: "valid" });

export function validValidation(): ValidValidationResult {
  return VALID_RESULT;
}

export function invalidValidation(reason: string): InvalidValidationResult {
  return Object.freeze({ status: "invalid", reason });
}

export function validateCandidate<T>(
  candidate: T,
  validators: readonly Validator<T>[],
): ValidationResult {
  for (const validator of validators) {
    const result = validator(candidate);

    if (result.status === "invalid") {
      return result;
    }
  }

  return validValidation();
}
