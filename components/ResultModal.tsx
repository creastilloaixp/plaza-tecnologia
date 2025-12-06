
import React, { useEffect, useState } from 'react';
import { Prize, Lead } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { MessageCircle, CheckCircle, Ticket, Copy, Check } from 'lucide-react';
import Confetti from './Confetti';
import { audioService } from '../services/audio';

interface ResultModalProps {
  prize: Prize;
  userData: Lead;
}

const ResultModal: React.FC<ResultModalProps> = ({ prize, userData }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    audioService.playWin();
  }, []);

  const generateWhatsAppLink = () => {
    const name = userData?.name || "Cliente";
    const city = userData?.city || "Plaza de la Tecnología";
    const prizeLabel = prize?.label || "Un Premio Sorpresa";
    const message = `Hola, acabo de ganar *${prizeLabel}* en la ruleta para rentar mi local y quiero reclamarlo. Mi nombre es ${name} y estoy interesado en un local en ${city}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const copyToClipboard = () => {
    const code = userData.id.slice(0,8).toUpperCase();
    const text = `¡Gané ${prize.label} en Plaza de la Tecnología! Mi código es: #${code}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
      
      <Confetti />
      
      {/* Ticket Container */}
      <div className="relative w-full max-w-md transform transition-all animate-in zoom-in-95 duration-500 group">
        
        {/* Glow behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow via-brand-gold to-brand-yellow rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        
        {/* The Ticket Itself */}
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
            
            {/* Top Part (Red Header) with Perforation Circles */}
            <div className="bg-brand-red p-6 text-center relative">
                {/* CSS Perforations (Left and Right semicircles) */}
                <div className="absolute -left-3 bottom-0 w-6 h-6 bg-black rounded-full z-20"></div>
                <div className="absolute -right-3 bottom-0 w-6 h-6 bg-black rounded-full z-20"></div>
                
                <h2 className="text-xl font-bold text-white/90 uppercase tracking-widest mb-1">
                    Ticket Ganador
                </h2>
                <div className="text-xs text-brand-yellow font-mono uppercase tracking-[0.2em] opacity-80 mb-4">
                    #{userData.id.slice(0,8).toUpperCase()}
                </div>

                <div className="relative inline-block">
                     <div className="absolute -inset-2 bg-brand-gold blur-lg opacity-50 animate-pulse"></div>
                     <h1 className="relative text-3xl md:text-4xl font-black text-white uppercase drop-shadow-md leading-none">
                        {prize.label}
                     </h1>
                </div>
            </div>

            {/* Dashed Line Divider */}
            <div className="relative h-1 bg-brand-red">
                <div className="absolute top-0 left-0 w-full h-full border-b-2 border-dashed border-white/30"></div>
            </div>

            {/* Bottom Content */}
            <div className="bg-[#fffef0] p-8 text-center relative">
                {/* Texture overlay for paper feel */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] pointer-events-none"></div>

                <p className="text-gray-600 font-medium mb-6">
                    ¡Este ticket es válido para tu contrato en <br/>
                    <span className="font-bold text-brand-darkRed">Plaza de la Tecnología</span>!
                </p>

                <div className="bg-white border-2 border-brand-yellow/30 p-4 rounded-xl mb-6 shadow-sm flex items-start gap-3 text-left">
                    <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                        <p className="font-bold text-gray-800 mb-1">Instrucciones:</p>
                        <p>Envía este ticket digital por WhatsApp para validar tu promoción antes de que expire.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                      href={generateWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                  >
                      {/* Shine effect on button */}
                      <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
                      
                      <MessageCircle className="w-6 h-6" />
                      <span className="uppercase tracking-wide">Canjear Ticket Ahora</span>
                  </a>

                  <button 
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "¡Copiado!" : "Copiar Código del Ticket"}
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-mono uppercase">
                    <Ticket className="w-3 h-3" />
                    Válido por 7 días
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
