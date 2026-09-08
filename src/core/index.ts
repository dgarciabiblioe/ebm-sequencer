export {
  ENGINE_IDS,
  isEngineId,
  type EngineId,
} from "./model/engine-id";
export {
  STABLE_PITCH_TARGETS,
  type ChromaticApproachPitchIntent,
  type PerfectFifthPitchIntent,
  type PitchIntent,
  type RootPitchIntent,
  type ScaleDegreePitchIntent,
  type StablePitchTarget,
} from "./model/pitch-intent";
export {
  PATTERN_LENGTHS,
  createNote,
  createPattern,
  createRest,
  createTie,
  isPatternLength,
  type IndexedStepInput,
  type NoteStep,
  type NoteStepInput,
  type Pattern,
  type PatternInput,
  type PatternLength,
  type PatternMetadata,
  type RestStep,
  type Step,
  type TieStep,
} from "./model/pattern";
export { createMulberry32 } from "./random/mulberry32";
export type { RandomSource } from "./random/random-source";
export {
  createMacroTargets,
  getEngineMacroIds,
  type BodyMacroId,
  type ElectronicMacroId,
  type EngineMacroId,
  type MacroIdByEngine,
  type MacroTargets,
  type MachineMacroId,
} from "./macro/macro-targets";
export {
  createMacroValue,
  isMacroValue,
  type MacroValue,
} from "./macro/macro-value";
export {
  getEngineCapabilities,
  type EngineCapabilities,
} from "./model/engine-capabilities";
export {
  activeScoreDimension,
  inactiveScoreDimension,
  type ActiveScoreDimension,
  type InactiveScoreDimension,
  type ScoreDimension,
} from "./scoring/score-dimension";
export {
  createScoreComponent,
  type ScoreComponent,
} from "./scoring/score-component";
export {
  createScoreWeight,
  type ScoreWeight,
} from "./scoring/score-weight";
export { weightedGeometricMean } from "./scoring/weighted-geometric-mean";
export {
  CANDIDATE_RETRIES_EXHAUSTED,
  MAX_CANDIDATE_ATTEMPTS,
  MAX_CANDIDATE_RETRIES,
  type AcceptedCandidateRunResult,
  type CandidateProducer,
  type CandidateRunResult,
  type CandidateRunTelemetry,
  type FallbackCandidateRunResult,
  type FallbackProducer,
  type FallbackReason,
} from "./candidate/candidate-contract";
export {
  invalidValidation,
  validValidation,
  validateCandidate,
  type InvalidValidationResult,
  type ValidationResult,
  type Validator,
  type ValidValidationResult,
} from "./candidate/candidate-validation";
export { InvalidFallbackError, runCandidatePipeline } from "./candidate/candidate-runner";
export {
  summarizeCandidateTelemetry,
  type CandidateTelemetrySummary,
} from "./candidate/candidate-telemetry";
export {
  createMidiNote,
  isMidiNote,
  type MidiNote,
} from "./pitch/midi-note";
export {
  createOctaveOffset,
  createPitchContext,
  isOctaveOffset,
  type OctaveOffset,
  type PitchContext,
} from "./pitch/pitch-context";
export {
  getScaleDefinition,
  SCALE_IDS,
  type ScaleDefinition,
  type ScaleId,
} from "./pitch/scale";
export {
  resolveStablePitch,
  type ResolvedPitch,
} from "./pitch/stable-pitch-resolver";
export {
  createChromaticApproach,
  resolvePitchIntent,
  type ChromaticApproachDirection,
} from "./pitch/pitch-intent-resolver";
