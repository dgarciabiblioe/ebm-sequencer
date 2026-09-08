{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 9,
      "minor": 0,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [85.0, 104.0, 520.0, 250.0],
    "boxes": [
      {
        "box": {
          "id": "obj-1",
          "maxclass": "button",
          "numinlets": 1,
          "numoutlets": 1,
          "outlettype": ["bang"],
          "patching_rect": [30.0, 30.0, 24.0, 24.0]
        }
      },
      {
        "box": {
          "id": "obj-2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "outlettype": [""],
          "patching_rect": [30.0, 80.0, 140.0, 22.0],
          "text": "js max-spike-01.js"
        }
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [30.0, 130.0, 115.0, 22.0],
          "text": "print MAX_SPIKE_01"
        }
      },
      {
        "box": {
          "id": "obj-4",
          "maxclass": "comment",
          "text": "Reload for SCRIPT_LOADED PASS; click for COMPILED_FUNCTION, DETERMINISM and FIXTURE PASS.",
          "patching_rect": [75.0, 31.0, 420.0, 20.0]
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": ["obj-1", 0],
          "destination": ["obj-2", 0]
        }
      },
      {
        "patchline": {
          "source": ["obj-2", 0],
          "destination": ["obj-3", 0]
        }
      }
    ]
  }
}
