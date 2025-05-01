import { useRef, useState } from "react";
import background from "../assets/image/vechnics/player-background.png";
import platter from "../assets/image/vechnics/player-platter.png";
import tonearm from "../assets/image/vechnics/player-tonearm.png";
import startstop from "../assets/image/vechnics/player-startstop.png";
import rpm33 from "../assets/image/vechnics/player-rpm33.png";
import rpm45 from "../assets/image/vechnics/player-rpm45.png";
import pitchImage from "../assets/image/vechnics/player-pitch.png";
import knob from "../assets/image/vechnics/player-knob.png";
import reset from "../assets/image/vechnics/player-reset.png";
import speedx2 from "../assets/image/vechnics/player-speedx2.png";
import onoff from "../assets/image/vechnics/player-onoff.png";

function Vechnics({ side, audioSettings }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);
  const [tonearmAngle, setTonearmAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [originAngle, setOriginAngle] = useState(0);

  const [isPowered, setIsPowered] = useState(false);
  const [speed, setSpeed] = useState(null);
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
    setTonearmAngle(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const current = getAngle(e);
    const delta = current - startAngle;
    const newAngle = originAngle + delta;
    const clamped = Math.max(-35, Math.min(35, newAngle));
    setTonearmAngle(clamped);
  };

  const handlePowerToggle = () => {
  console.log("✅ Power button clicked");
  const newPower = !isPowered;
  setIsPowered(newPower);

  if (newPower) {
    setTimeout(() => {
      setIsLightOn(true);
      setSpeed(33);
    }, 700); // wait for rotation to complete before lighting up
  } else {
    setIsLightOn(false);
    setTimeout(() => {
      setSpeed(null);
    }, 700); // delay stopping after rotation back
  }
};

  return (
    <div className="relative inline-block select-none">
      <div className="relative w-[1154px] h-[898px]">
        <img src={background} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" alt="background" />
          {isLightOn && (
  <div
    className="absolute z-1 pointer-events-none"
    style={{
      left: "77px",
      top: "701px",
      width: "240px",
      height: "240px",
      background: "conic-gradient(from 0deg at 0% 100%, rgba(255,0,0,0.45) 0deg, transparent 30deg)",
      transform: "rotate(135deg)",
      filter: "blur(12px)",
      mixBlendMode: "screen",
    }}
  />
)}
        <img src={platter} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" alt="platter" />
}
        <img src={startstop} className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none" alt="startstop" />
        <img src={pitchImage} className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none" alt="pitch" />
        <img src={knob} className="absolute top-0 left-0 w-full h-full z-40 pointer-events-none" alt="knob" />
        <img src={onoff} className={`absolute top-0 left-0 w-full h-full z-44 pointer-events-none transition-transform duration-700 ease-out ${isPowered ? 'rotate-[75deg]' : ''}`}
          style={{ transformOrigin: '54px 715px' }} alt="onoff" />
        
        {speed === 33 && <img src={rpm33} className="absolute top-0 left-0 w-full h-full z-47 pointer-events-none" alt="rpm33" />}
        {speed === 45 && <img src={rpm45} className="absolute top-0 left-0 w-full h-full z-47 pointer-events-none" alt="rpm45" />}

        {/* DEBUG ZONER */}
        <div onClick={handlePowerToggle} title="Power" className="absolute z-[99] cursor-pointer bg-red-500/30" style={{ left: "28px", top: "680px", width: "60px", height: "60px" }} />
        <div onClick={togglePlay} title="Start/Stop" className={`absolute z-[98] cursor-pointer bg-blue-500/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "20px", top: "780px", width: "120px", height: "100px" }} />
        <div onClick={() => setSpeed(33)} title="33 RPM" className={`absolute z-[97] cursor-pointer bg-yellow-500/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "153px", top: "840px", width: "50px", height: "30px" }} />
        <div onClick={() => setSpeed(45)} title="45 RPM" className={`absolute z-[97] cursor-pointer bg-yellow-300/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "217px", top: "840px", width: "50px", height: "30px" }} />
        <div onClick={() => setIsLightOn(l => !l)} title="Strobe light" className={`absolute z-[96] cursor-pointer bg-pink-500/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "639px", top: "838px", width: "40px", height: "40px" }} />
        <div onClick={() => setPitch(p => Math.min(p + 0.05, 2))} title="Pitch Up" className={`absolute z-[95] cursor-pointer bg-green-500/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "1048px", top: "610px", width: "50px", height: "50px" }} />
        <div onClick={() => setPitch(1)} title="Reset Pitch" className={`absolute z-[94] cursor-pointer bg-green-300/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "964px", top: "700px", width: "40px", height: "40px" }} />
        <div onClick={() => setPitch(p => p * 2)} title="Double Pitch" className={`absolute z-[93] cursor-pointer bg-purple-500/30 ${!isPowered ? "pointer-events-none opacity-50" : ""}`} style={{ left: "1045px", top: "420px", width: "50px", height: "25px" }} />

        <img
          src={tonearm}
          ref={tonearmRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="absolute top-0 left-0 w-full h-full z-[49] cursor-grab"
          style={{
            transform: `rotate(${tonearmAngle}deg)`,
            transformOrigin: "975px 206px",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          alt="Tonearm"
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center space-y-2">
        <button onClick={togglePlay} disabled={!track || !isPowered} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {isPlaying ? "Stop" : "Start"}
        </button>
        <label htmlFor="trackUpload" className="text-white text-sm">
          Ladda upp låt:
          <input id="trackUpload" name="trackUpload" type="file" accept="audio/*" onChange={handleLoadTrack} className="text-white block mt-1" />
        </label>
        {track && <audio ref={audioRef} src={track} />}
      </div>
    </div>
  );
}

export default Vechnics;
