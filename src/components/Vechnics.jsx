import React, { useEffect, useMemo, useRef, useState } from "react";
import playerBg from "../assets/image/vechnics/player-background.png";
import onOffImg from "../assets/image/vechnics/player-onoff.png";
import startStopImg from "../assets/image/vechnics/player-startstop.png";
import pitchImg from "../assets/image/vechnics/player-pitch.png";
import platterImg from "../assets/image/vechnics/player-platter.png";
import tonearmImg from "../assets/image/vechnics/player-tonearm.png";
import redActiveImg from "../assets/image/vechnics/player-redactive.png";

function ClickZone({ className, onClick, disabled, active, children }) {
  return (
    <button
      type="button"
      className={`click-zone ${className} ${active ? "active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function Vechnics({ title, side, deck, onUpdate, level }) {
  // Limit arm travel to realistic record arc: rest position -> near platter center.
  const TONEARM_ZERO = 0;
  const TONEARM_MIN = 0;
  const TONEARM_MAX = 54;

  const [rotation, setRotation] = useState(0);
  const [rpmNow, setRpmNow] = useState(0);
  const [tonearmAngle, setTonearmAngle] = useState(TONEARM_ZERO);
  const [tonearmDragging, setTonearmDragging] = useState(false);
  const rpmRef = useRef(0);
  const lastTs = useRef(performance.now());
  const deckRef = useRef(null);
  const draggingTonearm = useRef(false);
  const dragStart = useRef({ pointerDeg: 0, armDeg: TONEARM_ZERO });

  const TONEARM_PIVOT_X = 0.826;
  const TONEARM_PIVOT_Y = 0.232;
  const TONEARM_WIDTH = 185 / 1154;
  const TONEARM_ORIGIN_X = 0.53;

  const targetRpm = useMemo(() => {
    if (!deck.powerOn || !deck.playing) return 0;
    const base = deck.rpm;
    const pitchFactor = deck.resetLock ? 1 : 1 + (deck.pitch - 0.5) * 0.16;
    return base * pitchFactor * (deck.speedX2 ? 2 : 1);
  }, [deck]);

  useEffect(() => {
    let rafId;
    const tick = (ts) => {
      const dt = Math.max(0.001, (ts - lastTs.current) / 1000);
      lastTs.current = ts;
      const current = rpmRef.current;
      const accelerating = targetRpm > current;
      const tau = accelerating ? deck.startTime : deck.brakeTime;
      const lerp = 1 - Math.exp(-dt / Math.max(0.05, tau));
      const nextRpm = current + (targetRpm - current) * lerp;
      rpmRef.current = nextRpm;
      setRpmNow(nextRpm);
      setRotation((prev) => (prev + nextRpm * 6 * dt) % 360);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetRpm, deck.startTime, deck.brakeTime]);

  const disabled = !deck.powerOn;
  const pitchPercent = Math.round((deck.pitch - 0.5) * 16 * 10) / 10;

  const pointerAngle = (clientX, clientY) => {
    if (!deckRef.current) return 0;
    const rect = deckRef.current.getBoundingClientRect();
    const pivotX = rect.left + rect.width * TONEARM_PIVOT_X;
    const pivotY = rect.top + rect.height * TONEARM_PIVOT_Y;
    const dx = clientX - pivotX;
    const dy = clientY - pivotY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const normalizeDelta = (deg) => {
    let delta = deg;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingTonearm.current) return;
      const currentPointer = pointerAngle(e.clientX, e.clientY);
      const delta = normalizeDelta(currentPointer - dragStart.current.pointerDeg);
      const next = Math.max(TONEARM_MIN, Math.min(TONEARM_MAX, dragStart.current.armDeg + delta));
      setTonearmAngle(next);
    };
    const onUp = () => {
      draggingTonearm.current = false;
      setTonearmDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section className="deck-image-wrap">
      <header className="deck-headline">
        <h2>{title}</h2>
        <span>{rpmNow.toFixed(1)} RPM</span>
      </header>

      <div ref={deckRef} className="deck-image" style={{ backgroundImage: `url(${playerBg})` }}>
        <div
          className="platter-layer"
          style={{
            transform: `rotate(${rotation}deg)`,
            opacity: deck.powerOn ? 1 : 0.92,
          }}
        >
          <img src={platterImg} alt="platter" draggable={false} />
        </div>
        <div
          className={`tonearm-layer ${tonearmDragging ? "dragging" : ""}`}
          style={{
            width: `${TONEARM_WIDTH * 100}%`,
            left: `${(TONEARM_PIVOT_X - TONEARM_WIDTH * TONEARM_ORIGIN_X) * 100}%`,
            transformOrigin: `${TONEARM_ORIGIN_X * 100}% ${TONEARM_PIVOT_Y * 100}%`,
            transform: `rotate(${tonearmAngle}deg)`,
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            if (e.currentTarget.setPointerCapture) {
              e.currentTarget.setPointerCapture(e.pointerId);
            }
            draggingTonearm.current = true;
            setTonearmDragging(true);
            dragStart.current = {
              pointerDeg: pointerAngle(e.clientX, e.clientY),
              armDeg: tonearmAngle,
            };
          }}
        >
          <img src={tonearmImg} alt="tonearm" draggable={false} />
        </div>
        <ClickZone
          className="zone-onoff"
          active={deck.powerOn}
          onClick={() => onUpdate({ powerOn: !deck.powerOn, playing: deck.powerOn ? false : deck.playing })}
        >
          <img src={onOffImg} alt="on off" draggable={false} style={{ transform: deck.powerOn ? "rotate(36deg)" : "none" }} />
        </ClickZone>

        <ClickZone
          className="zone-startstop"
          active={deck.playing && deck.powerOn}
          disabled={disabled}
          onClick={() => onUpdate({ playing: !deck.playing })}
        >
          <img src={startStopImg} alt="start stop" draggable={false} />
        </ClickZone>

        <ClickZone
          className="zone-rpm33"
          active={deck.rpm === 33}
          disabled={disabled}
          onClick={() => onUpdate({ rpm: 33 })}
        />
        <ClickZone
          className="zone-rpm45"
          active={deck.rpm === 45}
          disabled={disabled}
          onClick={() => onUpdate({ rpm: 45 })}
        />
        <ClickZone
          className="zone-reset"
          active={deck.resetLock}
          disabled={disabled}
          onClick={() => onUpdate({ resetLock: !deck.resetLock })}
        />
        <ClickZone
          className="zone-x2"
          active={deck.speedX2}
          disabled={disabled}
          onClick={() => onUpdate({ speedX2: !deck.speedX2 })}
        />
        <ClickZone
          className="zone-light"
          active={deck.lightOn}
          disabled={disabled}
          onClick={() => onUpdate({ lightOn: !deck.lightOn })}
        />

        <label className="zone-pitch" htmlFor={`pitch-${side}`}>
          <img
            src={pitchImg}
            alt="pitch fader"
            draggable={false}
            style={{ top: `calc(${(1 - deck.pitch) * 84}%)` }}
          />
          <input
            id={`pitch-${side}`}
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={deck.pitch}
            disabled={disabled || deck.resetLock}
            onChange={(e) => onUpdate({ pitch: Number(e.target.value) })}
          />
        </label>

        {deck.powerOn && deck.lightOn && <div className="strobe-light" />}
        {deck.powerOn && deck.rpm === 33 && <img className="led led-33" src={redActiveImg} alt="33 active" />}
        {deck.powerOn && deck.rpm === 45 && <img className="led led-45" src={redActiveImg} alt="45 active" />}
        {deck.powerOn && deck.resetLock && <img className="led led-reset" src={redActiveImg} alt="reset active" />}
        {deck.powerOn && deck.speedX2 && <img className="led led-x2" src={redActiveImg} alt="x2 active" />}
      </div>

      <div className="deck-strip">
        <span>PITCH {pitchPercent > 0 ? `+${pitchPercent}` : pitchPercent}%</span>
        <span>START {deck.startTime.toFixed(1)}s</span>
        <input
          type="range"
          min="0.2"
          max="2.0"
          step="0.1"
          value={deck.startTime}
          onChange={(e) => onUpdate({ startTime: Number(e.target.value) })}
        />
        <span>BRAKE {deck.brakeTime.toFixed(1)}s</span>
        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.1"
          value={deck.brakeTime}
          onChange={(e) => onUpdate({ brakeTime: Number(e.target.value) })}
        />
      </div>

      <div className="deck-meter">
        <span>CH {side}</span>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
