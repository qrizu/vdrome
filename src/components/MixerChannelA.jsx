import MixerKnob from "./MixerKnob";

function MixerChannelA() {
  return (
    <div className="flex flex-col items-center gap-[0.6vh] w-[11vw] h-full text-white text-[0.5vw] font-mono">
      <MixerKnob label="LEVEL" color="gray" />
      <MixerKnob label="HI" color="blue" />
      <MixerKnob label="MID1" color="yellow" />
      <MixerKnob label="MID2" color="yellow" />
      <MixerKnob label="LOW" color="red" />

      {/* Volume fader */}
      <div className="flex flex-col items-center mt-2">
        <input type="range" min="0" max="1" step="0.01" className="rotate-[-90deg] h-[5vh]" />
        <span className="text-[0.4vw] mt-1">VOL</span>
      </div>

      {/* Filter buttons */}
      <div className="flex justify-between gap-1 mt-2">
        {["HPF", "BPF", "LPF"].map((type) => (
          <button key={type} className="bg-gray-600 text-white text-[0.5vw] px-1 py-0.5 rounded">
            {type}
          </button>
        ))}
      </div>

      {/* Frequency + Filter ON */}
      <div className="flex flex-col items-center mt-2">
        <MixerKnob label="FREQ" color="green" />
        <button className="bg-orange-600 text-white text-[0.5vw] px-2 py-1 rounded mt-1">
          FILTER ON
        </button>
      </div>
    </div>
  );
}

export default MixerChannelA;