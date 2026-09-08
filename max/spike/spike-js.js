inlets = 1;
outlets = 1;

var INPUT_DICT_NAME = "ebm-spike-input";
var OUTPUT_DICT_NAME = "ebm-spike-output";

function loadbang() {
  post("SCRIPT_LOADED PASS\n");
}

function bang() {
  var inputDict;
  var outputDict;

  post("JS_RUNTIME PASS\n");
  post("BANG_HANDLER PASS\n");

  try {
    inputDict = new Dict(INPUT_DICT_NAME);
    inputDict.clear();
    inputDict.set("protocol", "max-spike-00");
    inputDict.set("sequence", 1);
    inputDict.replace("nested::enabled", 1);

    outputDict = new Dict(OUTPUT_DICT_NAME);
    outputDict.clear();
    outputDict.set("protocol", inputDict.get("protocol"));
    outputDict.set("sequence", inputDict.get("sequence"));
    outputDict.replace("nested::enabled", inputDict.get("nested::enabled"));

    if (
      outputDict.get("protocol") !== "max-spike-00" ||
      outputDict.get("sequence") !== 1 ||
      outputDict.get("nested::enabled") !== 1
    ) {
      throw new Error("Dict did not preserve the structured payload");
    }

    outlet(0, "dictionary", OUTPUT_DICT_NAME);
    post("DICT_ROUNDTRIP PASS\n");
  } catch (error) {
    post("DICT_ROUNDTRIP FAIL " + error.message + "\n");
  }
}
