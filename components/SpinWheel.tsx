
import React, { useState, useRef } from 'react';
import * as d3Shape from 'd3-shape';
import { Prize } from '../types';
import { PRIZES } from '../constants';
import { audioService } from '../services/audio';

interface SpinWheelProps {
  onFinished?: (prize: Prize) => void;
  isSpinning?: boolean;
  setIsSpinning?: (spinning: boolean) => void;
  teaser?: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ 
  onFinished, 
  isSpinning = false, 
  setIsSpinning, 
  teaser = false 
}) => {
  const [rotation, setRotation] = useState(0);
  
  // Dimensions
  const size = 320;
  const radius = size / 2;
  const cx = size / 2;
  const cy = size / 2;

  const arcGenerator = d3Shape.arc()
    .outerRadius(radius - 10)
    .innerRadius(30)
    .padAngle(0);

  const pieGenerator = d3Shape.pie<Prize>()
    .value(() => 1) // Equal size slices
    .sort(null);

  const arcs = pieGenerator(PRIZES);

  const spin = () => {
    if (isSpinning || teaser || !setIsSpinning || !onFinished) return;
    setIsSpinning(true);

    // Weighted random selection
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedPrizeIndex = 0;
    
    for (let i = 0; i < PRIZES.length; i++) {
      if (randomNum < PRIZES[i].weight) {
        selectedPrizeIndex = i;
        break;
      }
      randomNum -= PRIZES[i].weight;
    }

    const prize = PRIZES[selectedPrizeIndex];

    // Calculate rotation
    const sliceAngle = 360 / PRIZES.length;
    // Target angle relative to the wheel start:
    const targetSliceCenter = (selectedPrizeIndex * sliceAngle) + (sliceAngle / 2);
    
    // The wheel is fixed, the pointer is fixed at top. We rotate the container.
    // To bring `targetSliceCenter` to the top (0 deg), we need to rotate: `360 - targetSliceCenter`.
    
    const finalRotation = 360 * 8 + (360 - targetSliceCenter); // Always spin 8 times + alignment
    
    setRotation(finalRotation);

    // Audio Simulation for ticks
    // Since we use CSS transition, we simulate the ticks with a decaying interval
    let tickCount = 0;
    const maxTicks = 40; // Approximate ticks during 4s
    let delay = 50;

    const playTicks = () => {
      if (tickCount >= maxTicks) return;
      audioService.playTick();
      tickCount++;
      // Slow down the ticks
      delay = delay * 1.05; 
      setTimeout(playTicks, delay);
    };
    playTicks();

    setTimeout(() => {
      setIsSpinning(false);
      onFinished(prize);
    }, 4000); // 4 seconds duration match CSS
  };

  return (
    <div className={`flex flex-col items-center justify-center relative z-10 transition-transform ${teaser ? 'scale-90 md:scale-100' : ''}`}>
      
      {/* Pointer */}
      <div className="z-20 -mb-4 drop-shadow-lg">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 40L37.3205 10L2.67949 10L20 40Z" fill="#FFC300" stroke="#FFF" strokeWidth="2"/>
        </svg>
      </div>

      {/* Wheel Container */}
      <div className="wheel-container rounded-full border-4 border-brand-gold p-1 bg-brand-darkRed relative shadow-[0_0_50px_rgba(217,4,41,0.4)]">
        {/* Lights */}
        <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-white/30 animate-[spin_10s_linear_infinite]"></div>
        
        <div 
          className="relative rounded-full overflow-hidden"
          style={{ 
            width: size, 
            height: size, 
            transform: `rotate(${teaser ? 0 : rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
            animation: teaser ? 'spin-slow 20s linear infinite' : 'none'
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`translate(${cx},${cy})`}>
              {arcs.map((arc, i) => {
                const centroid = arcGenerator.centroid(arc as any);
                return (
                  <g key={i}>
                    <path
                      d={arcGenerator(arc as any) || undefined}
                      fill={PRIZES[i].color}
                      stroke="#8D0000"
                      strokeWidth="2"
                    />
                    <g transform={`translate(${centroid[0]}, ${centroid[1]}) rotate(${((arc.startAngle + arc.endAngle) / 2 * 180 / Math.PI) + 90})`}>
                       <text
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill={PRIZES[i].textColor}
                        fontSize="14"
                        fontWeight="800"
                        fontFamily="Poppins"
                        style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.3)' }}
                      >
                        {PRIZES[i].shortLabel}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
          
          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-gold rounded-full shadow-inner border-4 border-brand-red flex items-center justify-center">
             <div className="w-12 h-12 bg-brand-gold rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Spin Button - Hidden in teaser mode */}
      {!teaser && (
        <button 
          onClick={spin}
          disabled={isSpinning}
          className={`mt-8 px-12 py-4 rounded-full text-2xl font-black uppercase tracking-widest shadow-lg transform transition-all 
            ${isSpinning 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-yellow to-brand-gold text-brand-darkRed hover:scale-105 hover:shadow-xl active:scale-95 animate-bounce-slow'
            }
          `}
        >
          {isSpinning ? 'Girando...' : '¡Gira y Gana!'}
        </button>
      )}
    </div>
  );
};

export default SpinWheel;
