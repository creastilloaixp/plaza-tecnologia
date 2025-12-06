
import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

const StockCounter: React.FC = () => {
  // Static high number to create constant urgency
  const percentage = 87; 
  const remaining = 12;

  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg">
        
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2 text-brand-yellow font-bold text-sm uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Premios entregados hoy</span>
          </div>
          <span className="text-white font-mono text-xs opacity-70">
            Quedan: <span className="text-brand-red font-bold text-base">{remaining}</span>
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-white/10 relative">
          
          {/* Animated Bar */}
          <div 
            className="h-full bg-gradient-to-r from-brand-red via-brand-darkRed to-brand-red bg-[length:20px_20px] animate-[pulse_2s_infinite]"
            style={{ width: `${percentage}%` }}
          >
            {/* Striped pattern overlay */}
            <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
          </div>
        </div>

        <div className="mt-2 flex items-start gap-2">
          <AlertCircle className="w-3 h-3 text-brand-yellow flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-300 leading-tight">
            Debido a la alta demanda, los cupones de descuento están limitados por día. ¡Gira antes de que se agoten!
          </p>
        </div>

      </div>
    </div>
  );
};

export default StockCounter;
