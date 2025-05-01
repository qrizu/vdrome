// src/components/vechnics/PitchButtons.jsx
import reset from "../../assets/image/vechnics/player-reset.png";
import speedx2 from "../../assets/image/vechnics/player-speedx2.png";

function PitchButtons({ setPitch }) {
  return (
    <>
      <div
        onClick={() => setPitch((p) => Math.min(p + 0.05, 2))}
        title="Pitch Up"
        className="absolute z-50 cursor-pointer"
        style={{ left: "1048px", top: "610px", width: "50px", height: "50px" }}
      />

      <div
        onClick={() => setPitch(1)}
        title="Reset Pitch"
        className="absolute z-50 cursor-pointer"
        style={{ left: "964px", top: "700px", width: "40px", height: "40px" }}
      >
        <img
          src={reset}
          alt="Reset Pitch"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      <div
        onClick={() => setPitch((p) => p * 2)}
        title="Double Pitch"
        className="absolute z-50 cursor-pointer"
        style={{ left: "1045px", top: "420px", width: "50px", height: "25px" }}
      >
        <img
          src={speedx2}
          alt="Double Pitch"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </>
  );
}

export default PitchButtons;
