function nextProbe(seed: number): number {
  return (seed * 1664525 + 1013904223) >>> 0;
}
