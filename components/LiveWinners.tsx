
import React, { useState, useEffect } from 'react';
import { Trophy, MapPin } from 'lucide-react';
import { PLAZAS, PRIZES } from '../constants';

const NAMES = ["Juan P.", "María G.", "Carlos R.", "Ana L.", "Roberto M.", "Sofia D.", "Luis H.", "Fernanda C."];

const LiveWinners: React.FC = () => {
  const [currentWinner, setCurrentWinner] = useState<{name: string, city: string, prize: string} | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay
    const initialTimeout = setTimeout(triggerNotification, 2000);

    function triggerNotification() {
      // Generate random winner
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomCity = PLAZAS[Math.floor(Math.random() * PLAZAS.length)];
      const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)].shortLabel;

      setCurrentWinner({ name: randomName, city: randomCity, prize: randomPrize });
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      // Schedule next one (randomly between 8 and 15 seconds)
      const nextDelay = Math.random() * (15000 - 8000) + 8000;
      setTimeout(triggerNotification, nextDelay);
    }

    return () => clearTimeout(initialTimeout);
  }, []);

  if (!currentWinner) return null;

  return (
    <div 
      className={`
        fixed top-24 right-4 md:right-8 z-30 transition-all duration-500 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
      `}
    >
      <div className="bg-white/90 backdrop-blur-md border-l-4 border-brand-yellow shadow-lg rounded-r-lg p-3 flex items-center gap-3 max-w-[280px]">
        <div className="bg-brand-red p-2 rounded-full text-white">
          <Trophy className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ¡Ganador Reciente!
          </p>
          <p className="text-sm text-gray-800 leading-tight">
            <span className="font-bold">{currentWinner.name}</span> de {currentWinner.city.split('-')[0]} ganó:
          </p>
          <p className="text-brand-darkRed font-black text-xs uppercase mt-0.5">
            {currentWinner.prize}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveWinners;
