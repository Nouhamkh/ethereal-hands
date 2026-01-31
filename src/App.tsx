
import React, { useState, useCallback } from 'react';
import Experience from './components/Experience';
import UI from './components/UI';
import { GestureType } from './types';

const App: React.FC = () => {
  const [currentGesture, setCurrentGesture] = useState<GestureType>(GestureType.NONE);

  const handleGestureDetected = useCallback((gesture: GestureType) => {
    setCurrentGesture(gesture);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-900/10 via-black to-black opacity-50" />
      
      {/* The 3D Particle Scene */}
      <Experience onGestureDetected={handleGestureDetected} />

      {/* Elegant UI Layer */}
      <UI currentGesture={currentGesture} />

      {/* Vignette Overlay for cinematic feel */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
    </div>
  );
};

export default App;
