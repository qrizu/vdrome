import React, { useMemo, useRef, useState } from "react";
import mixerBg from "../assets/image/vechnics/mixer-vone92.png";
import knobType1Img from "../assets/image/vechnics/mixer-knobtype1.png";
import knobType2Img from "../assets/image/vechnics/mixer-knobtype2.png";
import faderMicImg from "../assets/image/vechnics/mixer-knob-slider-vertiocal-micchannels.png";
import faderChannelImg from "../assets/image/vechnics/mixer-knob-slider-vertiocal-channel.png";
import faderHorizontalImg from "../assets/image/vechnics/mixer-knob-fader-horisontal.png";

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

const KNOB_START_DEG = -145;
const KNOB_SWEEP_DEG = 290;
const BUTTON_Y_SHIFT = 0;
const KNOB_OFFSET_X = 0;
const KNOB_OFFSET_Y = 0;
const KNOB_SCALE_TYPE1 = 1.12;
const KNOB_SCALE_TYPE2 = 1.0;

function HotKnob({ id, value, onChange, x, y, s = 5.2, type = "type1" }) {
  const deg = KNOB_START_DEG + value * KNOB_SWEEP_DEG;
  const knobSrc = type === "type2" ? knobType2Img : knobType1Img;
  const scale = type === "type2" ? KNOB_SCALE_TYPE2 : KNOB_SCALE_TYPE1;
  const renderSize = s * scale;
  const left = x + KNOB_OFFSET_X;
  const top = y + KNOB_OFFSET_Y;
  return (
    <label className="x92-hot-knob" style={{ left: `${left}%`, top: `${top}%`, width: `${renderSize}%` }} htmlFor={id}>
      <img className="x92-knob-sprite" src={knobSrc} alt="" draggable="false" style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }} />
      <input id={id} type="range" min="0" max="1" step="0.001" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function HotFader({ id, value, onChange, x, y, w, h, horizontal = false, thumb = "channel", travelMin = 0, travelMax = 100 }) {
  const travel = Math.max(0, travelMax - travelMin);
  const norm = horizontal ? value : 1 - value;
  const thumbPos = `${travelMin + norm * travel}%`;
  const thumbSrc = horizontal ? faderHorizontalImg : (thumb === "mic" ? faderMicImg : faderChannelImg);
  const thumbCls = horizontal ? "h" : (thumb === "mic" ? "mic" : "channel");
  const inputStyle = horizontal
    ? { left: `${travelMin}%`, top: "0%", width: `${travel}%`, height: "100%" }
    : { left: "0%", top: `${travelMin}%`, width: "100%", height: `${travel}%` };
  return (
    <label className={`x92-hot-fader ${horizontal ? "h" : "v"}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} htmlFor={id}>
      <img className={`x92-fader-thumb ${thumbCls}`} src={thumbSrc} alt="" draggable="false" style={horizontal ? { left: thumbPos } : { top: thumbPos }} />
      <input id={id} style={inputStyle} type="range" min="0" max="1" step="0.001" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function HotBtn({ id, active, onClick, x, y, w, h, text }) {
  const activeColor = (id.includes("hpf") || id.includes("bpf") || id.includes("lpf"))
    ? "yellow"
    : id.includes("phono")
      ? "green"
      : id.includes("-xf")
        ? "yellow"
      : "red";
  return (
    <button type="button" id={id} className={`x92-hot-btn ${active ? `active active-${activeColor}` : ""}`} style={{ left: `${x}%`, top: `${y + BUTTON_Y_SHIFT}%`, width: `${w}%`, height: `${h}%` }} onClick={onClick}>
      {text}
    </button>
  );
}

function HotLed({ active, x, y, color = "red", s = 0.72 }) {
  return <span className={`x92-led ${color} ${active ? "on" : ""}`} style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, height: `${s}%` }} aria-hidden="true" />;
}

export default function Vone92({ mixer, output, clock, onMixerUpdate, onChannelUpdate }) {
  const showHitAreas = false;
  const [localKnobs, setLocalKnobs] = useState({});
  const [localFaders, setLocalFaders] = useState({});
  const [localButtons, setLocalButtons] = useState({});
  const tapRef = useRef({ flt1: 0, flt2: 0 });

  const knobDefs = useMemo(
    () => [
      { id: "mic1-aux1", x: 7.23, y: 10.31, s: 5.07, type: "type1" }, { id: "mic2-aux1", x: 14.38, y: 10.17, s: 4.81, type: "type1" },
      { id: "mic1-aux2", x: 7.05, y: 17.18, s: 4.94, type: "type1" }, { id: "mic2-aux2", x: 14.44, y: 17.02, s: 4.94, type: "type1" },
      { id: "mic1-level", x: 7.28, y: 27.08, s: 4.68, type: "type1" }, { id: "mic2-level", x: 14.55, y: 27.20, s: 4.42, type: "type1" },
      { id: "mic1-hi", x: 6.98, y: 32.27, s: 4.42, type: "type2" }, { id: "mic2-hi", x: 14.55, y: 32.17, s: 3.77, type: "type2" },
      { id: "mic1-hm", x: 6.78, y: 37.43, s: 4.03, type: "type2" }, { id: "mic2-hm", x: 14.53, y: 37.54, s: 4.68, type: "type2" },
      { id: "mic1-lm", x: 7.19, y: 42.46, s: 4.42, type: "type2" }, { id: "mic2-lm", x: 14.29, y: 42.63, s: 4.16, type: "type2" },
      { id: "mic1-lo", x: 7.19, y: 47.76, s: 4.94, type: "type2" }, { id: "mic2-lo", x: 14.80, y: 47.69, s: 4.42, type: "type2" },

      { id: "ch1-aux1", x: 34.47, y: 10.39, s: 4.81, type: "type1" }, { id: "ch2-aux1", x: 45.52, y: 10.14, s: 4.68, type: "type1" }, { id: "ch3-aux1", x: 56.73, y: 9.98, s: 4.42, type: "type1" }, { id: "ch4-aux1", x: 67.69, y: 10.10, s: 4.68, type: "type1" },
      { id: "ch1-aux2", x: 34.56, y: 17.35, s: 4.16, type: "type1" }, { id: "ch2-aux2", x: 45.91, y: 17.31, s: 4.03, type: "type1" }, { id: "ch3-aux2", x: 56.67, y: 17.22, s: 3.90, type: "type1" }, { id: "ch4-aux2", x: 67.65, y: 17.33, s: 4.16, type: "type1" },
      { id: "ch1-level", x: 34.70, y: 27.38, s: 4.81, type: "type1" }, { id: "ch2-gain", x: 45.66, y: 27.28, s: 4.42, type: "type1" }, { id: "ch3-gain", x: 56.59, y: 27.25, s: 4.42, type: "type1" }, { id: "ch4-level", x: 67.60, y: 27.22, s: 4.42, type: "type1" },
      { id: "ch1-hf", x: 33.86, y: 32.63, s: 4.94, type: "type2" }, { id: "ch2-hf", x: 44.53, y: 32.68, s: 4.68, type: "type2" }, { id: "ch3-hf", x: 55.53, y: 32.64, s: 4.94, type: "type2" }, { id: "ch4-hf", x: 66.21, y: 32.71, s: 4.68, type: "type2" },
      { id: "ch1-hmf", x: 34.02, y: 38.77, s: 4.81, type: "type2" }, { id: "ch2-hmf", x: 44.76, y: 38.79, s: 4.55, type: "type2" }, { id: "ch3-hmf", x: 55.41, y: 38.77, s: 4.55, type: "type2" }, { id: "ch4-hmf", x: 66.43, y: 38.68, s: 4.81, type: "type2" },
      { id: "ch1-lmf", x: 33.91, y: 44.86, s: 4.81, type: "type2" }, { id: "ch2-lmf", x: 44.45, y: 44.94, s: 4.42, type: "type2" }, { id: "ch3-lmf", x: 55.39, y: 44.75, s: 4.68, type: "type2" }, { id: "ch4-lmf", x: 66.35, y: 44.94, s: 4.68, type: "type2" },
      { id: "ch1-lf", x: 34.01, y: 51.05, s: 4.42, type: "type2" }, { id: "ch2-lf", x: 44.80, y: 51.03, s: 4.29, type: "type2" }, { id: "ch3-lf", x: 55.40, y: 50.98, s: 4.55, type: "type2" }, { id: "ch4-lf", x: 66.28, y: 51.01, s: 4.55, type: "type2" },

      { id: "flt1-lfo", x: 24.19, y: 27.44, s: 5.20, type: "type2" }, { id: "flt2-lfo", x: 78.58, y: 27.16, s: 5.33, type: "type2" },
      { id: "flt1-res", x: 24.38, y: 50.98, s: 4.68, type: "type2" }, { id: "flt2-res", x: 78.21, y: 51.15, s: 5.20, type: "type2" },
      { id: "flt1-freq", x: 23.98, y: 87.23, s: 4.81, type: "type2" }, { id: "flt2-freq", x: 78.35, y: 87.32, s: 5.33, type: "type2" },

      { id: "mast-master", x: 90.64, y: 31.21, s: 4.03, type: "type1" }, { id: "mast-booth", x: 90.62, y: 37.87, s: 4.29, type: "type1" },
      { id: "mon-cuemix", x: 90.30, y: 47.89, s: 4.55, type: "type1" }, { id: "mon-level", x: 90.88, y: 78.19, s: 4.42, type: "type1" },
    ],
    [],
  );

  const faderDefs = useMemo(
    () => [
      { id: "mic1-fader", x: 5.27, y: 63.8, w: 3.4, h: 22.3, thumb: "mic", tmin: 15, tmax: 94 },
      { id: "mic2-fader", x: 12.62, y: 63.8, w: 3.4, h: 22.3, thumb: "mic", tmin: 15, tmax: 94 },
      { id: "ch1-fader", x: 34.18, y: 63.2, w: 3.9, h: 25.4, thumb: "channel", tmin: 12, tmax: 95 },
      { id: "ch2-fader", x: 45.14, y: 63.2, w: 3.9, h: 25.4, thumb: "channel", tmin: 12, tmax: 95 },
      { id: "ch3-fader", x: 56.17, y: 63.2, w: 3.9, h: 25.4, thumb: "channel", tmin: 12, tmax: 95 },
      { id: "ch4-fader", x: 67.20, y: 63.2, w: 3.9, h: 25.4, thumb: "channel", tmin: 12, tmax: 95 },
      { id: "xfader", x: 35.08, y: 91.9, w: 24.8, h: 4.4, hzd: true, thumb: "horizontal", tmin: 8, tmax: 92 },
    ],
    [],
  );

  const buttonDefs = useMemo(
    () => [
      { id: "mic1-sw", x: 5.05, y: 24.45, w: 4.45, h: 2.55, txt: "S" },
      { id: "mic2-sw", x: 12.32, y: 24.45, w: 4.45, h: 2.55, txt: "S" },
      { id: "mic1-cue", x: 5.90, y: 52.95, w: 3.10, h: 2.25, txt: "CUE" },
      { id: "mic2-cue", x: 13.20, y: 52.95, w: 3.10, h: 2.25, txt: "CUE" },

      { id: "ch1-phono", x: 33.25, y: 24.45, w: 4.55, h: 2.55, txt: "P" },
      { id: "ch2-phono", x: 44.30, y: 24.45, w: 4.55, h: 2.55, txt: "P" },
      { id: "ch3-phono", x: 55.35, y: 24.45, w: 4.55, h: 2.55, txt: "P" },
      { id: "ch4-phono", x: 66.40, y: 24.45, w: 4.55, h: 2.55, txt: "P" },
      { id: "mast-startstop", x: 80.95, y: 15.55, w: 4.35, h: 4.35, txt: "SS" },

      { id: "flt1-lfoon", x: 22.95, y: 37.65, w: 2.75, h: 2.05, txt: "ON" },
      { id: "flt1-x2", x: 22.95, y: 44.75, w: 2.75, h: 2.05, txt: "X2" },
      { id: "flt2-lfoon", x: 76.95, y: 37.65, w: 2.75, h: 2.05, txt: "ON" },
      { id: "flt2-x2", x: 76.95, y: 44.75, w: 2.75, h: 2.05, txt: "X2" },
      { id: "flt1-tap", x: 21.95, y: 40.45, w: 4.95, h: 4.95, txt: "TAP" },
      { id: "flt2-tap", x: 76.10, y: 40.45, w: 4.95, h: 4.95, txt: "TAP" },

      { id: "ch1-xf1", x: 33.45, y: 58.10, w: 1.45, h: 1.95, txt: "X" },
      { id: "ch1-xf0", x: 34.75, y: 58.10, w: 1.45, h: 1.95, txt: "O" },
      { id: "ch1-xf2", x: 36.05, y: 58.10, w: 1.45, h: 1.95, txt: "Y" },
      { id: "ch2-xf1", x: 44.85, y: 58.10, w: 1.45, h: 1.95, txt: "X" },
      { id: "ch2-xf0", x: 46.15, y: 58.10, w: 1.45, h: 1.95, txt: "O" },
      { id: "ch2-xf2", x: 47.45, y: 58.10, w: 1.45, h: 1.95, txt: "Y" },
      { id: "ch3-xf1", x: 56.25, y: 58.10, w: 1.45, h: 1.95, txt: "X" },
      { id: "ch3-xf0", x: 57.55, y: 58.10, w: 1.45, h: 1.95, txt: "O" },
      { id: "ch3-xf2", x: 58.85, y: 58.10, w: 1.45, h: 1.95, txt: "Y" },
      { id: "ch4-xf1", x: 67.65, y: 58.10, w: 1.45, h: 1.95, txt: "X" },
      { id: "ch4-xf0", x: 68.95, y: 58.10, w: 1.45, h: 1.95, txt: "O" },
      { id: "ch4-xf2", x: 70.25, y: 58.10, w: 1.45, h: 1.95, txt: "Y" },

      { id: "ch1-cue", x: 31.55, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch2-cue", x: 42.95, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch3-cue", x: 54.35, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },
      { id: "ch4-cue", x: 65.75, y: 61.15, w: 6.0, h: 2.05, txt: "CUE" },

      { id: "ch1-vcf1", x: 33.45, y: 55.80, w: 1.45, h: 1.95, txt: "1" },
      { id: "ch1-vcf0", x: 34.75, y: 55.80, w: 1.45, h: 1.95, txt: "0" },
      { id: "ch1-vcf2", x: 36.05, y: 55.80, w: 1.45, h: 1.95, txt: "2" },
      { id: "ch2-vcf1", x: 44.85, y: 55.80, w: 1.45, h: 1.95, txt: "1" },
      { id: "ch2-vcf0", x: 46.15, y: 55.80, w: 1.45, h: 1.95, txt: "0" },
      { id: "ch2-vcf2", x: 47.45, y: 55.80, w: 1.45, h: 1.95, txt: "2" },
      { id: "ch3-vcf1", x: 56.25, y: 55.80, w: 1.45, h: 1.95, txt: "1" },
      { id: "ch3-vcf0", x: 57.55, y: 55.80, w: 1.45, h: 1.95, txt: "0" },
      { id: "ch3-vcf2", x: 58.85, y: 55.80, w: 1.45, h: 1.95, txt: "2" },
      { id: "ch4-vcf1", x: 67.65, y: 55.80, w: 1.45, h: 1.95, txt: "1" },
      { id: "ch4-vcf0", x: 68.95, y: 55.80, w: 1.45, h: 1.95, txt: "0" },
      { id: "ch4-vcf2", x: 70.25, y: 55.80, w: 1.45, h: 1.95, txt: "2" },

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

      { id: "mast-posteq", x: 86.25, y: 55.85, w: 8.95, h: 2.05, txt: "POST" },
      { id: "mast-splitcue", x: 86.25, y: 58.95, w: 8.95, h: 2.05, txt: "SPLIT" },
      { id: "mast-aux1", x: 86.25, y: 62.05, w: 8.95, h: 2.05, txt: "AUX1" },
      { id: "mast-aux2", x: 86.25, y: 65.15, w: 8.95, h: 2.05, txt: "AUX2" },
      { id: "mast-mono", x: 87.65, y: 44.70, w: 3.25, h: 2.15, txt: "MONO" },
      { id: "mast-mute", x: 87.65, y: 49.30, w: 3.25, h: 2.15, txt: "MUTE" },
    ],
    [],
  );

  const ledDefs = useMemo(
    () => [
      { from: "mic1-sw", x: 7.05, y: 26.75, c: "green", s: 0.58 },
      { from: "mic2-sw", x: 14.35, y: 26.75, c: "green", s: 0.58 },
      { from: "mic1-cue", x: 7.20, y: 54.55, c: "red", s: 0.60 },
      { from: "mic2-cue", x: 14.50, y: 54.55, c: "red", s: 0.60 },
      { from: "ch1-phono", x: 35.90, y: 26.80, c: "red", s: 0.58 },
      { from: "ch2-phono", x: 46.80, y: 26.80, c: "red", s: 0.58 },
      { from: "ch3-phono", x: 57.70, y: 26.80, c: "red", s: 0.58 },
      { from: "ch4-phono", x: 68.60, y: 26.80, c: "red", s: 0.58 },
      { from: "mast-startstop", x: 83.1, y: 19.05, c: "red", s: 0.72 },
      { from: "flt1-lfoon", x: 24.3, y: 38.8, c: "red", s: 0.64 },
      { from: "flt1-x2", x: 24.3, y: 45.9, c: "red", s: 0.64 },
      { from: "flt2-lfoon", x: 78.5, y: 38.8, c: "red", s: 0.64 },
      { from: "flt2-x2", x: 78.5, y: 45.9, c: "red", s: 0.64 },
      { from: "flt1-tap", x: 22.95, y: 42.85, c: "red", s: 0.66 },
      { from: "flt2-tap", x: 77.2, y: 42.85, c: "red", s: 0.66 },

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

      { from: "ch1-xf1", x: 34.18, y: 58.95, c: "green", s: 0.54 },
      { from: "ch1-xf0", x: 35.48, y: 58.95, c: "amber", s: 0.54 },
      { from: "ch1-xf2", x: 36.78, y: 58.95, c: "green", s: 0.54 },
      { from: "ch2-xf1", x: 45.58, y: 58.95, c: "green", s: 0.54 },
      { from: "ch2-xf0", x: 46.88, y: 58.95, c: "amber", s: 0.54 },
      { from: "ch2-xf2", x: 48.18, y: 58.95, c: "green", s: 0.54 },
      { from: "ch3-xf1", x: 56.98, y: 58.95, c: "green", s: 0.54 },
      { from: "ch3-xf0", x: 58.28, y: 58.95, c: "amber", s: 0.54 },
      { from: "ch3-xf2", x: 59.58, y: 58.95, c: "green", s: 0.54 },
      { from: "ch4-xf1", x: 68.38, y: 58.95, c: "green", s: 0.54 },
      { from: "ch4-xf0", x: 69.68, y: 58.95, c: "amber", s: 0.54 },
      { from: "ch4-xf2", x: 70.98, y: 58.95, c: "green", s: 0.54 },

      { from: "ch1-cue", x: 37.5, y: 62.1, c: "red", s: 0.72 },
      { from: "ch2-cue", x: 48.9, y: 62.1, c: "red", s: 0.72 },
      { from: "ch3-cue", x: 60.3, y: 62.1, c: "red", s: 0.72 },
      { from: "ch4-cue", x: 71.7, y: 62.1, c: "red", s: 0.72 },

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

      { from: "mast-cueactive", x: 95.0, y: 53.8, c: "red", s: 0.72 },
      { from: "mast-posteq", x: 95.0, y: 56.9, c: "red", s: 0.72 },
      { from: "mast-splitcue", x: 95.0, y: 60.0, c: "red", s: 0.72 },
      { from: "mast-aux1", x: 95.0, y: 63.1, c: "red", s: 0.72 },
      { from: "mast-aux2", x: 95.0, y: 66.2, c: "red", s: 0.72 },
      { from: "mast-mute", x: 87.95, y: 49.95, c: "red", s: 0.66 },
    ],
    [],
  );

  const mappedKnobGet = (id) => {
    if (id === "ch2-aux1") return mixer.channelA.aux1;
    if (id === "ch2-aux2") return mixer.channelA.aux2;
    if (id === "ch3-aux1") return mixer.channelB.aux1;
    if (id === "ch3-aux2") return mixer.channelB.aux2;
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
    if (id === "flt1-lfo") return mixer.filter1LfoDepth;
    if (id === "flt2-freq") return mixer.filter2Freq;
    if (id === "flt2-res") return mixer.filter2Res;
    if (id === "flt2-lfo") return mixer.filter2LfoDepth;
    if (id === "mast-master") return mixer.master;
    if (id === "mast-booth") return mixer.booth;
    if (id === "mon-cuemix") return mixer.monitorCueMix;
    if (id === "mon-level") return mixer.monitorLevel;
    return localKnobs[id] ?? 0.5;
  };

  const mappedKnobSet = (id, value) => {
    const v = clamp01(value);
    if (id === "ch2-aux1") return onChannelUpdate("A", { aux1: v });
    if (id === "ch2-aux2") return onChannelUpdate("A", { aux2: v });
    if (id === "ch3-aux1") return onChannelUpdate("B", { aux1: v });
    if (id === "ch3-aux2") return onChannelUpdate("B", { aux2: v });
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
    if (id === "flt1-lfo") return onMixerUpdate({ filter1LfoDepth: v });
    if (id === "flt2-freq") return onMixerUpdate({ filter2Freq: v });
    if (id === "flt2-res") return onMixerUpdate({ filter2Res: v });
    if (id === "flt2-lfo") return onMixerUpdate({ filter2LfoDepth: v });
    if (id === "mast-master") return onMixerUpdate({ master: v });
    if (id === "mast-booth") return onMixerUpdate({ booth: v });
    if (id === "mon-cuemix") return onMixerUpdate({ monitorCueMix: v });
    if (id === "mon-level") return onMixerUpdate({ monitorLevel: v });
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
    const pulse = (bpm, x2) => {
      const hz = (bpm / 60) * (x2 ? 2 : 1);
      return Math.sin(2 * Math.PI * hz * ((clock ?? 0) / 1000)) > 0;
    };
    const anyLocalCue = !!(localButtons["mic1-cue"] || localButtons["mic2-cue"] || localButtons["ch1-cue"] || localButtons["ch4-cue"]);
    const localBus1 = localButtons["ch1-vcf-bus"] ?? 0;
    const localBus4 = localButtons["ch4-vcf-bus"] ?? 0;
    const localXf1 = localButtons["ch1-xf-bus"] ?? 0;
    const localXf4 = localButtons["ch4-xf-bus"] ?? 0;
    const busA = mixer.channelA.filterBus ?? 0;
    const busB = mixer.channelB.filterBus ?? 0;
    const xfA = mixer.channelA.xfadeBus ?? 0;
    const xfB = mixer.channelB.xfadeBus ?? 0;

    if (id === "mic1-cue" || id === "mic2-cue" || id === "mic1-sw" || id === "mic2-sw") return !!localButtons[id];
    if (id === "ch1-phono" || id === "ch4-phono") return localButtons[id] ?? true;
    if (id === "ch2-phono") return mixer.channelA.inputSource === "phono";
    if (id === "ch3-phono") return mixer.channelB.inputSource === "phono";
    if (id === "mast-startstop") return !!mixer.midiRunning;
    if (id === "mast-posteq") return !!mixer.monitorPostEq;
    if (id === "mast-splitcue") return !!mixer.monitorSplitCue;
    if (id === "mast-aux1") return mixer.monitorSource === "aux1";
    if (id === "mast-aux2") return mixer.monitorSource === "aux2";
    if (id === "mast-mono") return !!mixer.monitorMono;
    if (id === "mast-mute") return !!mixer.monitorMute;
    if (id === "mast-cueactive") return !!(output.cueActive || anyLocalCue);

    if (id === "flt1-lfoon") return !!mixer.filter1LfoOn;
    if (id === "flt2-lfoon") return !!mixer.filter2LfoOn;
    if (id === "flt1-x2") return !!mixer.filter1LfoX2;
    if (id === "flt2-x2") return !!mixer.filter2LfoX2;
    if (id === "flt1-tap") return !!mixer.filter1LfoOn && pulse(mixer.filter1LfoBpm, mixer.filter1LfoX2);
    if (id === "flt2-tap") return !!mixer.filter2LfoOn && pulse(mixer.filter2LfoBpm, mixer.filter2LfoX2);

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
    if (id === "ch1-xf1") return localXf1 === -1;
    if (id === "ch1-xf0") return localXf1 === 0;
    if (id === "ch1-xf2") return localXf1 === 1;
    if (id === "ch2-xf1") return xfA === -1;
    if (id === "ch2-xf0") return xfA === 0;
    if (id === "ch2-xf2") return xfA === 1;
    if (id === "ch3-xf1") return xfB === -1;
    if (id === "ch3-xf0") return xfB === 0;
    if (id === "ch3-xf2") return xfB === 1;
    if (id === "ch4-xf1") return localXf4 === -1;
    if (id === "ch4-xf0") return localXf4 === 0;
    if (id === "ch4-xf2") return localXf4 === 1;

    if (id === "ch2-cue") return mixer.channelA.cue;
    if (id === "ch3-cue") return mixer.channelB.cue;
    if (id === "flt1-hpf") return !!mixer.filter1Modes.hpf;
    if (id === "flt1-bpf") return !!mixer.filter1Modes.bpf;
    if (id === "flt1-lpf") return !!mixer.filter1Modes.lpf;
    if (id === "flt2-hpf") return !!mixer.filter2Modes.hpf;
    if (id === "flt2-bpf") return !!mixer.filter2Modes.bpf;
    if (id === "flt2-lpf") return !!mixer.filter2Modes.lpf;
    return !!localButtons[id];
  };

  const mappedButtonSet = (id) => {
    if (id === "mast-cueactive") return;

    if (id === "mast-startstop") return onMixerUpdate({ midiRunning: !mixer.midiRunning });
    if (id === "mast-posteq") return onMixerUpdate({ monitorPostEq: !mixer.monitorPostEq });
    if (id === "mast-splitcue") return onMixerUpdate({ monitorSplitCue: !mixer.monitorSplitCue });
    if (id === "mast-aux1") return onMixerUpdate({ monitorSource: mixer.monitorSource === "aux1" ? "mix" : "aux1" });
    if (id === "mast-aux2") return onMixerUpdate({ monitorSource: mixer.monitorSource === "aux2" ? "mix" : "aux2" });
    if (id === "mast-mono") return onMixerUpdate({ monitorMono: !mixer.monitorMono });
    if (id === "mast-mute") return onMixerUpdate({ monitorMute: !mixer.monitorMute });

    if (id === "ch2-phono") return onChannelUpdate("A", { inputSource: mixer.channelA.inputSource === "phono" ? "line" : "phono" });
    if (id === "ch3-phono") return onChannelUpdate("B", { inputSource: mixer.channelB.inputSource === "phono" ? "line" : "phono" });
    if (id === "ch1-phono" || id === "ch4-phono" || id === "mic1-sw" || id === "mic2-sw" || id === "mic1-cue" || id === "mic2-cue") {
      return setLocalButtons((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    if (id === "flt1-lfoon") return onMixerUpdate({ filter1LfoOn: !mixer.filter1LfoOn });
    if (id === "flt2-lfoon") return onMixerUpdate({ filter2LfoOn: !mixer.filter2LfoOn });
    if (id === "flt1-x2") return onMixerUpdate({ filter1LfoX2: !mixer.filter1LfoX2 });
    if (id === "flt2-x2") return onMixerUpdate({ filter2LfoX2: !mixer.filter2LfoX2 });
    if (id === "flt1-tap" || id === "flt2-tap") {
      const now = performance.now();
      const key = id === "flt1-tap" ? "flt1" : "flt2";
      const prevTap = tapRef.current[key];
      tapRef.current[key] = now;
      const patch = key === "flt1" ? { filter1LfoOn: true } : { filter2LfoOn: true };
      if (prevTap > 0) {
        const dt = now - prevTap;
        if (dt > 150 && dt < 2000) {
          const bpm = Math.max(30, Math.min(300, 60000 / dt));
          if (key === "flt1") patch.filter1LfoBpm = bpm;
          if (key === "flt2") patch.filter2LfoBpm = bpm;
        }
      }
      return onMixerUpdate(patch);
    }

    if (id === "flt1-hpf" || id === "flt1-bpf" || id === "flt1-lpf") {
      const mode = id.split("-")[1];
      const next = { ...mixer.filter1Modes, [mode]: !mixer.filter1Modes[mode] };
      if (!next.hpf && !next.bpf && !next.lpf) next.lpf = true;
      return onMixerUpdate({ filter1Modes: next });
    }
    if (id === "flt2-hpf" || id === "flt2-bpf" || id === "flt2-lpf") {
      const mode = id.split("-")[1];
      const next = { ...mixer.filter2Modes, [mode]: !mixer.filter2Modes[mode] };
      if (!next.hpf && !next.bpf && !next.lpf) next.lpf = true;
      return onMixerUpdate({ filter2Modes: next });
    }

    if (id === "flt1-to1") return setLocalButtons((prev) => ({ ...prev, "flt1-to1": true, "flt1-to2": false }));
    if (id === "flt1-to2") return setLocalButtons((prev) => ({ ...prev, "flt1-to1": false, "flt1-to2": true }));
    if (id === "flt2-to1") return setLocalButtons((prev) => ({ ...prev, "flt2-to1": true, "flt2-to2": false }));
    if (id === "flt2-to2") return setLocalButtons((prev) => ({ ...prev, "flt2-to1": false, "flt2-to2": true }));

    if (id === "ch2-cue") return onChannelUpdate("A", { cue: !mixer.channelA.cue });
    if (id === "ch1-vcf1") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 1 }));
    if (id === "ch1-vcf0") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 0 }));
    if (id === "ch1-vcf2") return setLocalButtons((prev) => ({ ...prev, "ch1-vcf-bus": 2 }));
    if (id === "ch2-vcf1") return onChannelUpdate("A", { filterBus: 1 });
    if (id === "ch2-vcf0") return onChannelUpdate("A", { filterBus: 0 });
    if (id === "ch2-vcf2") return onChannelUpdate("A", { filterBus: 2 });
    if (id === "ch3-cue") return onChannelUpdate("B", { cue: !mixer.channelB.cue });
    if (id === "ch3-vcf1") return onChannelUpdate("B", { filterBus: 1 });
    if (id === "ch3-vcf0") return onChannelUpdate("B", { filterBus: 0 });
    if (id === "ch3-vcf2") return onChannelUpdate("B", { filterBus: 2 });
    if (id === "ch4-vcf1") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 1 }));
    if (id === "ch4-vcf0") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 0 }));
    if (id === "ch4-vcf2") return setLocalButtons((prev) => ({ ...prev, "ch4-vcf-bus": 2 }));
    if (id === "ch1-xf1") return setLocalButtons((prev) => ({ ...prev, "ch1-xf-bus": -1 }));
    if (id === "ch1-xf0") return setLocalButtons((prev) => ({ ...prev, "ch1-xf-bus": 0 }));
    if (id === "ch1-xf2") return setLocalButtons((prev) => ({ ...prev, "ch1-xf-bus": 1 }));
    if (id === "ch2-xf1") return onChannelUpdate("A", { xfadeBus: -1 });
    if (id === "ch2-xf0") return onChannelUpdate("A", { xfadeBus: 0 });
    if (id === "ch2-xf2") return onChannelUpdate("A", { xfadeBus: 1 });
    if (id === "ch3-xf1") return onChannelUpdate("B", { xfadeBus: -1 });
    if (id === "ch3-xf0") return onChannelUpdate("B", { xfadeBus: 0 });
    if (id === "ch3-xf2") return onChannelUpdate("B", { xfadeBus: 1 });
    if (id === "ch4-xf1") return setLocalButtons((prev) => ({ ...prev, "ch4-xf-bus": -1 }));
    if (id === "ch4-xf0") return setLocalButtons((prev) => ({ ...prev, "ch4-xf-bus": 0 }));
    if (id === "ch4-xf2") return setLocalButtons((prev) => ({ ...prev, "ch4-xf-bus": 1 }));
    if (id === "ch1-cue" || id === "ch4-cue") return setLocalButtons((prev) => ({ ...prev, [id]: !prev[id] }));
    setLocalButtons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ledActive = (id) => mappedButtonGet(id);
  const ledColor = (id, fallback) => {
    if (id === "mic1-sw" || id === "mic2-sw") {
      return mappedButtonGet(id) ? "red" : "green";
    }
    if (id === "ch1-phono" || id === "ch2-phono" || id === "ch3-phono" || id === "ch4-phono") {
      return mappedButtonGet(id) ? "green" : "red";
    }
    return fallback;
  };
  const ledAlwaysOn = (id) => id === "mic1-sw" || id === "mic2-sw" || id === "ch1-phono" || id === "ch2-phono" || id === "ch3-phono" || id === "ch4-phono";
  const activeByThreshold = (value, threshold = 0.12) => value > threshold;

  return (
    <section className="x92-wrap">
      <div className="x92-image" style={{ backgroundImage: `url(${mixerBg})` }}>
        {knobDefs.map((k) => (
          <HotKnob key={k.id} id={k.id} value={mappedKnobGet(k.id)} onChange={(v) => mappedKnobSet(k.id, v)} x={k.x} y={k.y} s={k.s ?? (k.type === "type2" ? 5.8 : 5.2)} type={k.type ?? "type1"} />
        ))}

        {faderDefs.map((f) => (
          <HotFader key={f.id} id={f.id} value={mappedFaderGet(f.id)} onChange={(v) => mappedFaderSet(f.id, v)} x={f.x} y={f.y} w={f.w} h={f.h} horizontal={!!f.hzd} thumb={f.thumb ?? "channel"} travelMin={f.tmin ?? 0} travelMax={f.tmax ?? 100} />
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
          <HotLed key={`${l.from}-${i}`} active={ledAlwaysOn(l.from) ? true : ledActive(l.from)} x={l.x} y={l.y} color={ledColor(l.from, l.c)} s={l.s} />
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
        <HotLed active={(mixer.channelA.filterBus ?? 0) !== 0} x={20.1} y={61.0} color="green" s={0.76} />
        <HotLed active={(mixer.channelB.filterBus ?? 0) !== 0} x={78.5} y={61.0} color="green" s={0.76} />

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
