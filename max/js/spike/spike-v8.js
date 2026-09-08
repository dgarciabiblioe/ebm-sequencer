"use strict";

inlets = 1;
outlets = 1;

const INPUT_DICT_NAME = "ebm-spike-input";
const OUTPUT_DICT_NAME = "ebm-spike-output";

function bang() {
  post("V8_OBJECT PASS\n");

  let spikeModule;
  try {
    spikeModule = require("./spike-module.js");
    post("COMMONJS_REQUIRE PASS\n");
  } catch (error) {
    post("COMMONJS_REQUIRE FAIL " + error.message + "\n");
    return;
  }

  try {
    const inputDict = new Dict(INPUT_DICT_NAME);
    inputDict.clear();
    inputDict.set("protocol", "max-spike-00");
    inputDict.set("sequence", 1);
    inputDict.set("nested::enabled", true);

    const input = {
      protocol: inputDict.get("protocol"),
      sequence: inputDict.get("sequence"),
      nested: {
        enabled: inputDict.get("nested::enabled")
      }
    };
    const output = spikeModule.roundTrip(input);

    const outputDict = new Dict(OUTPUT_DICT_NAME);
    outputDict.clear();
    outputDict.set("protocol", output.protocol);
    outputDict.set("sequence", output.sequence);
    outputDict.set("nested::enabled", output.nested.enabled);

    if (
      outputDict.get("protocol") !== output.protocol ||
      outputDict.get("sequence") !== output.sequence ||
      outputDict.get("nested::enabled") !== output.nested.enabled
    ) {
      throw new Error("Output Dict did not preserve the structured payload");
    }

    outlet(0, "dictionary", OUTPUT_DICT_NAME);
    post("DICT_ROUNDTRIP PASS\n");
  } catch (error) {
    post("DICT_ROUNDTRIP FAIL " + error.message + "\n");
  }
}
