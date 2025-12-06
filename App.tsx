
import React, { useState, useEffect } from 'react';
import { GameState, Prize, UserData, Lead } from './types';
import { INITIAL_TIME_SECONDS, CHATWOOT_WEBSITE_TOKEN } from './constants';
import { storageService } from './services/storage';
import { n8nService } from './services/n8n';
import { supabaseService } from './services/supabase';
import { integrationService } from './services/integration'; // Importación Nueva
import CountdownTimer from './components/CountdownTimer';
import LeadForm from './components/LeadForm';
import SpinWheel from './components/SpinWheel';
import ResultModal from './components/ResultModal';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import ChatwootWidget from './components/ChatwootWidget';
import LiveWinners from './components/LiveWinners';
import StockCounter from './components/StockCounter';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LANDING);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recordedLead, setRecordedLead] = useState<Lead | null>(null); 
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Dashboard secret access
  const [footerClicks, setFooterClicks] = useState(0);

  // Record visit on mount
  useEffect(() => {
    storageService.recordVisit();
  }, []);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setGameState(GameState.SPINNING);
  };

  const handleSpinFinished = (prize: Prize) => {
    setWonPrize(prize);
    
    // Save lead
    if (userData) {
      const newLead: Lead = {
        ...userData,
        prize: prize.label,
        timestamp: Date.now(),
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
      };
      
      setRecordedLead(newLead);

      // ============================================================
      // 💾 ESTRATEGIA DE GUARDADO DE DATOS (DATA PERSISTENCE LAYERS)
      // ============================================================

      // 1. Capa Local (Backup Inmediato / Offline)
      storageService.saveLead(newLead);
      
      // 2. Capa Base de Datos Producción (Supabase)
      supabaseService.saveLead(newLead).then(success => {
        if(success) console.log("Lead saved to Supabase");
      });

      // 3. Capa de Integración / Inteligencia (Software Externo)
      // Aquí enviamos los datos enriquecidos para el "Módulo de Clientes"
      integrationService.syncToExternalSoftware(newLead);
      
      // 4. Capa Legacy (Opcional - n8n)
      n8nService.syncLeadToCloud(newLead);
    }

    setTimeout(() => {
      setGameState(GameState.RESULT);
    }, 500);
  };

  const startNow = () => {
    setGameState(GameState.FORM);
  };

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount === 3) {
      setGameState(GameState.DASHBOARD);
      setFooterClicks(0);
    }
    // Reset after 2 seconds if not completed
    setTimeout(() => setFooterClicks(0), 2000);
  };

  // Logic to determine if we use Chatwoot or Gemini
  const useChatwoot = !!CHATWOOT_WEBSITE_TOKEN;

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1605218427306-022ba8c6c68a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed relative overflow-x-hidden font-sans">
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-brand-darkRed/90 mix-blend-multiply z-0"></div>
      
      {/* Particles/Dust Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0 pointer-events-none"></div>

      {/* Social Proof Ticker */}
      <LiveWinners />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center">
        
        {/* Header / Logo Area */}
        <header className="w-full p-6 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg group hover:bg-white/20 transition-all cursor-default">
             <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic perspective-text group-hover:scale-105 transition-transform">
               Plaza de la Tecnología
             </h1>
          </div>
        </header>

        {/* Sticky Timer */}
        {gameState !== GameState.DASHBOARD && (
          <div className="sticky top-4 z-40 mb-6">
             <CountdownTimer initialSeconds={INITIAL_TIME_SECONDS} />
          </div>
        )}

        <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl px-4 pb-12">
          
          {gameState === GameState.LANDING && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700 w-full">
              
              <div className="text-center mb-6 relative">
                {/* Decorative glitch effect behind */}
                <h1 className="text-5xl md:text-6xl font-black text-brand-yellow drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] leading-none mb-2 relative z-10">
                  ¡GIRA LA <br/>
                  <span className="text-white text-6xl md:text-7xl relative inline-block">
                    RULETA!
                    {/* SVG Underline */}
                    <svg className="absolute w-full h-4 -bottom-2 left-0 text-brand-yellow opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 font-medium tracking-wide max-w-lg mx-auto mt-4">
                  Desbloquea descuentos exclusivos para tu nuevo local comercial.
                </p>
              </div>

              {/* Scarcity Counter */}
              <StockCounter />

              {/* Teaser Wheel */}
              <div className="mb-8 pointer-events-none grayscale-[0.2] hover:grayscale-0 transition-all duration-500 scale-95 hover:scale-100">
                 <SpinWheel teaser={true} />
              </div>
              
              <div className="relative group cursor-pointer z-50 w-full max-w-sm" onClick={startNow}>
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow to-brand-gold rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button 
                  className="relative w-full px-8 py-6 bg-brand-red hover:bg-brand-darkRed rounded-full leading-none flex items-center justify-center border-b-4 border-brand-darkRed shadow-xl active:border-b-0 active:translate-y-1 transition-all"
                >
                  <span className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest text-center drop-shadow-sm">
                    ¡PROBAR SUERTE!
                  </span>
                </button>
              </div>
            </div>
          )}

          {gameState === GameState.FORM && (
             <div className="w-full animate-in zoom-in duration-300">
               <LeadForm onSubmit={handleFormSubmit} />
             </div>
          )}

          {(gameState === GameState.SPINNING || gameState === GameState.RESULT) && (
             <div className="animate-in zoom-in duration-500">
                <SpinWheel 
                  isSpinning={isSpinning}
                  setIsSpinning={setIsSpinning}
                  onFinished={handleSpinFinished}
                />
                
                {/* Visual support text below wheel */}
                {!isSpinning && gameState !== GameState.RESULT && (
                   <div className="mt-8 text-center bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 animate-pulse">
                     <p className="text-white font-bold text-lg">👇 Presiona el botón para girar 👇</p>
                   </div>
                )}
             </div>
          )}

          {gameState === GameState.DASHBOARD && (
            <Dashboard onClose={() => setGameState(GameState.LANDING)} />
          )}

        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-white/40 text-xs relative z-10 select-none">
          <p 
            onClick={handleFooterClick}
            className="cursor-default hover:text-white/60 transition-colors inline-block px-4"
          >
            © 2024 Plaza de la Tecnología. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* Result Modal Overlay */}
      {/* We use recordedLead here to ensure ID exists */}
      {gameState === GameState.RESULT && wonPrize && recordedLead && (
        <ResultModal prize={wonPrize} userData={recordedLead} />
      )}

      {/* 
        LOGIC: If Chatwoot Token is present (in constants.ts), we show Chatwoot.
        Otherwise, we show the Gemini ChatBot.
      */}
      {useChatwoot ? (
        <ChatwootWidget userData={userData} wonPrize={wonPrize} />
      ) : (
        <ChatBot wonPrize={wonPrize} />
      )}
      
    </div>
  );
};

export default App;
