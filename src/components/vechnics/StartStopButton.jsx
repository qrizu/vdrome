// src/components/vechnics/StartStopButton.jsx
import startstop from "../../assets/image/vechnics/player-startstop.png";

function StartStopButton({ togglePlay }) {
  return (
    <div
      onClick={togglePlay}
      title="Start/Stop"
      className="absolute z-50 cursor-pointer"
      style={{ left: "20px", top: "780px", width: "120px", height: "100px" }}
    >
      <img
        src={startstop}
        alt="Start/Stop Button"
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
}

export default StartStopButton;