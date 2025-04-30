import { useState } from "react";
import Vechnics from "./components/Vechnics";
import Vone92 from "./components/Vone92";

function Velodrome() {
  const [crossfade, setCrossfade] = useState(50);
  const [channels, setChannels] = useState({
    a: {},
    b: {},
  });

  const handleUpdateChannels = (channelId, values) => {
    setChannels((prev) => ({ ...prev, [channelId]: values }));
    // console.log("Channel update", channelId, values); // debug
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col gap-8 items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Velodrome</h1>

      <div className="flex flex-col xl:flex-row items-center gap-8">
        <Vechnics side="Deck A" audioSettings={channels.a} />
        <Vone92
          crossfade={crossfade}
          setCrossfade={setCrossfade}
          onUpdateChannels={handleUpdateChannels}
        />
        <Vechnics side="Deck B" audioSettings={channels.b} />
      </div>
    </div>
  );
}

export default Velodrome;
