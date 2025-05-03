import React from 'react';
import Vechnics from './components/Vechnics';
import Vone92 from './components/Vone92';

export default function Velodrome() {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Outer container, rotates only on small screens */}
      <div className="relative flex sm:rotate-0 sm:w-screen sm:h-screen sm:items-center sm:justify-center rotate-90 origin-center aspect-[2665/898] h-screen">
        <Vechnics />
        <Vone92 />
        <Vechnics />
      </div>
    </div>
  );
}