import {
  invalidValidation,
  runCandidatePipeline,
  validValidation,
  type CandidateRunResult,
  type ValidationResult,
} from "../../../src/core";

const valid: ValidationResult = validValidation();
const invalid: ValidationResult = invalidValidation("reason");

// @ts-expect-error Invalid validation requires a reason.
const incompleteInvalid: ValidationResult = { status: "invalid" };
// @ts-expect-error Valid validation has no reason.
const invalidValid: ValidationResult = { status: "valid", reason: "unexpected" };

const result = runCandidatePipeline(() => 1, [() => validValidation()], () => 1);

function readFallbackReason(candidateResult: CandidateRunResult<number>): string | null {
  if (candidateResult.status === "fallback") {
    return candidateResult.fallbackReason;
  }

  // @ts-expect-error Accepted results do not expose fallbackReason.
  return candidateResult.fallbackReason;
}

void valid;
void invalid;
void incompleteInvalid;
void invalidValid;
void result;
void readFallbackReason;
