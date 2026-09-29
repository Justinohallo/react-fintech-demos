"use client";

// A short sine blip through the Web Audio API. Browsers only allow audio after
// a user gesture, so `primeAudio` is called from the Start click.

let context: AudioContext | null = null;

export function primeAudio() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
  } catch {
    context = null;
  }
}

export function playTone(frequency = 880) {
  try {
    context ??= new AudioContext();
    const ctx = context;
    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  } catch {
    // No audio available; the visual cue still shows.
  }
}
