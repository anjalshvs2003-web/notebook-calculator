import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorButton, ButtonVariant } from './CalculatorButton';
import { calculateExpression } from '../utils/calculatorLogic';
import { pianoMusic } from '../audio/PianoSynthesizer';
import { pencilSounds } from '../audio/PencilSoundEffects';
import { CalculationHistoryItem } from '../types/calculator';

interface CalculatorProps {
  onFirstInteraction?: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onFirstInteraction }) => {
  // Calculator state
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [previousResult, setPreviousResult] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isJustEvaluated, setIsJustEvaluated] = useState<boolean>(false);
  const [showSparkle, setShowSparkle] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const hasInteractedRef = useRef<boolean>(false);

  // Trigger audio on first user activation
  const markInteraction = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      if (onFirstInteraction) {
        onFirstInteraction();
      }
      // If user had music enabled or this is their first calculation, resume/start peacefully
      const savedPlaying = localStorage.getItem('notebook_calc_music_playing');
      if (savedPlaying !== 'false') {
        pianoMusic.start();
      }
    }
  }, [onFirstInteraction]);

  // Handle number click (0 - 9)
  const handleNumber = useCallback((num: string) => {
    markInteraction();
    setHasError(false);

    if (isJustEvaluated) {
      setCurrentInput(num);
      setExpression('');
      setIsJustEvaluated(false);
      return;
    }

    if (currentInput === '0') {
      setCurrentInput(num);
    } else {
      // Limit number length to prevent overflow
      if (currentInput.length < 12) {
        setCurrentInput(currentInput + num);
      }
    }
  }, [currentInput, isJustEvaluated, markInteraction]);

  // Handle decimal point (.)
  const handleDecimal = useCallback(() => {
    markInteraction();
    setHasError(false);

    if (isJustEvaluated) {
      setCurrentInput('0.');
      setExpression('');
      setIsJustEvaluated(false);
      return;
    }

    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.');
    }
  }, [currentInput, isJustEvaluated, markInteraction]);

  // Handle operator (+, -, *, /)
  const handleOperator = useCallback((op: string) => {
    markInteraction();
    setHasError(false);

    // Map display symbols to standard math
    const normalizedOp = op === '×' ? '*' : op === '÷' ? '/' : op === '−' ? '-' : op;

    if (isJustEvaluated) {
      // Continue chaining calculation with previous answer
      setExpression(`${currentInput} ${normalizedOp} `);
      setCurrentInput('0');
      setIsJustEvaluated(false);
      return;
    }

    // If there's an ongoing expression, evaluate intermediate or append
    if (expression && currentInput === '0') {
      // Just swap trailing operator
      const trimmed = expression.trim();
      const tokens = trimmed.split(' ');
      if (['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) {
        tokens[tokens.length - 1] = normalizedOp;
        setExpression(tokens.join(' ') + ' ');
        return;
      }
    }

    setExpression((prev) => `${prev}${currentInput} ${normalizedOp} `);
    setCurrentInput('0');
  }, [currentInput, expression, isJustEvaluated, markInteraction]);

  // Handle evaluation (=)
  const handleEvaluate = useCallback(() => {
    markInteraction();
    if (hasError) return;

    const fullExpression = `${expression}${currentInput}`.trim();
    if (!fullExpression) return;

    const evalResult = calculateExpression(fullExpression);

    if (evalResult.success) {
      pencilSounds.playResultSparkle();
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 900);

      const newHistoryItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        expression: fullExpression,
        result: evalResult.result,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      setPreviousResult(evalResult.result);
      setCurrentInput(evalResult.result);
      setExpression('');
      setIsJustEvaluated(true);
      setHasError(false);
    } else {
      setHasError(true);
      setErrorMessage(evalResult.error || 'Cannot divide by 0');
      setIsJustEvaluated(true);
    }
  }, [expression, currentInput, hasError, markInteraction]);

  // Handle clear (C / AC)
  const handleClear = useCallback(() => {
    markInteraction();
    setCurrentInput('0');
    setExpression('');
    setHasError(false);
    setErrorMessage('');
    setIsJustEvaluated(false);
  }, [markInteraction]);

  // Handle backspace (⌫)
  const handleBackspace = useCallback(() => {
    markInteraction();
    if (hasError || isJustEvaluated) {
      handleClear();
      return;
    }

    if (currentInput.length > 1) {
      setCurrentInput(currentInput.slice(0, -1));
    } else {
      setCurrentInput('0');
    }
  }, [currentInput, hasError, isJustEvaluated, handleClear, markInteraction]);

  // Handle percentage (%)
  const handlePercentage = useCallback(() => {
    markInteraction();
    if (hasError) return;

    const val = parseFloat(currentInput);
    if (!isNaN(val)) {
      // If inside an addition/subtraction context (e.g. 200 + 10%), calculate 10% of 200 = 20
      const trimmed = expression.trim();
      const parts = trimmed.split(' ');
      if (parts.length >= 2) {
        const baseNum = parseFloat(parts[0]);
        const lastOp = parts[parts.length - 1];
        if (!isNaN(baseNum) && (lastOp === '+' || lastOp === '-')) {
          const percentVal = (baseNum * val) / 100;
          setCurrentInput(percentVal.toString());
          return;
        }
      }

      // Standalone unary percentage (val / 100)
      const res = (val / 100).toString();
      setCurrentInput(res);
    }
  }, [currentInput, expression, hasError, markInteraction]);

  // Handle sign toggle (±)
  const handleToggleSign = useCallback(() => {
    markInteraction();
    if (hasError || currentInput === '0') return;

    if (currentInput.startsWith('-')) {
      setCurrentInput(currentInput.slice(1));
    } else {
      setCurrentInput('-' + currentInput);
    }
  }, [currentInput, hasError, markInteraction]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture keyboard if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleNumber(key);
      } else if (key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleDecimal,
    handleOperator,
    handleEvaluate,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] my-auto">
      {/* Hand-sketched Notebook Notepad Frame */}
      <div className="relative bg-[#faf6ed] rounded-xl p-4 sm:p-6 shadow-[5px_7px_0px_rgba(40,43,50,0.12),12px_20px_30px_rgba(0,0,0,0.06)] border border-[#383d47]">
        {/* Subtle hand-drawn sketchy outer border overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none text-[#2d313a] opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 380 520"
        >
          <path
            d="M 10,8 Q 190,6 370,8 Q 372,260 370,512 Q 190,514 10,512 Q 8,260 10,8 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle second graphite sketch stroke for handmade warmth */}
          <path
            d="M 12,10 Q 190,8 368,10 Q 370,260 368,510 Q 190,512 12,510 Q 10,260 12,10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="24 8"
            opacity="0.35"
          />
        </svg>

        {/* Notebook header bar with Little Calculator title and History toggle */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs font-hand text-[#676c7a]">
            {/* Little sketch pencil icon */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#3e424c]/70 inline-block" />
            <span className="tracking-wider uppercase text-[11px] font-semibold">Graphite Calc</span>
          </div>

          {/* History drawer toggle */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-hand text-[#4b505c] hover:text-[#181a1e] flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#b2aaa0] hover:border-[#3a3e47] bg-[#fbf8f2] transition-all"
            title="View calculation history"
          >
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10" cy="10" r="7" />
              <polyline points="10 6 10 10 13 12" />
            </svg>
            <span>{showHistory ? 'Close Notes' : 'History'}</span>
          </button>
        </div>

        {/* Calculator Display */}
        <CalculatorDisplay
          expression={expression}
          currentInput={currentInput}
          previousCalculation={previousResult}
          hasError={hasError}
          errorMessage={errorMessage}
          showSparkle={showSparkle}
        />

        {/* History Notepad Slip Overlay (if opened) */}
        {showHistory ? (
          <div className="bg-[#fcfaf5] rounded-lg border border-[#3d424e] p-3 mb-4 max-h-56 overflow-y-auto font-hand text-xs sm:text-sm shadow-inner">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#ded7ca]">
              <span className="font-bold text-[#353942]">Recent Calculations</span>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[11px] text-[#848a97] hover:text-[#b43e3e] underline"
                >
                  Clear notes
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-center text-[#8e94a1] py-4 italic">No calculations yet. Start sketching!</p>
            ) : (
              <ul className="space-y-1.5">
                {history.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setCurrentInput(item.result);
                      setIsJustEvaluated(true);
                      setShowHistory(false);
                      pencilSounds.playPencilTap();
                    }}
                    className="flex justify-between items-center py-1 px-2 rounded hover:bg-[#efe9d8] cursor-pointer group transition-colors"
                  >
                    <span className="text-[#595f6e] truncate max-w-[65%] font-mono text-[11px]">
                      {item.expression}
                    </span>
                    <span className="font-bold text-[#23262d] font-caveat text-base group-hover:scale-105 transition-transform">
                      = {item.result}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {/* Buttons Grid: 4 columns x 5 rows */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {/* Row 1: Clear, Delete, %, Division */}
          <CalculatorButton
            label={currentInput !== '0' || expression !== '' ? 'C' : 'AC'}
            value="clear"
            variant="action"
            onClick={handleClear}
            shortcutHint="esc"
            ariaLabel="Clear calculation"
          />
          <CalculatorButton
            label="⌫"
            value="backspace"
            variant="action"
            onClick={handleBackspace}
            shortcutHint="del"
            ariaLabel="Backspace"
          />
          <CalculatorButton
            label="%"
            value="%"
            variant="action"
            onClick={handlePercentage}
            shortcutHint="%"
            ariaLabel="Percentage"
          />
          <CalculatorButton
            label="÷"
            value="÷"
            variant="operator"
            onClick={handleOperator}
            shortcutHint="/"
            ariaLabel="Divide"
          />

          {/* Row 2: 7, 8, 9, Multiplication */}
          <CalculatorButton
            label="7"
            value="7"
            variant="number"
            onClick={handleNumber}
            shortcutHint="7"
          />
          <CalculatorButton
            label="8"
            value="8"
            variant="number"
            onClick={handleNumber}
            shortcutHint="8"
          />
          <CalculatorButton
            label="9"
            value="9"
            variant="number"
            onClick={handleNumber}
            shortcutHint="9"
          />
          <CalculatorButton
            label="×"
            value="×"
            variant="operator"
            onClick={handleOperator}
            shortcutHint="*"
            ariaLabel="Multiply"
          />

          {/* Row 3: 4, 5, 6, Subtraction */}
          <CalculatorButton
            label="4"
            value="4"
            variant="number"
            onClick={handleNumber}
            shortcutHint="4"
          />
          <CalculatorButton
            label="5"
            value="5"
            variant="number"
            onClick={handleNumber}
            shortcutHint="5"
          />
          <CalculatorButton
            label="6"
            value="6"
            variant="number"
            onClick={handleNumber}
            shortcutHint="6"
          />
          <CalculatorButton
            label="−"
            value="−"
            variant="operator"
            onClick={handleOperator}
            shortcutHint="-"
            ariaLabel="Subtract"
          />

          {/* Row 4: 1, 2, 3, Addition */}
          <CalculatorButton
            label="1"
            value="1"
            variant="number"
            onClick={handleNumber}
            shortcutHint="1"
          />
          <CalculatorButton
            label="2"
            value="2"
            variant="number"
            onClick={handleNumber}
            shortcutHint="2"
          />
          <CalculatorButton
            label="3"
            value="3"
            variant="number"
            onClick={handleNumber}
            shortcutHint="3"
          />
          <CalculatorButton
            label="+"
            value="+"
            variant="operator"
            onClick={handleOperator}
            shortcutHint="+"
            ariaLabel="Add"
          />

          {/* Row 5: ± (Sign), 0, Decimal point, Equals */}
          <CalculatorButton
            label="±"
            value="±"
            variant="action"
            onClick={handleToggleSign}
            ariaLabel="Toggle positive or negative"
          />
          <CalculatorButton
            label="0"
            value="0"
            variant="number"
            onClick={handleNumber}
            shortcutHint="0"
          />
          <CalculatorButton
            label="."
            value="."
            variant="number"
            onClick={handleDecimal}
            shortcutHint="."
            ariaLabel="Decimal point"
          />
          <CalculatorButton
            label="="
            value="="
            variant="equal"
            onClick={handleEvaluate}
            shortcutHint="↵"
            ariaLabel="Equals"
          />
        </div>

        {/* Subtle bottom graphite signature */}
        <div className="mt-3.5 pt-2 border-t border-[#ded8cb]/80 flex justify-between items-center text-[11px] font-caveat text-[#858b99] select-none">
          <span>no. 2 graphite pencil</span>
          <span className="italic">accurate & handwritten</span>
        </div>
      </div>
    </div>
  );
};
