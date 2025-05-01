// src/components/vechnics/LightButtons.jsx

function LightButtons({ isLightOn, toggleLight }) {
    return (
      <div
        onClick={toggleLight}
        title="Strobe light"
        className={`absolute z-50 cursor-pointer ${isLightOn ? "bg-red-500/40" : ""}`}
        style={{ left: "639px", top: "838px", width: "40px", height: "40px", borderRadius: "9999px" }}
      />
    );
  }
  
  export default LightButtons;