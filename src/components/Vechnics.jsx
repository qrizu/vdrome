import React, { useState, useEffect, useRef } from 'react';
import playerBg from '../assets/image/vechnics/player-background.png';
import onOffImg from '../assets/image/vechnics/player-onoff.png';
import startStopImg from '../assets/image/vechnics/player-startstop.png';
import pitchImg from '../assets/image/vechnics/player-pitch.png';
import platterImg from '../assets/image/vechnics/player-platter.png';

const buttons = [
  {
    id: 'onoff',
    img: onOffImg,
    top: '75.83%',
    left: '1.73%',
    width: '6.06%',
    height: '7.79%',
  },
  {
    id: 'startstop',
    img: startStopImg,
    top: '86.86%',
    left: '2.17%',
    width: '9.71%',
    height: '10.02%',
  },
  {
    id: 'lightstrobe',
    type: 'light',
    top: '92.53%',
    left: '55.80%',
    width: '3.73%',
    height: '4.79%',
  },
  {
    id: 'pitch',
    img: pitchImg,
    left: '90.87%',
    width: '3.99%',
    height: '5.90%', // anpassat till 53px av 898px
  },
  { id: 'rpm33', top: '94.21%', left: '12.91%', width: '5.03%', height: '3.56%' },
  { id: 'rpm45', top: '94.21%', left: '18.45%', width: '5.03%', height: '3.56%' },
  { id: 'reset', top: '78.40%', left: '83.79%', width: '3.21%', height: '4.12%' },
  { id: 'speedx2', top: '46.77%', left: '90.26%', width: '4.68%', height: '2.00%' },
];

export default function Vechnics() {
  const [powerOn, setPowerOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButtons, setActiveButtons] = useState({});
  const [pitchValue, setPitchValue] = useState(0.5);

  const platterRef = useRef(null);
  const actualSpeed = useRef(0);
  const currentRotation = useRef(0);
  const pitchRef = useRef(null);
  const isDraggingPitch = useRef(false);

  const handleButtonClick = (id) => {
    if (id === 'onoff') {
      setPowerOn((prev) => {
        const newState = !prev;
        if (newState) {
          setActiveButtons({ rpm33: true, rpm45: false });
        } else {
          setActiveButtons({});
          setIsPlaying(false);
        }
        return newState;
      });
    } else if (['rpm33', 'rpm45'].includes(id)) {
      setActiveButtons((prev) => {
        if (prev[id]) return prev;
        return {
          ...prev,
          rpm33: id === 'rpm33',
          rpm45: id === 'rpm45',
        };
      });
    } else if (['reset', 'speedx2'].includes(id)) {
      setActiveButtons((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else if (id === 'startstop') {
      if (powerOn) {
        setIsPlaying((prev) => !prev);
      }
    }
  };

    useEffect(() => {
    let animationId;
    let targetSpeed = 0;

    if (powerOn && isPlaying) {
      targetSpeed = activeButtons.rpm45 ? 2.5 : 1.8;
    }

    const animate = () => {
      actualSpeed.current += (targetSpeed - actualSpeed.current) * 0.05;
      currentRotation.current += actualSpeed.current;

      if (platterRef.current) {
        platterRef.current.style.transform = `rotate(${currentRotation.current}deg)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [powerOn, isPlaying, activeButtons.rpm33, activeButtons.rpm45]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingPitch.current || !pitchRef.current) return;
  
      const container = pitchRef.current.parentElement;
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
  
      const clampedY = Math.min(Math.max(mouseY, 0), rect.height);
      const value = 1 - clampedY / rect.height;
  
      setPitchValue(value);
  
      console.log('🖱️ Mus Y:', e.clientY);
      console.log('📐 Inuti faderspår:', mouseY.toFixed(2));
      console.log('📎 clampedY:', clampedY.toFixed(2));
      console.log('🎚️ pitchValue:', value.toFixed(2));
    };
  
    const stopDragging = () => {
      if (isDraggingPitch.current) {
        console.log('🛑 Slutade dra pitch');
      }
      isDraggingPitch.current = false;
    };
  
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, []);
  return (
    <div
      className="relative aspect-[1154/898] w-[43.32%] bg-no-repeat bg-contain bg-bottom"
      style={{ backgroundImage: `url(${playerBg})` }}
    >
      {/* Platter */}
      <div
        ref={platterRef}
        className="absolute"
        style={{
          top: '1.11%',
          left: '2.17%',
          width: '74.84%',
          aspectRatio: '1 / 1',
          transformOrigin: 'center center',
        }}
      >
        <img
          src={platterImg}
          alt="Platter"
          className="w-full h-full select-none"
          draggable={false}
        />
      </div>

      {/* Buttons */}
      {buttons.map((btn) => (
        <React.Fragment key={btn.id}>
          {btn.id === 'onoff' && powerOn && (
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: '75.2%',
                left: '1.2%',
                width: '7.2%',
                height: '8.6%',
                background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.25), transparent)',
                boxShadow: '0 0 12px 4px rgba(255, 0, 0, 0.4)',
                zIndex: 0,
              }}
            />
          )}

          {btn.type === 'light' ? (
            powerOn && (
              <div
                onClick={() => handleButtonClick(btn.id)}
                className="absolute rounded-full cursor-pointer transition-all duration-200"
                style={{
                  top: btn.top,
                  left: btn.left,
                  width: btn.width,
                  height: btn.height,
                  background:
                    'radial-gradient(ellipse at center, #ffffcc, #ffeb3b)',
                  boxShadow: '0 0 12px 4px rgba(255, 255, 200, 0.8)',
                }}
              />
            )
          ) : btn.id === 'pitch' ? (
            <img
              ref={pitchRef}
              src={btn.img}
              alt="pitch"
              onMouseDown={() => (isDraggingPitch.current = true)}
              className="absolute cursor-pointer select-none"
              draggable={false}
              style={{
                left: btn.left,
                width: btn.width,
                height: btn.height,
                top: `calc(${(1 - pitchValue) * 28.73 + 52.78}%)`,
                transition: isDraggingPitch.current ? 'none' : 'top 0.05s linear',
                pointerEvents: powerOn ? 'auto' : 'none',
                opacity: 1,
              }}
            />
          ) : (
            <div
              className={`absolute cursor-pointer transition-all duration-150 ${
                btn.id === 'startstop' && isPlaying
                  ? 'scale-95 translate-y-[1px] brightness-90 shadow-inner border-2 border-red-500 rounded'
                  : 'scale-100 translate-y-0 brightness-100 shadow'
              }`}
              style={{
                top: btn.top,
                left: btn.left,
                width: btn.width,
                height: btn.height,
                pointerEvents: btn.id === 'onoff' || powerOn ? 'auto' : 'none',
                opacity: btn.id !== 'onoff' && !powerOn ? 0.3 : 1,
              }}
              onClick={() =>
                btn.id === 'onoff' || powerOn
                  ? handleButtonClick(btn.id)
                  : undefined
              }
            >
              {btn.img && (
                <img
                  src={btn.img}
                  alt={btn.id}
                  className="w-full h-full transition-transform duration-200"
                  style={{
                    transform:
                      btn.id === 'onoff' && powerOn
                        ? 'rotate(45deg)'
                        : undefined,
                    transformOrigin: 'center',
                  }}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* LED-dioder (endast när aktiva) */}
      {['rpm33', 'rpm45', 'reset', 'speedx2'].map((id) => {
        const isPressed = powerOn && activeButtons[id];
        if (!isPressed) return null;

        const styles = {
          rpm33: { top: '95.33%', left: '15.60%' },
          rpm45: { top: '95.33%', left: '21.49%' },
          reset: { top: '69.82%', left: '88.21%' },
          speedx2: { top: '47.44%', left: '92.88%' },
        };

        return (
          <div
            key={id}
            className="absolute bg-red-500 rounded transition-all duration-150 scale-95 translate-y-[1px] brightness-90 shadow-inner"
            style={{
              top: styles[id].top,
              left: styles[id].left,
              width: '1.82%',
              height: '0.67%',
            }}
          />
        );
      })}
    </div>
  );
}
