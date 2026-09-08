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
          "patching_rect": [30.0, 80.0, 168.0, 22.0],
          "text": "v8 ../js/spike/spike-v8.js"
        }
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [30.0, 130.0, 95.0, 22.0],
          "text": "print MAX_SPIKE"
        }
      },
      {
        "box": {
          "id": "obj-4",
          "maxclass": "comment",
          "text": "Click the button; inspect the Max Console for the three PASS lines.",
          "patching_rect": [75.0, 31.0, 405.0, 20.0]
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
