import React, { useState } from 'react';
import { NotebookBackground } from './components/NotebookBackground';
import { FloatingLeaves } from './components/FloatingLeaves';
import { Calculator } from './components/Calculator';
import { PianoAudioController } from './components/PianoAudioController';
import { DecorativeDoodles } from './components/DecorativeDoodles';
import { pencilSounds } from './audio/PencilSoundEffects';

export const App: React.FC = () => {
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  const handleToggleShortcuts = () => {
    pencilSounds.playPencilTap();
    setShowShortcuts((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* Background Floating Leaves (drifting gently behind the calculator) */}
      <FloatingLeaves layer="background" />

      {/* Main Notebook Canvas */}
      <NotebookBackground>
        {/* Top Navigation / Controls Bar */}
        <header className="flex items-center justify-between gap-2 pb-2 sm:pb-4 border-b border-[#ded7ca]/50 mb-3 sm:mb-6">
          {/* Left: Date / Notebook Entry Header */}
          <div className="flex flex-col select-none">
            <span className="text-[11px] sm:text-xs font-hand text-[#8c8577] tracking-wider uppercase">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-xs sm:text-sm font-caveat font-semibold text-[#484d59]">
              Quiet Afternoon Notes
            </span>
          </div>

          {/* Right: Audio Controller & Keyboard Shortcuts Guide */}
          <div className="flex items-center gap-2">
            <PianoAudioController />

            {/* Shortcuts help button */}
            <button
              type="button"
              onClick={handleToggleShortcuts}
              className="p-1.5 rounded-lg border border-[#424752] bg-[#fcfaf5] text-[#3e4450] hover:text-[#000] shadow-[1.5px_1.5px_0px_rgba(40,43,50,0.18)] text-xs font-hand transition-transform active:scale-90"
              title="Keyboard shortcuts"
              aria-label="View keyboard shortcuts"
            >
              ⌨️ <span className="hidden sm:inline">Keys</span>
            </button>
          </div>
        </header>

        {/* Keyboard Shortcuts Dialog Modal */}
        {showShortcuts && (
          <div className="relative z-50 mb-4 p-3.5 bg-[#fefcf8] border border-[#393e4a] rounded-lg shadow-[3px_4px_0px_rgba(40,43,50,0.15)] font-hand text-xs sm:text-sm animate-fade-in">
            <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-[#e2dacb]">
              <span className="font-bold text-[#2d313a] font-caveat text-lg">
                Keyboard Shortcuts
              </span>
              <button
                onClick={handleToggleShortcuts}
                className="text-[#6d7382] hover:text-[#111] font-bold text-base px-1"
                aria-label="Close shortcuts guide"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#484d5a]">
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">0-9</kbd> Numbers</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">+ - * /</kbd> Operators</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">Enter / =</kbd> Calculate</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">Backspace</kbd> Erase</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">Esc / C</kbd> Clear all</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#efe8d8] rounded border border-[#b2aaa0] text-xs">%</kbd> Percentage</div>
            </div>
          </div>
        )}

        {/* Decorative Doodles, Caption & Header Title */}
        <DecorativeDoodles />

        {/* Central Sketched Calculator */}
        <main className="my-auto py-2 flex flex-col items-center justify-center">
          <Calculator />
        </main>
      </NotebookBackground>

      {/* Foreground Floating Leaves (drifting in the front) */}
      <FloatingLeaves layer="foreground" />
    </div>
  );
};
