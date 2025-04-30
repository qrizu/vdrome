import { useState } from "react";

function Vone92({ crossfade, setCrossfade, onUpdateChannels }) {
  const [channel1, setChannel1] = useState({
    high: 0,
    midHigh: 0,
    midLow: 0,
    low: 0,
    filter: "off",
    wetDry: 0.5,
  });

  const [channel2, setChannel2] = useState({
    high: 0,
    midHigh: 0,
    midLow: 0,
    low: 0,
    filter: "off",
    wetDry: 0.5,
  });

  const handleEqChange = (channel, setter, channelId) => (band) => (e) => {
    const updated = { ...channel, [band]: parseFloat(e.target.value) };
    setter(updated);
    if (onUpdateChannels) onUpdateChannels(channelId, updated);
  };

  const handleFilterChange = (channel, setter, channelId) => (e) => {
    const updated = { ...channel, filter: e.target.value };
    setter(updated);
    if (onUpdateChannels) onUpdateChannels(channelId, updated);
  };

  const handleWetDryChange = (channel, setter, channelId) => (e) => {
    const updated = { ...channel, wetDry: parseFloat(e.target.value) };
    setter(updated);
    if (onUpdateChannels) onUpdateChannels(channelId, updated);
  };

  const renderChannel = (channel, setter, label, channelId) => (
    <div className="w-full sm:w-[160px] bg-gray-700 p-2 rounded">
      <h3 className="text-sm text-center mb-2 font-bold">{label}</h3>
      {Object.entries(channel).filter(([k]) => !['filter', 'wetDry'].includes(k)).map(([band, value]) => (
        <div key={band} className="flex flex-col items-center mb-2">
          <label className="text-xs">{band.toUpperCase()}</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={value}
            onChange={handleEqChange(channel, setter, channelId)(band)}
            className="w-full"
          />
        </div>
      ))}
      <div className="flex flex-col items-center mb-2">
        <label className="text-xs">Filter</label>
        <select
          value={channel.filter}
          onChange={handleFilterChange(channel, setter, channelId)}
          className="w-full text-sm bg-gray-600 rounded"
        >
          <option value="off">Off</option>
          <option value="lpf">Low Pass</option>
          <option value="hpf">High Pass</option>
        </select>
      </div>
      <div className="flex flex-col items-center">
        <label className="text-xs">Wet/Dry</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={channel.wetDry}
          onChange={handleWetDryChange(channel, setter, channelId)}
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-xl w-full max-w-screen-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4">Vone92 Mixer</h2>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {renderChannel(channel1, setChannel1, "Deck A", "a")}
        {renderChannel(channel2, setChannel2, "Deck B", "b")}
      </div>
      <div className="mt-6 w-full">
        <label className="text-xs block text-center">Crossfader</label>
        <input
          type="range"
          min="0"
          max="100"
          value={crossfade}
          onChange={(e) => setCrossfade(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default Vone92;
