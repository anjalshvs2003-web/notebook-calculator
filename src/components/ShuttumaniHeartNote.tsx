import React, { useState } from 'react';
import { pencilSounds } from '../audio/PencilSoundEffects';

export const ShuttumaniHeartNote: React.FC = () => {
  const [tapped, setTapped] = useState(false);

  const handleClick = () => {
    pencilSounds.playResultSparkle();
    setTapped(true);
    setTimeout(() => setTapped(false), 900);
  };

  return (
    <div
      onClick={handleClick}
      title="A sweet handwritten note on your notebook (tap for a little love!)"
      className="relative my-4 select-none cursor-pointer group flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-transform duration-200"
    >
      {/* Hand-drawn pencil heart */}
      <div
        className={`relative transition-transform duration-300 ${
          tapped ? 'scale-125 -rotate-6' : 'group-hover:scale-110 group-hover:-rotate-3'
        }`}
      >
        <svg
          width="54"
          height="50"
          viewBox="0 0 60 56"
          className="filter drop-shadow-[1px_2px_1px_rgba(40,35,30,0.12)]"
          fill="none"
        >
          {/* Soft blush pencil color wash inside the heart */}
          <path
            d="M 30,50 C 12,38 4,24 6,14 C 8,4 20,4 30,14 C 40,4 52,4 54,14 C 56,24 48,38 30,50 Z"
            fill="#f6dedd"
            fillOpacity="0.65"
          />

          {/* Primary graphite pencil stroke */}
          <path
            d="M 30,48 C 12,36 5,22 7,13 C 9,4 20,4 30,15 C 40,4 51,4 53,13 C 55,22 48,36 30,48 Z"
            stroke="#3a3e48"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary imperfect sketchy double stroke */}
          <path
            d="M 30,51 C 10,38 3,24 5,14 C 7,3 21,3 30,13 C 39,3 53,3 55,14 C 57,24 50,38 30,51 Z"
            stroke="#5c6270"
            strokeWidth="1.1"
            strokeDasharray="18 4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Internal pencil cross-hatching shading */}
          <line x1="16" y1="18" x2="26" y2="28" stroke="#757c8d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
          <line x1="20" y1="16" x2="28" y2="24" stroke="#757c8d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
          <line x1="34" y1="24" x2="42" y2="16" stroke="#757c8d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
          <line x1="32" y1="28" x2="44" y2="18" stroke="#757c8d" strokeWidth="1" opacity="0.5" strokeLinecap="round" />

          {/* Tiny graphite sparkle glint on heart */}
          <path
            d="M 44,10 L 46,14 L 50,14 L 47,17 L 48,21 L 44,18 L 40,21 L 41,17 L 38,14 L 42,14 Z"
            fill="#ffffff"
            opacity="0.8"
          />
        </svg>

        {/* Floating tiny heart bursts when tapped */}
        {tapped && (
          <div className="absolute -top-3 -right-3 animate-ping opacity-75 pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#e89393">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Handwritten note: Love you shuttumani */}
      <div className="flex flex-col items-center sm:items-start select-none">
        <div className="flex items-center gap-1.5">
          <span
            className="font-caveat font-bold text-2xl sm:text-3xl text-[#2a2d36] tracking-wide transform -rotate-1 group-hover:scale-105 transition-transform"
            style={{
              textShadow: '0.5px 0.5px 0px rgba(45,35,25,0.2)',
            }}
          >
            Love you shuttumani
          </span>
          <span className="text-xl text-[#d46a6a] animate-pulse">♡</span>
        </div>

        {/* Delicate hand-drawn underline loop */}
        <svg
          className="w-48 sm:w-56 h-3 -mt-1 text-[#434855] opacity-60"
          viewBox="0 0 220 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M 4,6 Q 40,2 80,6 T 150,5 Q 180,8 214,4" />
        </svg>

        <span className="text-[11px] font-hand text-[#757a87] italic tracking-wider -mt-0.5">
          ✎ a little pencil note on the page
        </span>
      </div>
    </div>
  );
};
