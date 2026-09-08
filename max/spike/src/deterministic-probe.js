"use strict";
function nextProbe(seed) {
    return (seed * 1664525 + 1013904223) >>> 0;
}
