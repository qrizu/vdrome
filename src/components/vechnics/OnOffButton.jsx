import onoff from "../../assets/image/vechnics/player-onoff.png";

function OnOffButton({ isPowered, togglePower }) {
  return (
    <div
      onClick={togglePower}
      title="Power"
      className="absolute z-50 cursor-pointer"
      style={{ left: "28px", top: "680px", width: "60px", height: "60px" }}
    >
      <img
        src={onoff}
        alt="Power Button"
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
}

export default OnOffButton;