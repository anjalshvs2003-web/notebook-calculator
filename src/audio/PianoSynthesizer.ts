/**
 * Minimalist Hand-Drawn Notebook Piano Synthesizer
 * Uses Web Audio API to synthesize a warm, nostalgic upright piano tone with
 * rich harmonics, gentle hammer transients, soundboard resonance, and a serene,
 * contemplative Erik Satie / Ghibli-inspired minimalist melody.
 */

// Note frequencies (Hz) in equal temperament
const NOTE_FREQS: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98,
};

// Beautiful, peaceful minimalist ambient piano sequence
// Each event has: delayFromPrev (seconds), note, velocity (0.1 - 1.0), duration (seconds)
interface MelodyNote {
  beat: number; // time in beats
  note: string;
  velocity: number;
  duration: number;
}

// 32-beat peaceful motif (approx 35 seconds per loop at 54 bpm)
const PEACEFUL_PIANO_MOTIF: MelodyNote[] = [
  // Measure 1: Cmaj9 chord & melody
  { beat: 0, note: 'C3', velocity: 0.35, duration: 4.5 },
  { beat: 0.2, note: 'G3', velocity: 0.28, duration: 3.5 },
  { beat: 0.5, note: 'E4', velocity: 0.30, duration: 3.0 },
  { beat: 1.0, note: 'B4', velocity: 0.45, duration: 2.8 },
  { beat: 2.2, note: 'D5', velocity: 0.40, duration: 2.4 },
  { beat: 3.2, note: 'C5', velocity: 0.35, duration: 3.0 },

  // Measure 2: Am9 chord & melody
  { beat: 4.0, note: 'A2', velocity: 0.32, duration: 4.5 },
  { beat: 4.2, note: 'E3', velocity: 0.26, duration: 3.5 },
  { beat: 4.6, note: 'C4', velocity: 0.28, duration: 3.2 },
  { beat: 5.2, note: 'G4', velocity: 0.42, duration: 2.5 },
  { beat: 6.4, note: 'B4', velocity: 0.38, duration: 2.6 },
  { beat: 7.2, note: 'A4', velocity: 0.32, duration: 3.2 },

  // Measure 3: Fmaj7 chord & melody
  { beat: 8.0, note: 'F2', velocity: 0.34, duration: 4.5 },
  { beat: 8.2, note: 'C3', velocity: 0.26, duration: 3.5 },
  { beat: 8.6, note: 'A3', velocity: 0.28, duration: 3.2 },
  { beat: 9.2, note: 'E4', velocity: 0.42, duration: 2.6 },
  { beat: 10.4, note: 'G4', velocity: 0.44, duration: 2.4 },
  { beat: 11.2, note: 'A4', velocity: 0.38, duration: 3.0 },

  // Measure 4: Em7 / G chord & gentle pause
  { beat: 12.0, note: 'E2', velocity: 0.30, duration: 4.5 },
  { beat: 12.3, note: 'B2', velocity: 0.25, duration: 3.5 },
  { beat: 12.7, note: 'G3', velocity: 0.28, duration: 3.2 },
  { beat: 13.5, note: 'D4', velocity: 0.38, duration: 3.0 },
  { beat: 14.8, note: 'E4', velocity: 0.35, duration: 3.5 },

  // Measure 5: Second phrase with delicate high register
  { beat: 16.0, note: 'C3', velocity: 0.32, duration: 4.5 },
  { beat: 16.3, note: 'G3', velocity: 0.25, duration: 3.5 },
  { beat: 16.8, note: 'E4', velocity: 0.28, duration: 3.0 },
  { beat: 17.5, note: 'E5', velocity: 0.46, duration: 3.0 },
  { beat: 18.8, note: 'D5', velocity: 0.38, duration: 2.2 },
  { beat: 19.8, note: 'B4', velocity: 0.35, duration: 3.2 },

  // Measure 6: Soft Fmaj9
  { beat: 20.0, note: 'F2', velocity: 0.32, duration: 4.5 },
  { beat: 20.3, note: 'C3', velocity: 0.26, duration: 3.5 },
  { beat: 21.0, note: 'A4', velocity: 0.40, duration: 2.8 },
  { beat: 22.2, note: 'G4', velocity: 0.36, duration: 2.5 },
  { beat: 23.2, note: 'E4', velocity: 0.32, duration: 3.5 },

  // Measure 7: Dm9
  { beat: 24.0, note: 'D2', velocity: 0.30, duration: 4.5 },
  { beat: 24.3, note: 'A2', velocity: 0.25, duration: 3.5 },
  { beat: 24.7, note: 'F3', velocity: 0.28, duration: 3.0 },
  { beat: 25.5, note: 'C4', velocity: 0.38, duration: 2.8 },
  { beat: 26.6, note: 'F4', velocity: 0.36, duration: 2.5 },
  { beat: 27.5, note: 'E4', velocity: 0.30, duration: 3.0 },

  // Measure 8: Gsus4 resolution to C with tender natural pause
  { beat: 28.0, note: 'G2', velocity: 0.30, duration: 4.5 },
  { beat: 28.4, note: 'D3', velocity: 0.25, duration: 3.5 },
  { beat: 29.2, note: 'C4', velocity: 0.36, duration: 3.0 },
  { beat: 30.2, note: 'B3', velocity: 0.34, duration: 3.2 },
  // Measure 31-32 is a peaceful natural silence/breath before looping
];

export class PianoSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.45; // gentle default volume
  private timerId: number | null = null;
  private loopDurationSeconds: number = 36; // 32 beats at 53.3 BPM
  private secondsPerBeat: number = 1.1; // ~54.5 BPM
  private loopStartTime: number = 0;

  constructor() {
    // AudioContext will be initialized upon user gesture
  }

  // Initialize Web Audio Context
  private initAudio() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('Web Audio API is not supported in this browser.');
      return;
    }

    this.ctx = new AudioContextClass();

    // Master volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    // Warm wooden soundboard reverb using synthetic impulse response
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.buildReverbImpulse(this.ctx, 2.5, 2.2);

    this.dryGain = this.ctx.createGain();
    this.wetGain = this.ctx.createGain();

    this.dryGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.wetGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Routing: Note -> Dry/Wet -> MasterGain -> Destination
    this.dryGain.connect(this.masterGain);
    this.wetGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  // Generate a lush, warm room impulse response simulating an open wooden room / piano body
  private buildReverbImpulse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = length - i;
      // Exponential decay envelope
      const env = Math.pow(n / length, decay);
      // Soft noise with stereo spread
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }
    return impulse;
  }

  /**
   * Play an authentic warm piano note with acoustic characteristics:
   * - 3 detuned oscillators for string coupling
   * - Natural harmonic overtones
   * - Soundboard resonance filter
   * - Realistic hammer felt transient
   */
  public playPianoNote(noteName: string, velocity: number = 0.4, duration: number = 3.0, scheduledTime?: number) {
    this.initAudio();
    if (!this.ctx || !this.dryGain || !this.wetGain || !this.reverbNode) return;

    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const now = scheduledTime ?? this.ctx.currentTime;

    // Filter simulating the wooden piano lid and string stiffness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Higher notes and higher velocities open the filter more, like felt striking steel strings
    const cutoff = Math.min(6500, Math.max(700, freq * (2.8 + velocity * 2.2)));
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, freq * 1.2), now + duration * 0.7);
    filter.Q.setValueAtTime(1.2, now);

    // Note amplitude envelope
    const noteGain = this.ctx.createGain();
    const peakGain = Math.min(0.45, Math.max(0.05, velocity * 0.45));
    noteGain.gain.setValueAtTime(0.0001, now);
    // Felt hammer attack (approx 8-12ms)
    noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.012);
    // Initial quick acoustic decay
    noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.65, now + 0.35);
    // Gentle singing sustain decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Detuned string group (giving authentic acoustic warmth and chorus)
    const detunes = [-1.8, 0, 1.8];
    const oscGains = [0.35, 0.5, 0.35];

    detunes.forEach((detune, idx) => {
      const osc = this.ctx!.createOscillator();
      // Triangle waves have piano-like soft odd harmonics, combined with subtle sine
      osc.type = idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      const subGain = this.ctx!.createGain();
      subGain.gain.setValueAtTime(oscGains[idx], now);

      osc.connect(subGain);
      subGain.connect(filter);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    // Subtle 2nd harmonic overtone for string chime
    const harmonicOsc = this.ctx.createOscillator();
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(freq * 2.003, now); // slight stretch tuning
    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(peakGain * 0.22, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.5);

    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(filter);
    harmonicOsc.start(now);
    harmonicOsc.stop(now + duration * 0.5 + 0.1);

    // Connect filter to dry signal & reverb
    filter.connect(this.dryGain);
    filter.connect(this.reverbNode);
    this.reverbNode.connect(this.wetGain);

    // Hammer thud (extremely soft transient noise click)
    const thudBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.015), this.ctx.sampleRate);
    const thudData = thudBuffer.getChannelData(0);
    for (let i = 0; i < thudData.length; i++) {
      thudData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
    }
    const thudSource = this.ctx.createBufferSource();
    thudSource.buffer = thudBuffer;
    const thudGain = this.ctx.createGain();
    thudGain.gain.setValueAtTime(velocity * 0.06, now);
    thudSource.connect(thudGain);
    thudGain.connect(filter);
    thudSource.start(now);
  }

  // Schedule a complete loop of the peaceful piano sequence
  private scheduleMelodyLoop(startTime: number) {
    if (!this.ctx || !this.isPlaying) return;

    PEACEFUL_PIANO_MOTIF.forEach(item => {
      const noteTime = startTime + item.beat * this.secondsPerBeat;
      if (noteTime >= this.ctx!.currentTime - 0.1) {
        this.playPianoNote(item.note, item.velocity, item.duration, noteTime);
      }
    });

    // Schedule the next loop ahead of time
    const nextLoopStart = startTime + this.loopDurationSeconds;
    const delayMs = Math.max(100, (nextLoopStart - this.ctx.currentTime - 1.5) * 1000);

    this.timerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleMelodyLoop(nextLoopStart);
      }
    }, delayMs);
  }

  /**
   * Start or resume peaceful background piano music
   */
  public async start(): Promise<boolean> {
    this.initAudio();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume failed:', err);
        return false;
      }
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    this.loopStartTime = this.ctx.currentTime + 0.1;
    this.scheduleMelodyLoop(this.loopStartTime);
    return true;
  }

  /**
   * Pause background music
   */
  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      // Smooth fade out to prevent clicks
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
    }
  }

  /**
   * Resume music
   */
  public resume() {
    if (!this.isPlaying) {
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      }
      this.start();
    }
  }

  /**
   * Toggle Play / Pause
   */
  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.resume();
      return true;
    }
  }

  /**
   * Set volume smoothly (0.0 to 1.0)
   */
  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Toggle mute
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public destroy() {
    this.pause();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Singleton instance for the application
export const pianoMusic = new PianoSynthesizer();
