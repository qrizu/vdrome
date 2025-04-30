import { useRef, useState } from "react";
import background from "../assets/image/vechnics/player-background.png";
import platter from "../assets/image/vechnics/player-platter.png";
import tonearm from "../assets/image/vechnics/player-tonearm.png";
import startstop from "../assets/image/vechnics/player-startstop.png";
import rpm33 from "../assets/image/vechnics/player-rpm33.png";
import rpm45 from "../assets/image/vechnics/player-rpm45.png";
import pitchImage from "../assets/image/vechnics/player-pitch.png";
import redlight from "../assets/image/vechnics/player-redlight.png";
import knob from "../assets/image/vechnics/player-knob.png";
import reset from "../assets/image/vechnics/player-reset.png";
import speedx2 from "../assets/image/vechnics/player-speedx2.png";
import onoff from "../assets/image/vechnics/player-onoff.png";

function Vechnics({ side }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);
  const [tonearmAngle, setTonearmAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [originAngle, setOriginAngle] = useState(0);

  const [isPowered, setIsPowered] = useState(false);
  const [speed, setSpeed] = useState(33);
  const [isLightOn, setIsLightOn] = useState(false);
  const [pitch, setPitch] = useState(1);

  const tonearmRef = useRef(null);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!track || !isPowered) return;
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
    const rect = tonearmRef.current.getBoundingClientRect();
    const centerX = rect.left + 975;
    const centerY = rect.top + 206;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    return (angle * 180) / Math.PI;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartAngle(getAngle(e));
    setOriginAngle(tonearmAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTonearmAngle(0); // återställ till viloposition
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const current = getAngle(e);
    const delta = current - startAngle;
    const newAngle = originAngle + delta;
    const clamped = Math.max(-35, Math.min(35, newAngle));
    setTonearmAngle(clamped);
  };

  return (
    <div className="relative inline-block">
      <div className="relative w-[1154px] h-[898px]">
        {[background, platter, startstop, rpm33, rpm45, redlight, pitchImage, knob, reset, speedx2, onoff].map(
          (src, i) => (
            <img
              key={i}
              src={src}
              className={`absolute top-0 left-0 w-full h-full z-${i}`}
              alt="layer"
            />
          )
        )}

        {/* KLICKZONER */}
        <div onClick={togglePlay} title="Start/Stop"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "20px", top: "780px", width: "120px", height: "100px" }}>
          startstop
        </div>

        <div onClick={() => setIsPowered(p => !p)} title="Power"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "28px", top: "680px", width: "60px", height: "60px" }}>
          onoff
        </div>

        <div onClick={() => setSpeed(33)} title="33 RPM"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "153px", top: "840px", width: "50px", height: "30px" }}>
          33rpm
        </div>

        <div onClick={() => setSpeed(45)} title="45 RPM"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "217px", top: "840px", width: "50px", height: "30px" }}>
          45rpm
        </div>

        <div onClick={() => setIsLightOn(l => !l)} title="Strobe light"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "639px", top: "838px", width: "40px", height: "40px" }}>
          light
        </div>

        <div onClick={() => setPitch(p => Math.min(p + 0.05, 2))} title="Pitch Up"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "1048px", top: "610px", width: "50px", height: "50px" }}>
          pitch
        </div>

        <div onClick={() => setPitch(1)} title="Reset Pitch"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "964px", top: "700px", width: "40px", height: "40px" }}>
          res
        </div>

        <div onClick={() => setPitch(p => p * 2)} title="Double Pitch"
          className="absolute z-50 border border-pink-600 bg-pink-400/20 text-[10px] flex items-center justify-center cursor-pointer"
          style={{ left: "1045px", top: "420px", width: "50px", height: "25px" }}>
          x2
        </div>

        {/* TONEARM */}
        <img
          src={tonearm}
          ref={tonearmRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="absolute top-0 left-0 w-full h-full z-50 cursor-grab"
          style={{
            transform: `rotate(${tonearmAngle}deg)`,
            transformOrigin: "975px 206px",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          alt="Tonearm"
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center space-y-2">
        <button
          onClick={togglePlay}
          disabled={!track || !isPowered}
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
