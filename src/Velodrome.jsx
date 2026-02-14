import React, { useMemo, useState } from "react";
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
  hf: 0.5,
  hmf: 0.5,
  lmf: 0.5,
  lf: 0.5,
  volume: 0.8,
  filterOn: false,
  filterBus: 1,
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
  const [mixer, setMixer] = useState({
    channelA: defaultChannel,
    channelB: defaultChannel,
    crossfader: 0.5,
    master: 0.8,
    booth: 0.6,
    filter1Freq: 0.5,
    filter1Res: 0.35,
    filter1Mode: "lpf",
    filter2Freq: 0.5,
    filter2Res: 0.35,
    filter2Mode: "hpf",
  });

  const updateDeck = (side, patch) => {
    const setter = side === "A" ? setDeckA : setDeckB;
    setter((prev) => ({ ...prev, ...patch }));
  };

  const updateChannel = (side, patch) => {
    setMixer((prev) => {
      const channelKey = side === "A" ? "channelA" : "channelB";
      return {
        ...prev,
        [channelKey]: { ...prev[channelKey], ...patch },
      };
    });
  };

  const outputs = useMemo(() => {
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
      const fader = channel.volume ** 1.8;

      let filterShape = 1;
      if (channel.filterOn) {
        const bus = channel.filterBus === 2
          ? { freq: mixer.filter2Freq, res: mixer.filter2Res, mode: mixer.filter2Mode }
          : { freq: mixer.filter1Freq, res: mixer.filter1Res, mode: mixer.filter1Mode };
        const resShape = 0.8 + bus.res * 0.55;
        if (bus.mode === "hpf") filterShape = (0.25 + bus.freq * 0.75) * resShape;
        if (bus.mode === "bpf") filterShape = (0.5 + (1 - Math.abs(bus.freq - 0.5) * 2) * 0.5) * resShape;
        if (bus.mode === "lpf") filterShape = (1 - bus.freq * 0.65) * resShape;
      }

      const signal = normalizedSpeed * gain * eqShape * fader * filterShape;

      return {
        side,
        speed: targetRpm,
        level: clamp01(signal),
        cue: channel.cue ? clamp01(signal) : 0,
      };
    };

    const a = deckOutput(deckA, mixer.channelA, "A");
    const b = deckOutput(deckB, mixer.channelB, "B");
    const leftWeight = Math.cos((mixer.crossfader * Math.PI) / 2);
    const rightWeight = Math.sin((mixer.crossfader * Math.PI) / 2);
    const masterPre = a.level * leftWeight + b.level * rightWeight;
    const master = clamp01(masterPre * (mixer.master ** 1.6));
    const booth = clamp01(master * (mixer.booth ** 1.2));
    const cue = clamp01(Math.max(a.cue, b.cue));

    return { a, b, master, booth, cue };
  }, [deckA, deckB, mixer]);

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
