// src/components/vechnics/RPMButtons.jsx
import rpm33 from "../../assets/image/vechnics/player-rpm33.png";
import rpm45 from "../../assets/image/vechnics/player-rpm45.png";

function RPMButtons({ setSpeed }) {
  return (
    <>
      <div
        onClick={() => setSpeed(33)}
        title="33 RPM"
        className="absolute z-50 cursor-pointer"
        style={{ left: "153px", top: "840px", width: "50px", height: "30px" }}
      >
        <img
          src={rpm33}
          alt="33 RPM"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      <div
        onClick={() => setSpeed(45)}
        title="45 RPM"
        className="absolute z-50 cursor-pointer"
        style={{ left: "217px", top: "840px", width: "50px", height: "30px" }}
      >
        <img
          src={rpm45}
          alt="45 RPM"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </>
  );
}

export default RPMButtons;