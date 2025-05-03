import { useState } from "react";

function MixerKnob({ label, initial = 0, onChange, color = "gray" }) {
  const [value, setValue] = useState(initial);

  const handleInput = (e) => {
    const val = parseFloat(e.target.value);
    setValue(val);
    if (onChange) onChange(val);
  };

  const rotation = -135 + (value + 1) * 135;

  const knobClass = `absolute w-full h-full rounded-full border-2 border-${color}-500`;
  const indicatorClass = `w-[6%] h-[50%] bg-${color}-500 absolute left-1/2 top-0 transform -translate-x-1/2 rounded`;

  return (
    <div className="flex flex-col items-center text-[0.5vw] w-[4vw]">
      <div className="relative w-[3vw] h-[3vw]">
        <div
          className={knobClass}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={indicatorClass} />
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={value}
          onChange={handleInput}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="mt-1">{label}</span>
    </div>
  );
}

export default MixerKnob;