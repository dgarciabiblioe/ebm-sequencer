"use strict";

function roundTrip(input) {
  if (
    input === null ||
    typeof input !== "object" ||
    typeof input.protocol !== "string" ||
    typeof input.sequence !== "number" ||
    input.nested === null ||
    typeof input.nested !== "object" ||
    typeof input.nested.enabled !== "boolean"
  ) {
    throw new Error("Invalid spike Dict payload");
  }

  return {
    protocol: input.protocol,
    sequence: input.sequence,
    nested: {
      enabled: input.nested.enabled
    }
  };
}

module.exports = { roundTrip };
