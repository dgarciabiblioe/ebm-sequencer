# MAX-SPIKE-02 Max for Live Harness

1. In Ableton Live, add an empty Max MIDI Effect to a MIDI track and choose
   **Edit in Max**.
2. Save it as `max-spike-02-harness.amxd` in this `max/spike/` directory, next
   to `max-spike-02.maxpat`.
3. In the device patcher, create a `bpatcher`. In its Inspector, set **Patcher
   File** to the co-located `max-spike-02.maxpat`; leave **Embed Patcher in
   Parent** disabled.
4. Lock the device patcher and return to Live. The bpatcher shows the transport
   state, raw ticks, global sixteenth and derived step index.

Test only from this `.amxd` loaded on a Live MIDI track. A standalone opening
of `max-spike-02.maxpat` does not test Live transport synchronization.
