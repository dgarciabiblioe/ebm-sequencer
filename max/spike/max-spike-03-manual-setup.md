# MAX-SPIKE-03 Max for Live Harness

1. Create a MIDI track in Ableton Live and insert an empty Max MIDI Effect.
2. Choose **Edit in Max**, save the device beside this file if you want a
   reusable harness, then create a `bpatcher`.
3. In the bpatcher Inspector, set **Patcher File** to `max-spike-03.maxpat`
   and leave **Embed Patcher in Parent** disabled.
4. After the Max MIDI Effect, insert a simple Live instrument. Do not use a
   MIDI clip for the initial test; press Live Play.

The static table uses MIDI channel 1 and sends only through `midiformat` to
`midiout`.
