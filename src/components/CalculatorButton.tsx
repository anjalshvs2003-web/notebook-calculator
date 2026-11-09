import React, { useState } from 'react';
import { pencilSounds } from '../audio/PencilSoundEffects';

export type ButtonVariant = 'number' | 'operator' | 'action' | 'equal';

interface CalculatorButtonProps {
  label: React.ReactNode;
  value: string;
  variant?: ButtonVariant;
  onClick: (val: string) => void;
  className?: string;
  ariaLabel?: string;
  shortcutHint?: string;
  isWide?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  value,
  variant = 'number',
  onClick,
  className = '',
  ariaLabel,
  shortcutHint,
  isWide = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (variant === 'action') {
      pencilSounds.playEraserWipe();
    } else if (variant === 'equal') {
      pencilSounds.playPencilTap();
    } else {
      pencilSounds.playPencilTap();
    }
    onClick(value);
  };

  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => setIsPressed(false);
  const handlePointerLeave = () => setIsPressed(false);

  // Variant styles adhering to hand-drawn pencil aesthetic
  const getVariantStyles = () => {
    switch (variant) {
      case 'equal':
        return 'bg-[#f4eedd] text-[#1c1f24] font-bold text-2xl sm:text-3xl hover:bg-[#eae2ce] border-[#2c3038] shadow-[2px_3px_0px_rgba(40,43,50,0.32)]';
      case 'operator':
        return 'bg-[#fbf7ee] text-[#2c3038] font-bold text-xl sm:text-2xl hover:bg-[#f1ecd9] border-[#383d47] shadow-[2px_2.5px_0px_rgba(40,43,50,0.22)]';
      case 'action':
        return 'bg-[#f8f3e8] text-[#555a66] font-medium text-lg sm:text-xl hover:bg-[#eee6d3] border-[#4b515d] shadow-[2px_2px_0px_rgba(40,43,50,0.2)]';
      case 'number':
      default:
        return 'bg-[#fdfbf6] text-[#252830] font-semibold text-xl sm:text-2xl hover:bg-[#f6f0e2] border-[#3a3f4b] shadow-[2px_2.5px_0px_rgba(40,43,50,0.22)]';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label={ariaLabel || (typeof label === 'string' ? label : value)}
      className={`relative select-none font-hand rounded-md border flex items-center justify-center transition-all duration-75 outline-none focus-visible:ring-2 focus-visible:ring-[#3c414c]/40 ${
        isWide ? 'col-span-2' : ''
      } ${
        isPressed
          ? 'translate-x-[1.5px] translate-y-[2px] shadow-[0px_0.5px_0px_rgba(40,43,50,0.2)]'
          : 'hover:-translate-y-[1px]'
      } ${getVariantStyles()} ${className}`}
      style={{
        minHeight: '52px',
        touchAction: 'manipulation',
      }}
    >
      {/* Hand-drawn sketchy SVG border overlay for authentic pencil irregularity */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-[#2d313a] opacity-75"
        preserveAspectRatio="none"
        viewBox="0 0 100 60"
      >
        <path
          d="M 4,4 Q 50,2 96,4 Q 98,30 96,56 Q 50,58 4,56 Q 2,30 4,4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Extra imperfect sketch line for equal button */}
        {variant === 'equal' && (
          <path
            d="M 5,6 Q 50,4 95,6 Q 97,30 95,54 Q 50,56 5,54 Q 3,30 5,6 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="8 3"
            opacity="0.4"
          />
        )}
      </svg>

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center pointer-events-none">
        {label}
      </span>

      {/* Optional tiny keyboard shortcut hint in the corner */}
      {shortcutHint && (
        <span className="absolute bottom-0.5 right-1.5 text-[9px] font-mono text-[#8a909d] opacity-50 pointer-events-none hidden sm:inline">
          {shortcutHint}
        </span>
      )}
    </button>
  );
};
