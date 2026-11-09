import React, { useState } from 'react';
import { pencilSounds } from '../audio/PencilSoundEffects';

export const DecorativeDoodles: React.FC = () => {
  const [pencilTapped, setPencilTapped] = useState(false);
  const [paperclipTapped, setPaperclipTapped] = useState(false);

  const handlePencilClick = () => {
    pencilSounds.playPencilTap();
    setPencilTapped(true);
    setTimeout(() => setPencilTapped(false), 500);
  };

  const handlePaperclipClick = () => {
    pencilSounds.playPencilTap();
    setPaperclipTapped(true);
    setTimeout(() => setPaperclipTapped(false), 500);
  };

  return (
    <>
      {/* Hand-drawn caption above the calculator */}
      <div className="text-center my-2 select-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-caveat font-bold text-[#2a2d34] tracking-wide inline-block relative">
          Nehil's Calculator
          {/* Subtle hand-drawn wavy underline */}
          <svg
            className="w-full h-3 -mt-1 text-[#3b404a] opacity-60"
            viewBox="0 0 240 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4,7 Q30,2 60,7 T120,6 T180,7 T236,5" />
          </svg>
        </h1>
        <p className="text-sm sm:text-base font-hand text-[#636875] mt-0.5 italic tracking-wider flex items-center justify-center gap-1.5">
          <span>~</span>
          <span>A little space for little calculations.</span>
          <span>~</span>
        </p>
      </div>

      {/* Sketched Wooden HB Pencil lying beside the notebook / calculator (Visible on MD screens and above) */}
      <div
        onClick={handlePencilClick}
        title="A sharp No. 2 graphite pencil (tap me!)"
        className={`hidden lg:block absolute -right-2 top-28 cursor-pointer select-none transition-transform duration-300 ${
          pencilTapped ? 'scale-105 -rotate-12 translate-x-2' : 'hover:-rotate-3 hover:translate-x-1'
        }`}
        style={{
          filter: 'drop-shadow(3px 8px 6px rgba(45,35,25,0.15))',
          transform: 'rotate(-6deg)',
        }}
      >
        <svg width="64" height="260" viewBox="0 0 64 260" fill="none">
          {/* Eraser */}
          <path
            d="M24,240 C24,248 40,248 40,240 L40,225 L24,225 Z"
            fill="#e29b97"
            stroke="#3a3d45"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Metal Ferrule */}
          <rect
            x="24"
            y="210"
            width="16"
            height="15"
            fill="#d2d5d8"
            stroke="#3a3d45"
            strokeWidth="1.8"
          />
          <line x1="24" y1="215" x2="40" y2="215" stroke="#50545c" strokeWidth="1.2" />
          <line x1="24" y1="220" x2="40" y2="220" stroke="#50545c" strokeWidth="1.2" />

          {/* Yellow Hexagonal Wooden Barrel */}
          <rect
            x="24"
            y="70"
            width="16"
            height="140"
            fill="#e8b965"
            stroke="#3a3d45"
            strokeWidth="1.8"
          />
          {/* Hexagonal facet highlight lines */}
          <line x1="29" y1="70" x2="29" y2="210" stroke="#f4ce8b" strokeWidth="1.5" />
          <line x1="35" y1="70" x2="35" y2="210" stroke="#c89642" strokeWidth="1.5" />
          {/* Subtle stamped text on pencil: "HB • No. 2" */}
          <text
            x="33"
            y="145"
            transform="rotate(-90 33 145)"
            fontSize="8"
            fontFamily="sans-serif"
            fill="#6d5426"
            letterSpacing="1"
            textAnchor="middle"
          >
            NO. 2 • HB
          </text>

          {/* Sharpened Wood Collar */}
          <path
            d="M24,70 L32,24 L40,70 Z"
            fill="#ecd8b8"
            stroke="#3a3d45"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Wood cut marks */}
          <path d="M26,70 C28,64 30,68 32,63 C34,68 36,64 38,70" fill="none" stroke="#ba9e78" strokeWidth="1" />

          {/* Graphite Lead Tip */}
          <path
            d="M30,34 L32,24 L34,34 Z"
            fill="#2c2d30"
            stroke="#202124"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Tiny pencil reflection / graphite glint */}
          <circle cx="32" cy="27" r="0.8" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>

      {/* Sketched Metal Paperclip in the top-left margin */}
      <div
        onClick={handlePaperclipClick}
        title="A paperclip holding your notes together"
        className={`absolute -top-3 sm:-top-5 left-16 sm:left-24 cursor-pointer select-none transition-transform duration-200 z-30 ${
          paperclipTapped ? 'rotate-12 scale-110' : 'hover:scale-105'
        }`}
        style={{
          filter: 'drop-shadow(2px 3px 2px rgba(45,35,25,0.12))',
        }}
      >
        <svg width="28" height="54" viewBox="0 0 28 54" fill="none">
          <path
            d="M10,48 L10,12 C10,6 18,6 18,12 L18,42 C18,46 13,46 13,42 L13,18 C13,15 15,15 15,18 L15,38"
            stroke="#484d57"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9,48 L9,12 C9,5 19,5 19,12 L19,42"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Tiny Marginalia Doodles (Math sketches, little smiley, coffee ring hint) */}
      <div className="hidden md:block absolute -left-1 sm:left-2 bottom-12 pointer-events-none select-none opacity-45">
        <svg width="70" height="90" viewBox="0 0 70 90" fill="none" stroke="#484d56" strokeWidth="1.3" strokeLinecap="round">
          {/* Hand sketched square root */}
          <path d="M5,35 L9,35 L14,48 L22,24 L48,24" />
          <text x="24" y="38" fontFamily="Patrick Hand, cursive" fontSize="13" fill="#484d56">144 = 12</text>
          {/* Little smiley face doodle */}
          <circle cx="28" cy="68" r="10" stroke="#484d56" strokeWidth="1.2" fill="none" />
          <circle cx="25" cy="65" r="1" fill="#484d56" />
          <circle cx="31" cy="65" r="1" fill="#484d56" />
          <path d="M24,71 Q28,76 32,71" stroke="#484d56" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      {/* Sketched tiny corner flower in bottom-right */}
      <div className="hidden sm:block absolute right-4 sm:right-8 bottom-8 pointer-events-none select-none opacity-40">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#484d56" strokeWidth="1.3" strokeLinecap="round">
          {/* Stem & curved leaf */}
          <path d="M30,55 Q35,42 30,30" />
          <path d="M32,44 Q42,40 40,48 Q34,48 32,44" fill="#ecf0e7" stroke="#484d56" />
          {/* Flower petals */}
          <circle cx="30" cy="22" r="3" fill="#e8b965" stroke="#484d56" />
          <ellipse cx="30" cy="14" rx="3.5" ry="5" />
          <ellipse cx="30" cy="30" rx="3.5" ry="5" />
          <ellipse cx="22" cy="22" rx="5" ry="3.5" />
          <ellipse cx="38" cy="22" rx="5" ry="3.5" />
        </svg>
      </div>
    </>
  );
};
