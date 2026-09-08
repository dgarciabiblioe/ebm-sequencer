/* GENERATED FILE - DO NOT EDIT */

declare function post(message: string): void;
declare function outlet(index: number, value: number): void;

function loadbang(): void {
  post("SCRIPT_LOADED PASS\n");
}

function bang(): void {
  var a: number = nextProbe(123456789);
  var b: number = nextProbe(123456789);

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
