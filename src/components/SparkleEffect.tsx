import React from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface SparkleEffectProps {
  active: boolean;
  onAnimationEnd?: () => void;
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({ active }) => {
  if (!active) return null;

  const sparkles: Sparkle[] = [
    { id: 1, x: -14, y: -10, size: 20, rotation: 12 },
    { id: 2, x: 104, y: -8, size: 24, rotation: -20 },
    { id: 3, x: 96, y: 72, size: 18, rotation: 40 },
    { id: 4, x: -12, y: 80, size: 16, rotation: -15 },
    { id: 5, x: 50, y: -18, size: 19, rotation: 18 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-30" aria-hidden="true">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-sparkle-burst"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-[#404550] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
            style={{ transform: `rotate(${s.rotation}deg)` }}
          >
            {/* Hand-drawn 4-point sparkle star */}
            <path
              d="M12,2 C12,8 14,10 20,12 C14,14 12,16 12,22 C12,16 10,14 4,12 C10,10 12,8 12,2 Z"
              fill="#fffef9"
              stroke="#3a3e47"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Tiny graphite inner dot */}
            <circle cx="12" cy="12" r="1.2" fill="#3a3e47" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes sparkleBurst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) rotate(45deg);
          }
        }
        .animate-sparkle-burst {
          animation: sparkleBurst 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
