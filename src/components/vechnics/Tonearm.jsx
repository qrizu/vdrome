import tonearm from "../../assets/image/vechnics/player-tonearm.png";

function Tonearm({
  mouseX = 0,
  mouseY = 0,
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
  let localX = 0;
  let localY = 0;

  if (isDragging && tonearmRef?.current) {
    const rect = tonearmRef.current.getBoundingClientRect();
    localX = mouseX - rect.left;
    localY = mouseY - rect.top;
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
          className={isDragging ? "cursor-grabbing" : className}
          style={{
            width: "186px",
            height: "898px",
            display: "block",
            maxWidth: "none",
            pointerEvents: "auto"
          }}
          alt="Tonearm"
        />
      </div>
    </>
  );
}

export default Tonearm;
