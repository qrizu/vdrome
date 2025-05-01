import tonearm from "../../assets/image/vechnics/player-tonearm.png";

function Tonearm({
  mouseX = 0,
  mouseY = 0,
  side = "left",
  tonearmRef,
  tonearmAngle,
  isDragging,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  className = "absolute z-50 cursor-grab",
  transformOrigin = "130px 209px",
  top = 0,
  left = 840,
  animate = true
}) {
  if (tonearmRef?.current) {
    const rect = tonearmRef.current.getBoundingClientRect();
    const centerX = rect.left + 93;
    const centerY = rect.top + 185;
  }

  return (
    <>
      <div
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          position: "absolute",
          top,
          left,
          width: "186px",
          height: "898px",
          transform: `rotate(${tonearmAngle}deg)`,
          transformOrigin,
          transition: !animate || isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          pointerEvents: "all",
          willChange: "transform"
        }}
      >
        <img
          src={tonearm}
          ref={tonearmRef}
          className={className}
          style={{
            width: "186px",
            height: "898px",
            display: "block",
            maxWidth: "none",
            pointerEvents: "auto"
          }}
          alt="Tonearm"
        />

        {/* Transform origin marker */}
        <div
          style={{
            position: "absolute",
            top: "209px",
            left: "130px",
            width: "8px",
            height: "8px",
            backgroundColor: "red",
            borderRadius: "50%",
            zIndex: 9999,
            pointerEvents: "none"
          }}
        />

        {/* Tonearm angle overlay */}
        <div className="absolute left-4 top-4 z-50 text-white bg-black/70 px-2 py-1 rounded text-sm font-mono">
          Angle: {tonearmAngle.toFixed(1)}°
        </div>

        {/* Mouse position marker (only while dragging) */}
        {isDragging && tonearmRef?.current && (() => {
          const rect = tonearmRef.current.getBoundingClientRect();
          const localX = mouseX - rect.left;
          const localY = mouseY - rect.top;
          return (
            <div
            style={{
              position: "absolute",
              top: "185px",
              left: "93px",
              width: "8px",
              height: "8px",
              backgroundColor: "blue",
              borderRadius: "50%",
              zIndex: 9999,
              pointerEvents: "none"
            }}
          />
          );
        })()}
        
      </div>
    </>
  );
}

export default Tonearm;
