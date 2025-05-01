// placeholder – du kan klistra in din Vechnics.jsx här så hjälper jag dig direkt
import { useRef, useState, useEffect } from "react";
import background from "../assets/image/vechnics/player-background.png";
import platter from "../assets/image/vechnics/player-platter.png";
import pitchImage from "../assets/image/vechnics/player-pitch.png";
import knob from "../assets/image/vechnics/player-knob.png";
import OnOffButton from "./vechnics/OnOffButton";
import StartStopButton from "./vechnics/StartStopButton";
import RPMButtons from "./vechnics/RPMButtons";
import PitchButtons from "./vechnics/PitchButtons";
import LightButtons from "./vechnics/LightButtons";
import Tonearm from "./vechnics/Tonearm";

function Vechnics({ side }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);
  const [tonearmAngle, setTonearmAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPowered, setIsPowered] = useState(false);
  const [speed, setSpeed] = useState(33);
  const [isLightOn, setIsLightOn] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rawAngle, setRawAngle] = useState(0);

  const tonearmRef = useRef(null);
  const audioRef = useRef(null);

  const isTonearmOnRecord = tonearmAngle > -35 && tonearmAngle < -5;

  const togglePlay = () => {
    if (!track || !isPowered || !isTonearmOnRecord) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadTrack = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTrack(url);
    }
  };

  const getAngle = (e) => {
    if (!tonearmRef.current) return 0;
    const rect = tonearmRef.current.getBoundingClientRect();
    const centerX = rect.left + 130;
    const centerY = rect.top + 209;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    return (angle * 180) / Math.PI;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
};

  const handleMouseUp = () => {
    setIsDragging(false);
    if (tonearmAngle < -20) {
      setTonearmAngle(0);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const angle = getAngle(e);
    const clamped = Math.max(-35, Math.min(35, angle));
    requestAnimationFrame(() => {
      setTonearmAngle(clamped);
      setRawAngle(angle);
    });
  };

  useEffect(() => {
    const updateMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  return (
    <div className="relative inline-block">
      <div className="relative w-[1154px] h-[898px]">
        {[background, platter, pitchImage, knob].map((src, i) => (
          <img
            key={i}
            src={src}
            className={`absolute top-0 left-0 w-full h-full z-${i} pointer-events-none`}
            alt="layer"
          />
        ))}

        <OnOffButton isPowered={isPowered} togglePower={() => setIsPowered((p) => !p)} />
        <StartStopButton togglePlay={togglePlay} />
        <RPMButtons setSpeed={setSpeed} />
        <PitchButtons setPitch={setPitch} />
        <LightButtons isLightOn={isLightOn} toggleLight={() => setIsLightOn(l => !l)} />

        <Tonearm
          tonearmRef={tonearmRef}
          tonearmAngle={tonearmAngle}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          animate={!isDragging}
        />
        
        {/* Raw angle overlay */}
        $1
        {/* Mouse position marker */}
        <div
          style={{
            position: "absolute",
            top: `${Math.round(window.event?.clientY ?? 0)}px`,
            left: `${Math.round(window.event?.clientX ?? 0)}px`,
            width: "8px",
            height: "8px",
            backgroundColor: "lime",
            borderRadius: "50%",
            zIndex: 9999,
            pointerEvents: "none"
          }}
        />

      </div>

      <div className="mt-4 flex flex-col items-center justify-center space-y-2">
        <button
          onClick={togglePlay}
          disabled={!track || !isPowered || !isTonearmOnRecord}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
        <input
          type="file"
          accept="audio/*"
          onChange={handleLoadTrack}
          className="text-white"
        />
        {track && <audio ref={audioRef} src={track} />}
      </div>
    </div>
  );
}

export default Vechnics;
