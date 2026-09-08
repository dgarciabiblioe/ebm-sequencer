"use strict";
function nextProbe(seed) {
    return (seed * 1664525 + 1013904223) >>> 0;
}
/* GENERATED FILE - DO NOT EDIT */
function loadbang() {
    post("SCRIPT_LOADED PASS\n");
}
function bang() {
    var a = nextProbe(123456789);
    var b = nextProbe(123456789);
    post("COMPILED_FUNCTION PASS\n");
    if (a !== b) {
        post("DETERMINISM FAIL\n");
        return;
    }
    post("DETERMINISM PASS\n");
    if (a !== 920370032) {
        post("FIXTURE FAIL\n");
        return;
    }
    post("FIXTURE PASS\n");
    outlet(0, a);
}
