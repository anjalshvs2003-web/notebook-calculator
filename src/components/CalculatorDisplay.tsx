import React from 'react';
import { displayExpression } from '../utils/calculatorLogic';
import { SparkleEffect } from './SparkleEffect';

interface CalculatorDisplayProps {
  expression: string;
  currentInput: string;
  previousCalculation: string | null;
  hasError: boolean;
  errorMessage?: string;
  showSparkle: boolean;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  currentInput,
  previousCalculation,
  hasError,
  errorMessage,
  showSparkle,
}) => {
  // Format formatted current expression
  const formattedExpr = expression ? displayExpression(expression) : '';
  const displayVal = hasError ? (errorMessage || 'Error') : (currentInput || '0');

  // Dynamic font sizing depending on length of current value so it never overflows
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 14) return 'text-2xl sm:text-3xl';
    if (len > 10) return 'text-3xl sm:text-4xl';
    if (len > 7) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div className="relative mb-4 sm:mb-6">
      {/* Hand-drawn Sparkle Burst on evaluation */}
      <SparkleEffect active={showSparkle} />

      {/* Sketched Display Frame */}
      <div className="relative bg-[#fcfaf4] rounded-lg p-3 sm:p-4 min-h-[96px] sm:min-h-[110px] flex flex-col justify-between shadow-[2px_3px_0px_rgba(40,43,50,0.18)] transition-all">
        {/* Hand-drawn pencil outline overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none text-[#333842] opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 300 100"
        >
          {/* Main sketchy border */}
          <path
            d="M 6,6 Q 150,4 294,6 Q 296,50 294,94 Q 150,96 6,94 Q 4,50 6,6 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Faint double pencil sketch trace */}
          <path
            d="M 7,8 Q 150,6 293,7 Q 295,50 293,93 Q 150,94 7,93 Q 5,50 7,8 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="12 4"
            opacity="0.4"
          />
        </svg>

        {/* Top line: Previous calculation & Current running expression */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-hand text-[#757a87] min-h-[22px] px-1 select-text">
          <span className="truncate max-w-[45%] opacity-80 italic">
            {previousCalculation ? `ans: ${previousCalculation}` : 'pencil sketch'}
          </span>
          <span className="truncate max-w-[55%] text-right font-medium text-[#4b505c]">
            {formattedExpr}
          </span>
        </div>

        {/* Main Display: Large handwritten calculation result or input */}
        <div className="flex items-end justify-end px-1 overflow-x-auto overflow-y-hidden no-scrollbar">
          <span
            className={`font-caveat font-bold tracking-tight text-right transition-all select-text ${
              hasError
                ? 'text-[#bc4747] text-2xl sm:text-3xl'
                : `text-[#23262d] ${getFontSizeClass(displayVal)}`
            }`}
            style={{
              textShadow: '0.5px 0.5px 0px rgba(35, 38, 45, 0.25)',
            }}
          >
            {displayVal}
          </span>
        </div>

        {/* Subtle graphite pencil smudge at the corner of display */}
        <div
          className="absolute bottom-1 left-2 w-8 h-2 rounded-full bg-[#30333b] opacity-5 pointer-events-none filter blur-[1px]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
