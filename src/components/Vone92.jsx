import React, { useMemo, useState } from "react";
import mixerBg from "../assets/image/vechnics/mixer-vone92.png";
import allKnobsPlacements from "../assets/image/vechnics/all-knobsplacements.png";

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

const KNOB_ANGLE_OFFSET = -250;
const BUTTON_Y_SHIFT = -0.45;

function HotKnob({ id, value, onChange, x, y, s = 5.2, type = "type1" }) {
  const deg = KNOB_ANGLE_OFFSET + value * 280;
  const _type = type;
  return (
    <label className="x92-hot-knob" style={{ left: `${x}%`, top: `${y}%`, width: `${s}%` }} htmlFor={id}>
      <span className="x92-knob-indicator" style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }} />
      <input id={id} type="range" min="0" max="1" step="0.001" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function HotFader({ id, value, onChange, x, y, w, h, horizontal = false, thumb = "mix" }) {
  const thumbPos = `${Math.round((horizontal ? value : 1 - value) * 100)}%`;
  const _thumb = thumb;
  return (
    <label className={`x92-hot-fader ${horizontal ? "h" : "v"}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} htmlFor={id}>
      <span className="x92-fader-indicator" style={horizontal ? { left: thumbPos } : { top: thumbPos }} />
      <input id={id} type="range" min="0" max="1" step="0.001" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function HotBtn({ id, active, onClick, x, y, w, h, text }) {
  const activeColor = id.includes("cue") ? "blue" : (id.includes("hpf") || id.includes("bpf") || id.includes("lpf") || id.includes("phono") || id.includes("-sw") || id.includes("vcf0") || id.includes("vcf1") || id.includes("vcf2")) ? "yellow" : "red";
  return (
    <button type="button" id={id} className={`x92-hot-btn ${active ? `active active-${activeColor}` : ""}`} style={{ left: `${x}%`, top: `${y + BUTTON_Y_SHIFT}%`, width: `${w}%`, height: `${h}%` }} onClick={onClick}>
      {text}
    </button>
  );
}

function HotLed({ active, x, y, color = "red", s = 0.72 }) {
  return <span className={`x92-led ${color} ${active ? "on" : ""}`} style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, height: `${s}%` }} aria-hidden="true" />;
}

export default function Vone92({ mixer, output, onMixerUpdate, onChannelUpdate }) {
  const showHitAreas = true;
  const [localKnobs, setLocalKnobs] = useState({});
  const [localFaders, setLocalFaders] = useState({});
  const [localButtons, setLocalButtons] = useState({});

  const knobDefs = useMemo(
    () => [
      { id: "mic1-aux1", x: 7.23, y: 10.31, s: 5.07, type: "type1" }, { id: "mic2-aux1", x: 14.38, y: 10.17, s: 4.81, type: "type1" },
      { id: "mic1-aux2", x: 7.05, y: 17.18, s: 4.94, type: "type1" }, { id: "mic2-aux2", x: 14.44, y: 17.02, s: 4.94, type: "type1" },
      { id: "mic1-level", x: 7.28, y: 27.08, s: 4.68, type: "type1" }, { id: "mic2-level", x: 14.55, y: 27.20, s: 4.42, type: "type1" },
      { id: "mic1-hi", x: 6.98, y: 32.27, s: 4.42, type: "type1" }, { id: "mic2-hi", x: 14.55, y: 32.17, s: 3.77, type: "type1" },
      { id: "mic1-hm", x: 6.78, y: 37.43, s: 4.03, type: "type1" }, { id: "mic2-hm", x: 14.53, y: 37.54, s: 4.68, type: "type1" },
      { id: "mic1-lm", x: 7.19, y: 42.46, s: 4.42, type: "type1" }, { id: "mic2-lm", x: 14.29, y: 42.63, s: 4.16, type: "type1" },
      { id: "mic1-lo", x: 7.19, y: 47.76, s: 4.94, type: "type1" }, { id: "mic2-lo", x: 14.80, y: 47.69, s: 4.42, type: "type1" },

      { id: "ch1-aux1", x: 34.47, y: 10.39, s: 4.81, type: "type1" }, { id: "ch2-aux1", x: 45.52, y: 10.14, s: 4.68, type: "type1" }, { id: "ch3-aux1", x: 56.73, y: 9.98, s: 4.42, type: "type1" }, { id: "ch4-aux1", x: 67.69, y: 10.10, s: 4.68, type: "type1" },
      { id: "ch1-aux2", x: 34.56, y: 17.35, s: 4.16, type: "type1" }, { id: "ch2-aux2", x: 45.91, y: 17.31, s: 4.03, type: "type1" }, { id: "ch3-aux2", x: 56.67, y: 17.22, s: 3.90, type: "type1" }, { id: "ch4-aux2", x: 67.65, y: 17.33, s: 4.16, type: "type1" },
      { id: "ch1-level", x: 34.70, y: 27.38, s: 4.81, type: "type1" }, { id: "ch2-gain", x: 45.66, y: 27.28, s: 4.42, type: "type1" }, { id: "ch3-gain", x: 56.59, y: 27.25, s: 4.42, type: "type1" }, { id: "ch4-level", x: 67.60, y: 27.22, s: 4.42, type: "type1" },
      { id: "ch1-hf", x: 33.86, y: 32.63, s: 4.94, type: "type1" }, { id: "ch2-hf", x: 44.53, y: 32.68, s: 4.68, type: "type1" }, { id: "ch3-hf", x: 55.53, y: 32.64, s: 4.94, type: "type1" }, { id: "ch4-hf", x: 66.21, y: 32.71, s: 4.68, type: "type1" },
      { id: "ch1-hmf", x: 34.02, y: 38.77, s: 4.81, type: "type1" }, { id: "ch2-hmf", x: 44.76, y: 38.79, s: 4.55, type: "type1" }, { id: "ch3-hmf", x: 55.41, y: 38.77, s: 4.55, type: "type1" }, { id: "ch4-hmf", x: 66.43, y: 38.68, s: 4.81, type: "type1" },
      { id: "ch1-lmf", x: 33.91, y: 44.86, s: 4.81, type: "type1" }, { id: "ch2-lmf", x: 44.45, y: 44.94, s: 4.42, type: "type1" }, { id: "ch3-lmf", x: 55.39, y: 44.75, s: 4.68, type: "type1" }, { id: "ch4-lmf", x: 66.35, y: 44.94, s: 4.68, type: "type1" },
      { id: "ch1-lf", x: 34.01, y: 51.05, s: 4.42, type: "type1" }, { id: "ch2-lf", x: 44.80, y: 51.03, s: 4.29, type: "type1" }, { id: "ch3-lf", x: 55.40, y: 50.98, s: 4.55, type: "type1" }, { id: "ch4-lf", x: 66.28, y: 51.01, s: 4.55, type: "type1" },

      { id: "flt1-lfo", x: 24.19, y: 27.44, s: 5.20, type: "type2" }, { id: "flt2-lfo", x: 78.58, y: 27.16, s: 5.33, type: "type2" },
      { id: "flt1-res", x: 24.38, y: 50.98, s: 4.68, type: "type2" }, { id: "flt2-res", x: 78.21, y: 51.15, s: 5.20, type: "type2" },
      { id: "flt1-freq", x: 23.98, y: 87.23, s: 4.81, type: "type2" }, { id: "flt2-freq", x: 78.35, y: 87.32, s: 5.33, type: "type2" },

      { id: "mast-master", x: 90.64, y: 31.21, s: 4.03, type: "type2" }, { id: "mast-booth", x: 90.62, y: 37.87, s: 4.29, type: "type2" },
      { id: "mon-cuemix", x: 90.30, y: 47.89, s: 4.55, type: "type2" }, { id: "mon-level", x: 90.88, y: 78.19, s: 4.42, type: "type2" },
    ],
    [],
  );

  const faderDefs = useMemo(
    () => [
      { id: "mic1-fader", x: 4.6, y: 63.9, w: 4.8, h: 22.0, thumb: "channel" },
      { id: "mic2-fader", x: 11.9, y: 63.9, w: 4.8, h: 22.0, thumb: "channel" },
      { id: "ch1-fader", x: 31.0, y: 63.4, w: 5.1, h: 25.2, thumb: "mix" },
      { id: "ch2-fader", x: 42.0, y: 63.4, w: 5.1, h: 25.2, thumb: "mix" },
      { id: "ch3-fader", x: 53.0, y: 63.4, w: 5.1, h: 25.2, thumb: "mix" },
      { id: "ch4-fader", x: 64.0, y: 63.4, w: 5.1, h: 25.2, thumb: "mix" },
      { id: "xfader", x: 37.1, y: 92.0, w: 26.5, h: 4.2, hzd: true, thumb: "mix" },
    ],
    [],
  );

  const buttonDefs = useMemo(
    () => [
      { id: "mic1-sw", x: 6.1, y: 25.8, w: 1.9, h: 1.9, txt: "S" },
      { id: "mic2-sw", x: 13.4, y: 25.8, w: 1.9, h: 1.9, txt: "S" },
      { id: "mic1-cue", x: 6.1, y: 53.7, w: 2.2, h: 2.0, txt: "CUE" },
      { id: "mic2-cue", x: 13.4, y: 53.7, w: 2.2, h: 2.0, txt: "CUE" },

      { id: "ch1-phono", x: 34.9, y: 25.8, w: 2.0, h: 2.0, txt: "P" },
      { id: "ch2-phono", x: 45.8, y: 25.8, w: 2.0, h: 2.0, txt: "P" },
      { id: "ch3-phono", x: 56.7, y: 25.8, w: 2.0, h: 2.0, txt: "P" },
      { id: "ch4-phono", x: 67.6, y: 25.8, w: 2.0, h: 2.0, txt: "P" },
      { id: "mast-startstop", x: 80.95, y: 15.55, w: 4.35, h: 4.35, txt: "SS" },

      { id: "flt1-lfoon", x: 22.95, y: 37.65, w: 2.75, h: 2.05, txt: "ON" },
      { id: "flt1-x2", x: 22.95, y: 44.75, w: 2.75, h: 2.05, txt: "X2" },
      { id: "flt2-lfoon", x: 76.95, y: 37.65, w: 2.75, h: 2.05, txt: "ON" },
      { id: "flt2-x2", x: 76.95, y: 44.75, w: 2.75, h: 2.05, txt: "X2" },

      { id: "ch1-vcf", x: 31.2, y: 58.15, w: 6.2, h: 2.05, txt: "VCF" },
      { id: "ch2-vcf", x: 42.6, y: 58.15, w: 6.2, h: 2.05, txt: "VCF" },
      { id: "ch3-vcf", x: 54.0, y: 58.15, w: 6.2, h: 2.05, txt: "VCF" },
      { id: "ch4-vcf", x: 65.4, y: 58.15, w: 6.2, h: 2.05, txt: "VCF" },

      { id: "ch1-cue", x: 31.55, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch2-cue", x: 42.95, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch3-cue", x: 54.35, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch4-cue", x: 65.75, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },

      { id: "ch1-vcf1", x: 33.65, y: 55.85, w: 1.05, h: 1.65, txt: "1" },
      { id: "ch1-vcf0", x: 34.95, y: 55.85, w: 1.05, h: 1.65, txt: "0" },
      { id: "ch1-vcf2", x: 36.25, y: 55.85, w: 1.05, h: 1.65, txt: "2" },
      { id: "ch2-vcf1", x: 45.05, y: 55.85, w: 1.05, h: 1.65, txt: "1" },
      { id: "ch2-vcf0", x: 46.35, y: 55.85, w: 1.05, h: 1.65, txt: "0" },
      { id: "ch2-vcf2", x: 47.65, y: 55.85, w: 1.05, h: 1.65, txt: "2" },
      { id: "ch3-vcf1", x: 56.45, y: 55.85, w: 1.05, h: 1.65, txt: "1" },
      { id: "ch3-vcf0", x: 57.75, y: 55.85, w: 1.05, h: 1.65, txt: "0" },
      { id: "ch3-vcf2", x: 59.05, y: 55.85, w: 1.05, h: 1.65, txt: "2" },
      { id: "ch4-vcf1", x: 67.85, y: 55.85, w: 1.05, h: 1.65, txt: "1" },
      { id: "ch4-vcf0", x: 69.15, y: 55.85, w: 1.05, h: 1.65, txt: "0" },
      { id: "ch4-vcf2", x: 70.45, y: 55.85, w: 1.05, h: 1.65, txt: "2" },

      { id: "flt1-hpf", x: 17.95, y: 69.05, w: 5.9, h: 2.55, txt: "HPF" },
      { id: "flt1-bpf", x: 17.95, y: 72.95, w: 5.9, h: 2.55, txt: "BPF" },
      { id: "flt1-lpf", x: 17.95, y: 76.85, w: 5.9, h: 2.55, txt: "LPF" },
      { id: "flt2-hpf", x: 75.95, y: 69.05, w: 5.9, h: 2.55, txt: "HPF" },
      { id: "flt2-bpf", x: 75.95, y: 72.95, w: 5.9, h: 2.55, txt: "BPF" },
      { id: "flt2-lpf", x: 75.95, y: 76.85, w: 5.9, h: 2.55, txt: "LPF" },
      { id: "flt1-to1", x: 24.5, y: 81.9, w: 3.3, h: 2.2, txt: "1" },
      { id: "flt1-to2", x: 24.5, y: 85.0, w: 3.3, h: 2.2, txt: "2" },
      { id: "flt2-to1", x: 78.7, y: 81.9, w: 3.3, h: 2.2, txt: "1" },
      { id: "flt2-to2", x: 78.7, y: 85.0, w: 3.3, h: 2.2, txt: "2" },

      { id: "mast-cueactive", x: 86.25, y: 52.75, w: 8.95, h: 2.05, txt: "CUE" },
      { id: "mast-posteq", x: 86.25, y: 55.85, w: 8.95, h: 2.05, txt: "POST" },
      { id: "mast-splitcue", x: 86.25, y: 58.95, w: 8.95, h: 2.05, txt: "SPLIT" },
      { id: "mast-aux1", x: 86.25, y: 62.05, w: 8.95, h: 2.05, txt: "AUX1" },
      { id: "mast-aux2", x: 86.25, y: 65.15, w: 8.95, h: 2.05, txt: "AUX2" },
    ],
    [],
  );

  const ledDefs = useMemo(
    () => [
      { from: "mic1-sw", x: 7.05, y: 26.75, c: "amber", s: 0.58 },
      { from: "mic2-sw", x: 14.35, y: 26.75, c: "amber", s: 0.58 },
      { from: "mic1-cue", x: 7.20, y: 54.55, c: "blue", s: 0.60 },
      { from: "mic2-cue", x: 14.50, y: 54.55, c: "blue", s: 0.60 },
      { from: "ch1-phono", x: 35.90, y: 26.80, c: "amber", s: 0.58 },
      { from: "ch2-phono", x: 46.80, y: 26.80, c: "amber", s: 0.58 },
      { from: "ch3-phono", x: 57.70, y: 26.80, c: "amber", s: 0.58 },
      { from: "ch4-phono", x: 68.60, y: 26.80, c: "amber", s: 0.58 },
      { from: "mast-startstop", x: 83.1, y: 19.05, c: "red", s: 0.72 },
      { from: "flt1-lfoon", x: 24.3, y: 38.8, c: "green", s: 0.64 },
      { from: "flt1-x2", x: 24.3, y: 45.9, c: "amber", s: 0.64 },
      { from: "flt2-lfoon", x: 78.5, y: 38.8, c: "green", s: 0.64 },
      { from: "flt2-x2", x: 78.5, y: 45.9, c: "amber", s: 0.64 },

      { from: "ch1-vcf1", x: 34.18, y: 56.65, c: "green", s: 0.54 },
      { from: "ch1-vcf0", x: 35.48, y: 56.65, c: "amber", s: 0.54 },
      { from: "ch1-vcf2", x: 36.78, y: 56.65, c: "green", s: 0.54 },
      { from: "ch2-vcf1", x: 45.58, y: 56.65, c: "green", s: 0.54 },
      { from: "ch2-vcf0", x: 46.88, y: 56.65, c: "amber", s: 0.54 },
      { from: "ch2-vcf2", x: 48.18, y: 56.65, c: "green", s: 0.54 },
      { from: "ch3-vcf1", x: 56.98, y: 56.65, c: "green", s: 0.54 },
      { from: "ch3-vcf0", x: 58.28, y: 56.65, c: "amber", s: 0.54 },
      { from: "ch3-vcf2", x: 59.58, y: 56.65, c: "green", s: 0.54 },
      { from: "ch4-vcf1", x: 68.38, y: 56.65, c: "green", s: 0.54 },
      { from: "ch4-vcf0", x: 69.68, y: 56.65, c: "amber", s: 0.54 },
      { from: "ch4-vcf2", x: 70.98, y: 56.65, c: "green", s: 0.54 },

      { from: "ch1-vcf", x: 37.8, y: 59.0, c: "green", s: 0.72 },
      { from: "ch2-vcf", x: 49.2, y: 59.0, c: "green", s: 0.72 },
      { from: "ch3-vcf", x: 60.6, y: 59.0, c: "green", s: 0.72 },
      { from: "ch4-vcf", x: 72.0, y: 59.0, c: "green", s: 0.72 },

      { from: "ch1-cue", x: 37.5, y: 62.1, c: "blue", s: 0.72 },
      { from: "ch2-cue", x: 48.9, y: 62.1, c: "blue", s: 0.72 },
      { from: "ch3-cue", x: 60.3, y: 62.1, c: "blue", s: 0.72 },
      { from: "ch4-cue", x: 71.7, y: 62.1, c: "blue", s: 0.72 },

      { from: "flt1-hpf", x: 23.55, y: 70.05, c: "amber", s: 0.72 },
      { from: "flt1-bpf", x: 23.55, y: 73.85, c: "amber", s: 0.72 },
      { from: "flt1-lpf", x: 23.55, y: 77.75, c: "amber", s: 0.72 },
      { from: "flt2-hpf", x: 81.75, y: 70.05, c: "amber", s: 0.72 },
      { from: "flt2-bpf", x: 81.75, y: 73.85, c: "amber", s: 0.72 },
      { from: "flt2-lpf", x: 81.75, y: 77.75, c: "amber", s: 0.72 },
      { from: "flt1-to1", x: 26.0, y: 83.0, c: "green", s: 0.64 },
      { from: "flt1-to2", x: 26.0, y: 86.1, c: "green", s: 0.64 },
      { from: "flt2-to1", x: 80.2, y: 83.0, c: "green", s: 0.64 },
      { from: "flt2-to2", x: 80.2, y: 86.1, c: "green", s: 0.64 },

      { from: "mast-cueactive", x: 95.0, y: 53.8, c: "blue", s: 0.72 },
      { from: "mast-posteq", x: 95.0, y: 56.9, c: "amber", s: 0.72 },
      { from: "mast-splitcue", x: 95.0, y: 60.0, c: "amber", s: 0.72 },
      { from: "mast-aux1", x: 95.0, y: 63.1, c: "green", s: 0.72 },
      { from: "mast-aux2", x: 95.0, y: 66.2, c: "green", s: 0.72 },
    ],
    [],
  );

  const mappedKnobGet = (id) => {
    if (id === "ch2-gain") return mixer.channelA.gain;
    if (id === "ch2-hf") return mixer.channelA.hf;
    if (id === "ch2-hmf") return mixer.channelA.hmf;
    if (id === "ch2-lmf") return mixer.channelA.lmf;
    if (id === "ch2-lf") return mixer.channelA.lf;
    if (id === "ch3-gain") return mixer.channelB.gain;
    if (id === "ch3-hf") return mixer.channelB.hf;
    if (id === "ch3-hmf") return mixer.channelB.hmf;
    if (id === "ch3-lmf") return mixer.channelB.lmf;
    if (id === "ch3-lf") return mixer.channelB.lf;
    if (id === "flt1-freq") return mixer.filter1Freq;
    if (id === "flt1-res") return mixer.filter1Res;
    if (id === "flt2-freq") return mixer.filter2Freq;
    if (id === "flt2-res") return mixer.filter2Res;
    if (id === "mast-master") return mixer.master;
    if (id === "mast-booth") return mixer.booth;
    return localKnobs[id] ?? 0.5;
  };

  const mappedKnobSet = (id, value) => {
    const v = clamp01(value);
    if (id === "ch2-gain") return onChannelUpdate("A", { gain: v });
    if (id === "ch2-hf") return onChannelUpdate("A", { hf: v });
    if (id === "ch2-hmf") return onChannelUpdate("A", { hmf: v });
    if (id === "ch2-lmf") return onChannelUpdate("A", { lmf: v });
    if (id === "ch2-lf") return onChannelUpdate("A", { lf: v });
    if (id === "ch3-gain") return onChannelUpdate("B", { gain: v });
    if (id === "ch3-hf") return onChannelUpdate("B", { hf: v });
    if (id === "ch3-hmf") return onChannelUpdate("B", { hmf: v });
    if (id === "ch3-lmf") return onChannelUpdate("B", { lmf: v });
    if (id === "ch3-lf") return onChannelUpdate("B", { lf: v });
    if (id === "flt1-freq") return onMixerUpdate({ filter1Freq: v });
    if (id === "flt1-res") return onMixerUpdate({ filter1Res: v });
    if (id === "flt2-freq") return onMixerUpdate({ filter2Freq: v });
    if (id === "flt2-res") return onMixerUpdate({ filter2Res: v });
    if (id === "mast-master") return onMixerUpdate({ master: v });
    if (id === "mast-booth") return onMixerUpdate({ booth: v });
    setLocalKnobs((prev) => ({ ...prev, [id]: v }));
  };

  const mappedFaderGet = (id) => {
    if (id === "ch2-fader") return mixer.channelA.volume;
    if (id === "ch3-fader") return mixer.channelB.volume;
    if (id === "xfader") return mixer.crossfader;
    return localFaders[id] ?? 0.5;
  };

  const mappedFaderSet = (id, value) => {
    const v = clamp01(value);
    if (id === "ch2-fader") return onChannelUpdate("A", { volume: v });
    if (id === "ch3-fader") return onChannelUpdate("B", { volume: v });
    if (id === "xfader") return onMixerUpdate({ crossfader: v });
    setLocalFaders((prev) => ({ ...prev, [id]: v }));
  };

  const mappedButtonGet = (id) => {
    const localBus1 = localButtons["ch1-vcf-bus"] ?? 0;
    const localBus4 = localButtons["ch4-vcf-bus"] ?? 0;
    const busA = mixer.channelA.filterOn ? mixer.channelA.filterBus : 0;
    const busB = mixer.channelB.filterOn ? mixer.channelB.filterBus : 0;

    if (id === "mic1-cue" || id === "mic2-cue" || id === "mic1-sw" || id === "mic2-sw") return !!localButtons[id];
    if (id === "mast-startstop") return !!localButtons[id];
    if (id === "flt1-lfoon" || id === "flt1-x2" || id === "flt2-lfoon" || id === "flt2-x2") return !!localButtons[id];
    if (id === "flt1-to1" || id === "flt1-to2" || id === "flt2-to1" || id === "flt2-to2") return !!localButtons[id];
    if (id === "ch1-vcf1") return localBus1 === 1;
    if (id === "ch1-vcf0") return localBus1 === 0;
    if (id === "ch1-vcf2") return localBus1 === 2;
    if (id === "ch2-vcf1") return busA === 1;
    if (id === "ch2-vcf0") return busA === 0;
    if (id === "ch2-vcf2") return busA === 2;
    if (id === "ch3-vcf1") return busB === 1;
    if (id === "ch3-vcf0") return busB === 0;
    if (id === "ch3-vcf2") return busB === 2;
    if (id === "ch4-vcf1") return localBus4 === 1;
    if (id === "ch4-vcf0") return localBus4 === 0;
    if (id === "ch4-vcf2") return localBus4 === 2;
    if (id === "ch2-vcf") return mixer.channelA.filterOn;
    if (id === "ch2-cue") return mixer.channelA.cue;
    if (id === "ch3-vcf") return mixer.channelB.filterOn;
    if (id === "ch3-cue") return mixer.channelB.cue;
    if (id === "flt1-hpf") return mixer.filter1Mode === "hpf";
    if (id === "flt1-bpf") return mixer.filter1Mode === "bpf";
    if (id === "flt1-lpf") return mixer.filter1Mode === "lpf";
    if (id === "flt2-hpf") return mixer.filter2Mode === "hpf";
    if (id === "flt2-bpf") return mixer.filter2Mode === "bpf";
    if (id === "flt2-lpf") return mixer.filter2Mode === "lpf";
    return !!localButtons[id];
  };

  const mappedButtonSet = (id) => {
    if (id === "flt1-to1") return setLocalButtons((prev) => ({ ...prev, "flt1-to1": true, "flt1-to2": false }));
    if (id === "flt1-to2") return setLocalButtons((prev) => ({ ...prev, "flt1-to1": false, "flt1-to2": true }));
    if (id === "flt2-to1") return setLocalButtons((prev) => ({ ...prev, "flt2-to1": true, "flt2-to2": false }));
    if (id === "flt2-to2") return setLocalButtons((prev) => ({ ...prev, "flt2-to1": false, "flt2-to2": true }));
    if (id === "ch2-vcf") return onChannelUpdate("A", { filterOn: !mixer.channelA.filterOn });
    if (id === "ch2-cue") return onChannelUpdate("A", { cue: !mixer.channelA.cue });
    if (id === "ch1-vcf1") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 1 }));
    if (id === "ch1-vcf0") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 0 }));
    if (id === "ch1-vcf2") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 2 }));
    if (id === "ch2-vcf1") return onChannelUpdate("A", { filterOn: true, filterBus: 1 });
    if (id === "ch2-vcf0") return onChannelUpdate("A", { filterOn: false, filterBus: 0 });
    if (id === "ch2-vcf2") return onChannelUpdate("A", { filterOn: true, filterBus: 2 });
    if (id === "ch3-vcf") return onChannelUpdate("B", { filterOn: !mixer.channelB.filterOn });
    if (id === "ch3-cue") return onChannelUpdate("B", { cue: !mixer.channelB.cue });
    if (id === "ch3-vcf1") return onChannelUpdate("B", { filterOn: true, filterBus: 1 });
    if (id === "ch3-vcf0") return onChannelUpdate("B", { filterOn: false, filterBus: 0 });
    if (id === "ch3-vcf2") return onChannelUpdate("B", { filterOn: true, filterBus: 2 });
    if (id === "ch4-vcf1") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 1 }));
    if (id === "ch4-vcf0") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 0 }));
    if (id === "ch4-vcf2") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 2 }));
    if (id === "flt1-hpf") return onMixerUpdate({ filter1Mode: "hpf" });
    if (id === "flt1-bpf") return onMixerUpdate({ filter1Mode: "bpf" });
    if (id === "flt1-lpf") return onMixerUpdate({ filter1Mode: "lpf" });
    if (id === "flt2-hpf") return onMixerUpdate({ filter2Mode: "hpf" });
    if (id === "flt2-bpf") return onMixerUpdate({ filter2Mode: "bpf" });
    if (id === "flt2-lpf") return onMixerUpdate({ filter2Mode: "lpf" });
    setLocalButtons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ledActive = (id) => mappedButtonGet(id);
  const activeByThreshold = (value, threshold = 0.12) => value > threshold;

  return (
    <section className="x92-wrap">
      <div className="x92-image" style={{ backgroundImage: `url(${mixerBg})` }}>
        <img className="x92-controls-layer" src={allKnobsPlacements} alt="" draggable="false" />

        {knobDefs.map((k) => (
          <HotKnob key={k.id} id={k.id} value={mappedKnobGet(k.id)} onChange={(v) => mappedKnobSet(k.id, v)} x={k.x} y={k.y} s={k.s ?? (k.type === "type2" ? 5.8 : 5.2)} type={k.type ?? "type1"} />
        ))}

        {faderDefs.map((f) => (
          <HotFader key={f.id} id={f.id} value={mappedFaderGet(f.id)} onChange={(v) => mappedFaderSet(f.id, v)} x={f.x} y={f.y} w={f.w} h={f.h} horizontal={!!f.hzd} thumb={f.thumb ?? "mix"} />
        ))}

        {buttonDefs.map((b) => (
          <HotBtn key={b.id} id={b.id} active={mappedButtonGet(b.id)} onClick={() => mappedButtonSet(b.id)} x={b.x} y={b.y} w={b.w} h={b.h} text={b.txt} />
        ))}

        {showHitAreas && knobDefs.map((k) => (
          <span key={`hit-k-${k.id}`} className="x92-hit-knob" style={{ left: `${k.x}%`, top: `${k.y}%`, width: `${k.s ?? (k.type === "type2" ? 5.8 : 5.2)}%` }} aria-hidden="true" />
        ))}

        {showHitAreas && faderDefs.map((f) => (
          <span key={`hit-f-${f.id}`} className={`x92-hit-fader ${f.hzd ? "h" : "v"}`} style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%` }} aria-hidden="true" />
        ))}

        {showHitAreas && buttonDefs.map((b) => (
          <span key={`hit-b-${b.id}`} className="x92-hit-btn" style={{ left: `${b.x}%`, top: `${b.y + BUTTON_Y_SHIFT}%`, width: `${b.w}%`, height: `${b.h}%` }} aria-hidden="true" />
        ))}

        {ledDefs.map((l, i) => (
          <HotLed key={`${l.from}-${i}`} active={ledActive(l.from)} x={l.x} y={l.y} color={l.c} s={l.s} />
        ))}

        <HotLed active={activeByThreshold(output.a.level)} x={39.7} y={90.6} color="green" s={0.76} />
        <HotLed active={activeByThreshold(output.a.level, 0.36)} x={39.7} y={88.8} color="amber" s={0.76} />
        <HotLed active={activeByThreshold(output.a.level, 0.68)} x={39.7} y={86.9} color="red" s={0.76} />
        <HotLed active={activeByThreshold(output.b.level)} x={53.9} y={90.6} color="green" s={0.76} />
        <HotLed active={activeByThreshold(output.b.level, 0.36)} x={53.9} y={88.8} color="amber" s={0.76} />
        <HotLed active={activeByThreshold(output.b.level, 0.68)} x={53.9} y={86.9} color="red" s={0.76} />
        <HotLed active={activeByThreshold(output.master)} x={89.0} y={21.0} color="green" s={0.72} />
        <HotLed active={activeByThreshold(output.booth)} x={90.9} y={21.0} color="blue" s={0.72} />
        <HotLed active={activeByThreshold(output.cue)} x={92.8} y={21.0} color="amber" s={0.72} />
        <HotLed active={mixer.crossfader < 0.45} x={35.6} y={95.1} color="blue" s={0.76} />
        <HotLed active={mixer.crossfader > 0.55} x={64.6} y={95.1} color="blue" s={0.76} />
        <HotLed active={mixer.channelA.filterOn} x={20.1} y={61.0} color="green" s={0.76} />
        <HotLed active={mixer.channelB.filterOn} x={78.5} y={61.0} color="green" s={0.76} />

        <div className="x92-vu" style={{ left: "40.1%", top: "64.0%" }}>
          <div className="x92-vu-fill" style={{ height: `${Math.round(output.a.level * 100)}%` }} />
        </div>
        <div className="x92-vu" style={{ left: "54.0%", top: "64.0%" }}>
          <div className="x92-vu-fill" style={{ height: `${Math.round(output.b.level * 100)}%` }} />
        </div>
        <div className="x92-vu" style={{ left: "90.0%", top: "9.5%", width: "1.6%", height: "10.4%" }}>
          <div className="x92-vu-fill master" style={{ height: `${Math.round(output.master * 100)}%` }} />
        </div>
        <div className="x92-vu" style={{ left: "92.1%", top: "9.5%", width: "1.6%", height: "10.4%" }}>
          <div className="x92-vu-fill booth" style={{ height: `${Math.round(output.booth * 100)}%` }} />
        </div>
        <div className="x92-vu" style={{ left: "94.2%", top: "9.5%", width: "1.6%", height: "10.4%" }}>
          <div className="x92-vu-fill cue" style={{ height: `${Math.round(output.cue * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
