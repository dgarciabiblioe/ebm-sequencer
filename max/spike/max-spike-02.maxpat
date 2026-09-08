{
  "patcher": {
    "fileversion": 1,
    "appversion": {"major": 9, "minor": 0, "revision": 0, "architecture": "x64", "modernui": 1},
    "classnamespace": "box",
    "rect": [85.0, 104.0, 820.0, 380.0],
    "boxes": [
      {"box": {"id": "obj-1", "maxclass": "newobj", "numinlets": 1, "numoutlets": 1, "outlettype": ["bang"], "patching_rect": [30.0, 30.0, 62.0, 22.0], "text": "loadbang"}},
      {"box": {"id": "obj-2", "maxclass": "newobj", "numinlets": 1, "numoutlets": 9, "outlettype": ["int", "int", "int", "float", "list", "float", "float", "int", "int"], "patching_rect": [110.0, 30.0, 65.0, 22.0], "text": "plugsync~"}},
      {"box": {"id": "obj-3", "maxclass": "message", "text": "1", "patching_rect": [30.0, 70.0, 29.0, 22.0]}},
      {"box": {"id": "obj-4", "maxclass": "newobj", "numinlets": 2, "numoutlets": 8, "outlettype": ["int", "int", "float", "float", "float", "list", "int", "float"], "patching_rect": [30.0, 110.0, 60.0, 22.0], "text": "transport"}},
      {"box": {"id": "obj-5", "maxclass": "newobj", "numinlets": 2, "numoutlets": 1, "outlettype": ["bang"], "patching_rect": [30.0, 170.0, 166.0, 22.0], "text": "metro 16n @quantize 16n"}},
      {"box": {"id": "obj-6", "maxclass": "comment", "text": "Live host state (plugsync~)", "patching_rect": [215.0, 85.0, 190.0, 20.0]}},
      {"box": {"id": "obj-7", "maxclass": "number", "numinlets": 1, "numoutlets": 2, "outlettype": ["", "bang"], "patching_rect": [215.0, 110.0, 55.0, 22.0]}},
      {"box": {"id": "obj-8", "maxclass": "newobj", "numinlets": 1, "numoutlets": 2, "outlettype": ["bang", "bang"], "patching_rect": [290.0, 110.0, 48.0, 22.0], "text": "sel 0 1"}},
      {"box": {"id": "obj-9", "maxclass": "message", "text": "set STOPPED", "patching_rect": [360.0, 90.0, 83.0, 22.0]}},
      {"box": {"id": "obj-10", "maxclass": "message", "text": "set RUNNING", "patching_rect": [360.0, 125.0, 83.0, 22.0]}},
      {"box": {"id": "obj-11", "maxclass": "message", "text": "STOPPED", "patching_rect": [465.0, 110.0, 75.0, 22.0]}},
      {"box": {"id": "obj-12", "maxclass": "number", "numinlets": 1, "numoutlets": 2, "outlettype": ["", "bang"], "patching_rect": [215.0, 210.0, 100.0, 22.0]}},
      {"box": {"id": "obj-13", "maxclass": "newobj", "numinlets": 1, "numoutlets": 1, "outlettype": ["int"], "patching_rect": [335.0, 210.0, 142.0, 22.0], "text": "expr floor($f1 / 120.)"}},
      {"box": {"id": "obj-14", "maxclass": "number", "numinlets": 1, "numoutlets": 2, "outlettype": ["", "bang"], "patching_rect": [495.0, 210.0, 100.0, 22.0]}},
      {"box": {"id": "obj-15", "maxclass": "newobj", "numinlets": 1, "numoutlets": 1, "outlettype": ["int"], "patching_rect": [615.0, 210.0, 125.0, 22.0], "text": "expr ($i1 % 16) + 1"}},
      {"box": {"id": "obj-16", "maxclass": "number", "numinlets": 1, "numoutlets": 2, "outlettype": ["", "bang"], "patching_rect": [755.0, 210.0, 55.0, 22.0]}},
      {"box": {"id": "obj-17", "maxclass": "newobj", "numinlets": 1, "numoutlets": 1, "outlettype": [""], "patching_rect": [560.0, 110.0, 137.0, 22.0], "text": "prepend host_state"}},
      {"box": {"id": "obj-18", "maxclass": "newobj", "numinlets": 1, "numoutlets": 0, "patching_rect": [715.0, 110.0, 104.0, 22.0], "text": "print MAX_SPIKE_02"}},
      {"box": {"id": "obj-19", "maxclass": "comment", "text": "raw transport ticks (480 PPQ)", "patching_rect": [215.0, 185.0, 190.0, 20.0]}},
      {"box": {"id": "obj-20", "maxclass": "comment", "text": "globalSixteenth = floor(rawTicks / 120)", "patching_rect": [495.0, 185.0, 245.0, 20.0]}},
      {"box": {"id": "obj-21", "maxclass": "comment", "text": "stepIndex16", "patching_rect": [755.0, 185.0, 70.0, 20.0]}},
      {"box": {"id": "obj-22", "maxclass": "comment", "text": "Native clock path: Live transport -> metro 16n -> transport ticks -> step", "patching_rect": [30.0, 285.0, 500.0, 20.0]}},
      {"box": {"id": "obj-23", "maxclass": "comment", "text": "Manual checks: LIVE_CLOCK, TRANSPORT_POSITION, STEP_INDEX, PLAYHEAD_RESYNC", "patching_rect": [30.0, 315.0, 540.0, 20.0]}},
      {"box": {"id": "obj-24", "maxclass": "comment", "text": "Run inside a Max for Live MIDI Effect via bpatcher; standalone Max does not certify Live sync.", "patching_rect": [30.0, 345.0, 690.0, 20.0]}},
      {"box": {"id": "obj-27", "maxclass": "button", "numinlets": 1, "numoutlets": 1, "outlettype": ["bang"], "patching_rect": [120.0, 170.0, 24.0, 24.0]}},
      {"box": {"id": "obj-28", "maxclass": "comment", "text": "clock pulse", "patching_rect": [105.0, 195.0, 75.0, 20.0]}}
    ],
    "lines": [
      {"patchline": {"source": ["obj-1", 0], "destination": ["obj-3", 0]}}, {"patchline": {"source": ["obj-3", 0], "destination": ["obj-5", 0]}},
      {"patchline": {"source": ["obj-2", 0], "destination": ["obj-7", 0]}}, {"patchline": {"source": ["obj-2", 0], "destination": ["obj-8", 0]}}, {"patchline": {"source": ["obj-2", 0], "destination": ["obj-17", 0]}},
      {"patchline": {"source": ["obj-8", 0], "destination": ["obj-9", 0]}}, {"patchline": {"source": ["obj-8", 1], "destination": ["obj-10", 0]}}, {"patchline": {"source": ["obj-9", 0], "destination": ["obj-11", 0]}}, {"patchline": {"source": ["obj-10", 0], "destination": ["obj-11", 0]}}, {"patchline": {"source": ["obj-17", 0], "destination": ["obj-18", 0]}},
      {"patchline": {"source": ["obj-5", 0], "destination": ["obj-27", 0]}}, {"patchline": {"source": ["obj-27", 0], "destination": ["obj-4", 0]}}, {"patchline": {"source": ["obj-4", 7], "destination": ["obj-12", 0]}}, {"patchline": {"source": ["obj-4", 7], "destination": ["obj-13", 0]}}, {"patchline": {"source": ["obj-13", 0], "destination": ["obj-14", 0]}}, {"patchline": {"source": ["obj-13", 0], "destination": ["obj-15", 0]}}, {"patchline": {"source": ["obj-15", 0], "destination": ["obj-16", 0]}}
    ]
  }
}
