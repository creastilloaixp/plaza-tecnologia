
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PLAZAS, PRIZES } from '../constants';
import { Prize } from '../types';

interface ChatBotProps {
  wonPrize: Prize | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ wonPrize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '¡Hola! 👋 Soy tu asistente de Plaza de la Tecnología. ¿Tienes dudas sobre cómo ganar tu local o los premios disponibles?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If user wins, push a congratulatory message from bot automatically
  useEffect(() => {
    if (wonPrize) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: `¡Felicidades por ganar "${wonPrize.label}"! 🎉 Toca el botón de WhatsApp en la pantalla para reclamarlo. ¿Tienes alguna duda sobre tu premio?` 
        }
      ]);
      setIsOpen(true); // Auto-open chat on win
    }
  }, [wonPrize]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      
      // Context construction
      const prizesText = PRIZES.map(p => p.label).join(', ');
      const plazasText = PLAZAS.join(', ');
      
      let systemInstruction = `
        Eres el Asistente Virtual oficial de Plaza de la Tecnología.
        
        INFORMACIÓN GENERAL:
        - Premios disponibles en la ruleta: ${prizesText}.
        - Ubicaciones disponibles: ${plazasText}.
        - Tono: Energético, amable, vendedor, conciso y usando emojis.
      `;

      if (wonPrize) {
        systemInstruction += `
          CONTEXTO IMPORTANTE: EL USUARIO YA GANÓ EL PREMIO: "${wonPrize.label}".
          Tu objetivo ahora es asegurarte de que lo reclame. 
          Si pregunta cómo, dile que presione el botón verde de WhatsApp.
          ¡Felicítalo mucho!
        `;
      } else {
        systemInstruction += `
          OBJETIVO: Motivar al usuario a girar la ruleta.
          Dile que hay descuentos increíbles esperándolo.
        `;
      }
      
      systemInstruction += `
        REGLAS:
        1. Respuestas cortas (máximo 2-3 oraciones).
        2. No inventes promociones que no están en la lista.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: systemInstruction,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = fullResponse;
            return newHistory;
          });
        }
      }

    } catch (error) {
      console.error("Error chatting with Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, tuve un pequeño error de conexión. ¿Podrías intentar de nuevo? 🙏' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 border border-brand-red/20">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-red to-brand-darkRed p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asistente Virtual</h3>
                <p className="text-[10px] text-brand-yellow flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  En línea con Gemini AI
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-brand-red text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-brand-red/50 focus-within:bg-white transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu duda..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`
                  p-1.5 rounded-full transition-all
                  ${!input.trim() || isLoading 
                    ? 'text-gray-400' 
                    : 'text-brand-red hover:bg-brand-red/10'
                  }
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-yellow" />
              Powered by Google Gemini
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group pointer-events-auto relative
          flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_14px_rgba(217,4,41,0.5)]
          transition-all duration-300 transform hover:scale-110 active:scale-95
          ${isOpen ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-brand-red to-brand-darkRed text-white'}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
