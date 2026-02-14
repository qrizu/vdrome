import React, { useEffect, useMemo, useState } from "react";
import Vechnics from "./components/Vechnics";
import Vone92 from "./components/Vone92";

const defaultDeck = {
  powerOn: false,
  playing: false,
  rpm: 33,
  pitch: 0.5,
  resetLock: false,
  speedX2: false,
  lightOn: true,
  startTime: 0.7,
  brakeTime: 1.2,
};

const defaultChannel = {
  gain: 0.7,
  aux1: 0,
  aux2: 0,
  inputSource: "phono",
  hf: 0.5,
  hmf: 0.5,
  lmf: 0.5,
  lf: 0.5,
  volume: 0.8,
  filterOn: false,
  filterBus: 0,
  xfadeBus: 0,
  cue: false,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function dbToLinear(db) {
  return 10 ** (db / 20);
}

function knobToEqLinear(v) {
  if (v <= 0.02) return 0;
  const db = -26 + v * 32;
  return dbToLinear(db);
}

function knobToGainLinear(v) {
  const db = -12 + v * 18;
  return dbToLinear(db);
}

function pitchPercent(deck) {
  return ((deck.pitch - 0.5) * 16).toFixed(1);
}

function deckStatus(deck) {
  if (!deck.powerOn) return "Power Off";
  if (!deck.playing) return "Cue Ready";
  return "Playing";
}

export default function Velodrome() {
  const [deckA, setDeckA] = useState(defaultDeck);
  const [deckB, setDeckB] = useState(defaultDeck);
  const [clockMs, setClockMs] = useState(0);
  const [mixer, setMixer] = useState({
    channelA: { ...defaultChannel, xfadeBus: -1 },
    channelB: { ...defaultChannel, xfadeBus: 1 },
    crossfader: 0.5,
    master: 0.8,
    booth: 0.6,
    monitorPostEq: false,
    monitorSplitCue: false,
    monitorSource: "mix",
    monitorCueMix: 0,
    monitorMono: false,
    monitorMute: false,
    monitorLevel: 0.7,
    filter1Freq: 0.5,
    filter1Res: 0.35,
    filter1Modes: { hpf: false, bpf: false, lpf: true },
    filter1LfoOn: false,
    filter1LfoDepth: 0.5,
    filter1LfoBpm: 120,
    filter1LfoX2: false,
    filter2Freq: 0.5,
    filter2Res: 0.35,
    filter2Modes: { hpf: false, bpf: false, lpf: true },
    filter2LfoOn: false,
    filter2LfoDepth: 0.5,
    filter2LfoBpm: 120,
    filter2LfoX2: false,
    midiRunning: false,
  });

  useEffect(() => {
    const timer = window.setInterval(() => setClockMs(performance.now()), 50);
    return () => window.clearInterval(timer);
  }, []);

  const updateDeck = (side, patch) => {
    const setter = side === "A" ? setDeckA : setDeckB;
    setter((prev) => ({ ...prev, ...patch }));
  };

  const updateChannel = (side, patch) => {
    setMixer((prev) => {
      const channelKey = side === "A" ? "channelA" : "channelB";
      const nextPatch = { ...patch };
      if (Object.prototype.hasOwnProperty.call(nextPatch, "filterBus") && !Object.prototype.hasOwnProperty.call(nextPatch, "filterOn")) {
        nextPatch.filterOn = Number(nextPatch.filterBus) !== 0;
      }
      if (Object.prototype.hasOwnProperty.call(nextPatch, "filterOn") && !nextPatch.filterOn && !Object.prototype.hasOwnProperty.call(nextPatch, "filterBus")) {
        nextPatch.filterBus = 0;
      }
      return {
        ...prev,
        [channelKey]: { ...prev[channelKey], ...nextPatch },
      };
    });
  };

  const outputs = useMemo(() => {
    const tSec = clockMs / 1000;
    const filterConfig = (bus) => {
      if (bus === 2) {
        return {
          freq: mixer.filter2Freq,
          res: mixer.filter2Res,
          modes: mixer.filter2Modes,
          lfoOn: mixer.filter2LfoOn,
          lfoDepth: mixer.filter2LfoDepth,
          lfoBpm: mixer.filter2LfoBpm,
          lfoX2: mixer.filter2LfoX2,
        };
      }
      return {
        freq: mixer.filter1Freq,
        res: mixer.filter1Res,
        modes: mixer.filter1Modes,
        lfoOn: mixer.filter1LfoOn,
        lfoDepth: mixer.filter1LfoDepth,
        lfoBpm: mixer.filter1LfoBpm,
        lfoX2: mixer.filter1LfoX2,
      };
    };

    const filterGain = (cfg) => {
      const hz = (cfg.lfoBpm / 60) * (cfg.lfoX2 ? 2 : 1);
      const lfoWave = Math.sin(2 * Math.PI * hz * tSec);
      const lfoOffset = cfg.lfoOn ? lfoWave * cfg.lfoDepth * 0.5 : 0;
      const freq = clamp01(cfg.freq + lfoOffset);

      const enabled = [];
      if (cfg.modes?.hpf) enabled.push(0.2 + freq * 0.8);
      if (cfg.modes?.bpf) enabled.push(0.28 + (1 - Math.abs(freq - 0.5) * 2) * 0.72);
      if (cfg.modes?.lpf) enabled.push(0.28 + (1 - freq) * 0.72);

      if (!enabled.length) return 1;

      const avg = enabled.reduce((sum, v) => sum + v, 0) / enabled.length;
      const resonance = 0.82 + cfg.res * 0.48;

      // Approximates the all-pass interaction when all three filter types are selected.
      if (enabled.length === 3) return (0.95 + (cfg.res - 0.5) * 0.1) * resonance;
      return avg * resonance;
    };

    const deckOutput = (deck, channel, side) => {
      const baseSpeed = deck.rpm;
      const pitchFactor = deck.resetLock ? 1 : 1 + (deck.pitch - 0.5) * 0.16;
      const speedFactor = deck.speedX2 ? 2 : 1;
      const targetRpm = deck.powerOn && deck.playing ? baseSpeed * pitchFactor * speedFactor : 0;
      const normalizedSpeed = clamp01(targetRpm / 66);

      const gain = knobToGainLinear(channel.gain);
      const eqHf = knobToEqLinear(channel.hf);
      const eqHmf = knobToEqLinear(channel.hmf);
      const eqLmf = knobToEqLinear(channel.lmf);
      const eqLf = knobToEqLinear(channel.lf);
      const eqShape = 0.26 * eqHf + 0.24 * eqHmf + 0.24 * eqLmf + 0.26 * eqLf;
      const source = normalizedSpeed * gain;
      const postEq = source * eqShape;
      const fader = channel.volume ** 1.8;

      let filtered = postEq;
      if (channel.filterOn && channel.filterBus > 0) {
        filtered = postEq * filterGain(filterConfig(channel.filterBus));
      }

      const postFader = filtered * fader;
      const cueBase = mixer.monitorPostEq ? postEq : source;

      return {
        side,
        speed: targetRpm,
        xfadeBus: Number.isFinite(channel.xfadeBus) ? channel.xfadeBus : (side === "A" ? -1 : 1),
        level: clamp01(postFader),
        aux1: clamp01(postFader * channel.aux1),
        aux2: clamp01(postFader * channel.aux2),
        cue: channel.cue ? clamp01(cueBase) : 0,
      };
    };

    const a = deckOutput(deckA, mixer.channelA, "A");
    const b = deckOutput(deckB, mixer.channelB, "B");
    const leftWeight = Math.cos((mixer.crossfader * Math.PI) / 2);
    const rightWeight = Math.sin((mixer.crossfader * Math.PI) / 2);
    const xfadeApply = (level, bus) => {
      if (bus === -1) return level * leftWeight;
      if (bus === 1) return level * rightWeight;
      return level;
    };

    const masterPre = xfadeApply(a.level, a.xfadeBus) + xfadeApply(b.level, b.xfadeBus);
    const master = clamp01(masterPre * (mixer.master ** 1.6));
    const boothRaw = clamp01(master * (mixer.booth ** 1.2));
    const booth = mixer.monitorMute ? 0 : boothRaw;

    const cueBus = clamp01(a.cue + b.cue);
    const cueActive = cueBus > 0.0005;

    let monitorProgram = master;
    if (mixer.monitorSource === "aux1") monitorProgram = clamp01(a.aux1 + b.aux1);
    if (mixer.monitorSource === "aux2") monitorProgram = clamp01(a.aux2 + b.aux2);

    let phones;
    if (mixer.monitorSplitCue) {
      phones = cueActive ? Math.max(cueBus, monitorProgram) : monitorProgram;
    } else if (cueActive) {
      phones = cueBus * (1 - mixer.monitorCueMix) + monitorProgram * mixer.monitorCueMix;
    } else {
      phones = monitorProgram;
    }
    const cue = clamp01(phones * (mixer.monitorLevel ** 1.2));

    return { a, b, master, booth, cue, cueActive, monitorProgram };
  }, [deckA, deckB, mixer, clockMs]);

  return (
    <div className="velodrome-root">
      <div className="velodrome-stage">
        <div className="stage-deck stage-deck-a">
          <Vechnics
            side="A"
            title="TECHNICS 1210 A"
            deck={deckA}
            onUpdate={(patch) => updateDeck("A", patch)}
            level={outputs.a.level}
          />
        </div>

        <div className="stage-mixer">
          <Vone92
            mixer={mixer}
            output={outputs}
            clock={clockMs}
            onMixerUpdate={(patch) => setMixer((prev) => ({ ...prev, ...patch }))}
            onChannelUpdate={(side, patch) => updateChannel(side, patch)}
          />
        </div>

        <div className="stage-deck stage-deck-b">
          <Vechnics
            side="B"
            title="TECHNICS 1210 B"
            deck={deckB}
            onUpdate={(patch) => updateDeck("B", patch)}
            level={outputs.b.level}
          />
        </div>

        <section className="stage-info">
          <div className="now-grid">
            <article className="now-card now-a">
              <h3>Now Playing A</h3>
              <p className="track-title">Velodrome Session A</p>
              <p>{deckStatus(deckA)} | {deckA.rpm} RPM | Pitch {pitchPercent(deckA)}%</p>
              <p>Level {Math.round(outputs.a.level * 100)}% | Filter bus {mixer.channelA.filterBus}</p>
            </article>

            <article className="now-card now-b">
              <h3>Now Playing B</h3>
              <p className="track-title">Velodrome Session B</p>
              <p>{deckStatus(deckB)} | {deckB.rpm} RPM | Pitch {pitchPercent(deckB)}%</p>
              <p>Level {Math.round(outputs.b.level * 100)}% | Filter bus {mixer.channelB.filterBus}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
