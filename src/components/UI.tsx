
import React from 'react';
import { GestureType } from '../types';
import { GESTURE_DESCRIPTIONS } from '../constants';

interface UIProps {
  currentGesture: GestureType;
}

const UI: React.FC<UIProps> = ({ currentGesture }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between p-12 pointer-events-none">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-light tracking-widest text-white/90 uppercase">AL-MOBACHILAT</h1>
        <p className="text-sm tracking-widest text-white/40 uppercase font-medium">BEL JANNA</p>
      </header>

      <div className="flex flex-col items-center space-y-6">
        <div className="transition-all duration-700 ease-out transform">
          <p className="text-2xl italic font-serif text-white/80 transition-opacity duration-1000">
            {GESTURE_DESCRIPTIONS[currentGesture]}
          </p>
        </div>
        
        <div className="flex gap-4 items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">Waiting for Hand Input</p>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      <footer className="w-full flex justify-between items-end">
        <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold space-y-1">
          <p>✊ Fist → Penis</p>
          <p>✋ Palm → Sentiment</p>
          <p>🤲 Two Palms → Boobies</p>
          <p>✌️ Peace → Galaxy</p>
          <p>☝️ Point → Saturn</p>
          <p>👌 OK Sign → Infinity Loop</p>
          <p>👍 Thumbs Up → Jellyfish</p>
        </div>
        
        <div className="text-[10px] uppercase tracking-widest text-white/30 text-right font-bold">
          {/* Technical metadata removed per user request */}
        </div>
      </footer>
    </div>
  );
};

export default UI;
