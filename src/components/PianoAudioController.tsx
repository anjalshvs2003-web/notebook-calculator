import React, { useState, useEffect } from 'react';
import { pianoMusic } from '../audio/PianoSynthesizer';
import { pencilSounds } from '../audio/PencilSoundEffects';

const STORAGE_KEY_MUSIC_PLAYING = 'notebook_calc_music_playing';
const STORAGE_KEY_MUSIC_MUTED = 'notebook_calc_music_muted';
const STORAGE_KEY_MUSIC_VOL = 'notebook_calc_music_vol';
const STORAGE_KEY_SFX_ENABLED = 'notebook_calc_sfx_enabled';

interface PianoAudioControllerProps {
  onMusicStarted?: () => void;
}

export const PianoAudioController: React.FC<PianoAudioControllerProps> = ({ onMusicStarted }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [isSfxEnabled, setIsSfxEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedMuted = localStorage.getItem(STORAGE_KEY_MUSIC_MUTED);
      if (savedMuted !== null) {
        const muted = savedMuted === 'true';
        setIsMuted(muted);
        if (muted) pianoMusic.toggleMute();
      }

      const savedVol = localStorage.getItem(STORAGE_KEY_MUSIC_VOL);
      if (savedVol !== null) {
        const vol = parseFloat(savedVol);
        if (!isNaN(vol)) {
          setVolume(vol);
          pianoMusic.setVolume(vol);
        }
      }

      const savedSfx = localStorage.getItem(STORAGE_KEY_SFX_ENABLED);
      if (savedSfx !== null) {
        const sfx = savedSfx === 'true';
        setIsSfxEnabled(sfx);
        pencilSounds.setEnabled(sfx);
      }
    } catch (e) {
      // Ignore storage access errors
    }
  }, []);

  const handleTogglePlay = async () => {
    pencilSounds.playPencilTap();
    if (isPlaying) {
      pianoMusic.pause();
      setIsPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY_MUSIC_PLAYING, 'false');
      } catch (e) {}
    } else {
      const success = await pianoMusic.start();
      if (success) {
        setIsPlaying(true);
        if (onMusicStarted) onMusicStarted();
        try {
          localStorage.setItem(STORAGE_KEY_MUSIC_PLAYING, 'true');
        } catch (e) {}
      }
    }
  };

  const handleToggleMute = () => {
    pencilSounds.playPencilTap();
    const muted = pianoMusic.toggleMute();
    setIsMuted(muted);
    try {
      localStorage.setItem(STORAGE_KEY_MUSIC_MUTED, muted ? 'true' : 'false');
    } catch (e) {}
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    pianoMusic.setVolume(val);
    if (isMuted && val > 0) {
      pianoMusic.toggleMute();
      setIsMuted(false);
    }
    try {
      localStorage.setItem(STORAGE_KEY_MUSIC_VOL, val.toString());
    } catch (err) {}
  };

  const handleToggleSfx = () => {
    const nextState = !isSfxEnabled;
    setIsSfxEnabled(nextState);
    pencilSounds.setEnabled(nextState);
    if (nextState) pencilSounds.playPencilTap();
    try {
      localStorage.setItem(STORAGE_KEY_SFX_ENABLED, nextState ? 'true' : 'false');
    } catch (e) {}
  };

  return (
    <div className="relative z-30 select-none">
      <div className="flex items-center gap-2 bg-[#fcfaf5]/90 border border-[#424752] rounded-lg px-2.5 py-1.5 shadow-[2px_2px_0px_rgba(40,43,50,0.18)] transition-all">
        {/* Play / Pause Hand-drawn Button */}
        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-hand font-medium text-[#2d313a] hover:text-[#000] focus:outline-none transition-transform active:scale-95"
          title={isPlaying ? 'Pause peaceful piano' : 'Play peaceful piano'}
        >
          {/* Hand-sketched Play or Pause Icon */}
          <span className="w-5 h-5 flex items-center justify-center">
            {isPlaying ? (
              <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#353942]" fill="currentColor">
                <rect x="4" y="3" width="3.5" height="14" rx="1" />
                <rect x="12.5" y="3" width="3.5" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#353942]" fill="currentColor">
                <path d="M5 3.5v13a1 1 0 001.55.83l10-6.5a1 1 0 000-1.66l-10-6.5A1 1 0 005 3.5z" />
              </svg>
            )}
          </span>

          <span className="hidden sm:inline">
            {isPlaying ? 'Pause Piano' : 'Soft Piano'}
          </span>
        </button>

        {/* Animated Musical Note Doodle when playing */}
        {isPlaying && !isMuted && (
          <div className="flex items-center gap-1 text-[#4f5563] animate-pulse">
            <svg viewBox="0 0 20 20" className="w-4 h-4 inline-block transform -rotate-6">
              <path
                d="M8,15 A3,2 0 1,1 5,13 L5,4 L14,2 L14,12 A3,2 0 1,1 11,10 L11,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-caveat text-[#787f90] hidden md:inline">~ peaceful ~</span>
          </div>
        )}

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-1 text-[#404552] hover:text-[#111] focus:outline-none transition-transform active:scale-90"
          title={isMuted ? 'Unmute piano' : 'Mute piano'}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>

        {/* Volume Slider or Expand Toggle */}
        <div className="hidden sm:flex items-center gap-1.5 ml-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Piano volume"
            className="w-16 h-1 bg-[#d5cdbe] rounded-lg appearance-none cursor-pointer accent-[#3c414d]"
          />
        </div>

        {/* Pencil Sound Effects Toggle */}
        <button
          onClick={handleToggleSfx}
          className={`px-1.5 py-0.5 rounded text-[11px] font-hand border ${
            isSfxEnabled 
              ? 'border-[#3f434e] text-[#2c3038] bg-[#f0ebd9]' 
              : 'border-[#b5ae9f] text-[#8a8478] bg-transparent line-through'
          }`}
          title={isSfxEnabled ? 'Pencil sounds on' : 'Pencil sounds muted'}
        >
          ✏️ tap
        </button>
      </div>
    </div>
  );
};
