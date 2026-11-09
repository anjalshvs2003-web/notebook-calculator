import React, { useEffect, useState, useMemo } from 'react';

interface CloudData {
  id: number;
  type: number;
  topPercent: number;
  duration: number; // seconds
  delay: number; // seconds
  scale: number;
  opacity: number;
  direction: 'leftToRight' | 'rightToLeft';
}

export const FloatingClouds: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const clouds: CloudData[] = useMemo(() => [
    {
      id: 1,
      type: 0,
      topPercent: 8,
      duration: 55,
      delay: -5,
      scale: 1.15,
      opacity: 0.65,
      direction: 'leftToRight',
    },
    {
      id: 2,
      type: 1,
      topPercent: 22,
      duration: 72,
      delay: -28,
      scale: 0.9,
      opacity: 0.5,
      direction: 'leftToRight',
    },
    {
      id: 3,
      type: 2,
      topPercent: 58,
      duration: 65,
      delay: -18,
      scale: 1.05,
      opacity: 0.55,
      direction: 'leftToRight',
    },
    {
      id: 4,
      type: 0,
      topPercent: 78,
      duration: 80,
      delay: -45,
      scale: 0.85,
      opacity: 0.45,
      direction: 'leftToRight',
    },
  ], []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            top: `${cloud.topPercent}%`,
            width: `${160 * cloud.scale}px`,
            height: `${90 * cloud.scale}px`,
            opacity: cloud.opacity,
            animation: `driftCloud ${cloud.duration}s linear infinite, bobCloud 6s ease-in-out infinite alternate`,
            animationDelay: `${cloud.delay}s, ${cloud.delay * 0.3}s`,
            willChange: 'transform',
          }}
        >
          {cloud.type === 0 ? (
            // Classic hand-drawn cumulus cloud
            <svg
              viewBox="0 0 170 95"
              className="w-full h-full filter drop-shadow-[1px_2px_3px_rgba(40,35,30,0.06)]"
              fill="none"
            >
              {/* Cloud Body fill with soft paper-white */}
              <path
                d="M 28,68 C 12,68 8,50 20,40 C 15,22 36,12 52,22 C 64,6 94,6 106,18 C 122,8 144,18 142,36 C 156,44 154,64 138,68 Z"
                fill="#fdfbf7"
                fillOpacity="0.85"
                stroke="#424754"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Imperfect sketchy double line */}
              <path
                d="M 30,67 C 15,67 11,51 22,42 C 17,25 36,15 51,24 C 63,9 93,9 104,20 C 120,11 141,20 140,37 C 153,45 151,63 136,67"
                fill="none"
                stroke="#636a7b"
                strokeWidth="0.8"
                strokeDasharray="14 5"
                opacity="0.55"
              />
              {/* Delicate interior pencil fluff curls */}
              <path
                d="M 45,46 C 40,38 52,32 58,40"
                stroke="#707788"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.65"
              />
              <path
                d="M 85,38 C 92,28 108,32 104,44"
                stroke="#707788"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.65"
              />
              <path
                d="M 112,50 C 120,46 128,52 126,58"
                stroke="#707788"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Soft pencil hatch shadow at bottom */}
              <line x1="40" y1="62" x2="52" y2="62" stroke="#8a91a0" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <line x1="65" y1="64" x2="85" y2="64" stroke="#8a91a0" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
              <line x1="95" y1="63" x2="115" y2="63" stroke="#8a91a0" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            </svg>
          ) : cloud.type === 1 ? (
            // Slender fluffy wind-swept cloud
            <svg
              viewBox="0 0 180 80"
              className="w-full h-full filter drop-shadow-[1px_2px_3px_rgba(40,35,30,0.06)]"
              fill="none"
            >
              <path
                d="M 18,52 C 8,52 6,38 18,32 C 18,18 36,14 48,22 C 60,10 88,10 98,20 C 112,12 136,16 142,28 C 158,28 168,42 156,52 Z"
                fill="#fcfaf4"
                fillOpacity="0.82"
                stroke="#3f4552"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 32,36 Q 42,28 54,34"
                stroke="#687082"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 80,30 Q 94,22 108,30"
                stroke="#687082"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Little wind trail wisps */}
              <path d="M 6,42 Q 12,42 16,42" stroke="#687082" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
              <path d="M 160,40 Q 172,40 178,40" stroke="#687082" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
            </svg>
          ) : (
            // Cute bubbly cloud doodle
            <svg
              viewBox="0 0 160 90"
              className="w-full h-full filter drop-shadow-[1px_2px_3px_rgba(40,35,30,0.06)]"
              fill="none"
            >
              <path
                d="M 24,62 C 10,62 8,46 20,38 C 16,24 32,16 46,24 C 55,12 80,12 90,22 C 102,14 124,18 126,34 C 140,40 138,58 124,62 Z"
                fill="#fefcf8"
                fillOpacity="0.88"
                stroke="#424754"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Secondary sketchy outline */}
              <path
                d="M 25,60 C 13,60 11,48 21,40 C 18,27 33,20 45,26 C 54,15 78,15 88,24"
                stroke="#757c8e"
                strokeWidth="0.8"
                strokeDasharray="10 4"
                opacity="0.5"
              />
              <path
                d="M 40,42 Q 50,34 60,40"
                stroke="#687082"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 78,36 Q 88,28 98,36"
                stroke="#687082"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          )}
        </div>
      ))}

      <style>{`
        @keyframes driftCloud {
          0% {
            transform: translateX(-240px);
          }
          100% {
            transform: translateX(105vw);
          }
        }
        @keyframes bobCloud {
          0% {
            margin-top: 0px;
          }
          100% {
            margin-top: 14px;
          }
        }
      `}</style>
    </div>
  );
};
