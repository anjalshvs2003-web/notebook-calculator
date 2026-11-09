import React, { useEffect, useState, useMemo } from 'react';

export interface FloatingLeavesProps {
  layer?: 'foreground' | 'background';
}

interface LeafData {
  id: number;
  type: number;
  xPercent: number;
  duration: number; // in seconds
  delay: number; // in seconds
  size: number; // in pixels
  opacity: number;
  swayAmount: number;
  rotateDirection: number;
  flip: boolean;
}

export const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ layer = 'foreground' }) => {
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

  // Generate a small, curated set of subtle floating leaves
  // Background layer has fewer, slower, more transparent leaves.
  // Foreground layer has a few crisp, gentle leaves.
  const leaves: LeafData[] = useMemo(() => {
    const isBg = layer === 'background';
    const count = isBg ? 5 : 7;

    return Array.from({ length: count }).map((_, i) => ({
      id: i + (isBg ? 100 : 0),
      type: i % 3, // 3 leaf varieties
      xPercent: isBg 
        ? [15, 38, 62, 82, 92][i % 5] + (Math.random() * 6 - 3)
        : [8, 24, 45, 58, 74, 88, 95][i % 7] + (Math.random() * 6 - 3),
      duration: isBg ? 22 + (i * 3.5) : 16 + (i * 2.8), // slow, graceful float
      delay: isBg ? -(i * 4.2) : -(i * 2.7), // stagger initial positions
      size: isBg ? 16 + (i % 3) * 4 : 20 + (i % 4) * 4,
      opacity: isBg ? 0.28 : 0.45,
      swayAmount: 25 + (i % 3) * 15,
      rotateDirection: i % 2 === 0 ? 1 : -1,
      flip: i % 2 === 1,
    }));
  }, [layer]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden ${
        layer === 'background' ? 'z-10' : 'z-40'
      }`}
      aria-hidden="true"
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-0"
          style={{
            left: `${leaf.xPercent}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size * 1.5}px`,
            opacity: leaf.opacity,
            animation: `leafFall ${leaf.duration}s linear infinite, leafSway ${leaf.duration * 0.35}s ease-in-out infinite alternate`,
            animationDelay: `${leaf.delay}s, ${leaf.delay * 0.6}s`,
            willChange: 'transform',
          }}
        >
          <svg
            viewBox="0 0 40 60"
            className="w-full h-full"
            style={{
              transform: `${leaf.flip ? 'scaleX(-1)' : ''} rotate(${leaf.rotateDirection * 15}deg)`,
              filter: 'drop-shadow(1px 2px 2px rgba(40,35,30,0.08))',
            }}
          >
            {leaf.type === 0 ? (
              // Oak / curved leaf doodle
              <g stroke="#3a3e47" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#e8eee4" fillOpacity="0.45">
                <path d="M20,5 C32,15 36,35 22,54 C18,42 6,36 12,22 C14,16 16,8 20,5 Z" />
                {/* Center vein */}
                <path d="M20,7 C20,25 21,48 21,56" stroke="#484e5a" strokeWidth="1.2" fill="none" />
                {/* Delicate side veins */}
                <path d="M20,18 C24,15 28,17 30,19" fill="none" strokeWidth="1" opacity="0.75" />
                <path d="M20,27 C16,25 12,26 10,29" fill="none" strokeWidth="1" opacity="0.75" />
                <path d="M20,36 C25,34 29,37 31,40" fill="none" strokeWidth="1" opacity="0.75" />
                <path d="M20,44 C17,43 14,45 13,47" fill="none" strokeWidth="1" opacity="0.75" />
              </g>
            ) : leaf.type === 1 ? (
              // Willow / slender botanical leaf
              <g stroke="#3e434c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="#ebe6dc" fillOpacity="0.4">
                <path d="M20,3 C30,18 28,42 19,57 C12,40 10,20 20,3 Z" />
                <path d="M20,4 C19,25 19,45 19,57" stroke="#454b54" strokeWidth="1.2" fill="none" />
                <path d="M20,16 C24,14 26,16 27,18" fill="none" strokeWidth="0.9" opacity="0.7" />
                <path d="M19,26 C15,24 13,26 12,28" fill="none" strokeWidth="0.9" opacity="0.7" />
                <path d="M19,37 C23,35 25,37 26,40" fill="none" strokeWidth="0.9" opacity="0.7" />
              </g>
            ) : (
              // Little twin leaf sprig
              <g stroke="#393d45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#e5ecd9" fillOpacity="0.38">
                {/* Stem */}
                <path d="M14,58 C16,42 22,25 28,8" fill="none" strokeWidth="1.4" />
                {/* Top Leaf */}
                <path d="M28,8 C33,12 36,20 29,24 C24,20 23,12 28,8 Z" />
                {/* Side Leaf */}
                <path d="M20,32 C12,30 8,36 11,43 C16,43 19,38 20,32 Z" />
                <path d="M28,10 C28,16 29,22 29,24" fill="none" strokeWidth="0.9" />
              </g>
            )}
          </svg>
        </div>
      ))}

      {/* Leaf animation keyframes */}
      <style>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-80px) rotate(0deg);
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
          }
        }
        @keyframes leafSway {
          0% {
            margin-left: -20px;
          }
          100% {
            margin-left: 25px;
          }
        }
      `}</style>
    </div>
  );
};
