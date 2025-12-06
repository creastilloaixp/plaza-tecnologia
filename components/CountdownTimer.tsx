import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center animate-pulse-fast">
      <div className="bg-black/40 px-6 py-2 rounded-xl border-2 border-brand-red shadow-[0_0_15px_rgba(217,4,41,0.6)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Timer className="w-8 h-8 text-brand-yellow animate-bounce" />
          <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-wider">
            {formatTime(secondsRemaining)}
          </span>
        </div>
      </div>
      <p className="text-brand-yellow text-xs font-bold mt-2 uppercase tracking-widest">
        ¡La oferta expira pronto!
      </p>
    </div>
  );
};

export default CountdownTimer;