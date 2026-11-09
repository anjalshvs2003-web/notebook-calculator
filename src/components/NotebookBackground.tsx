import React from 'react';

interface NotebookBackgroundProps {
  children: React.ReactNode;
}

export const NotebookBackground: React.FC<NotebookBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#f6f2e9] text-[#2c2f36] flex flex-col justify-between overflow-x-hidden selection:bg-[#ded2be] selection:text-[#1e2024]">
      {/* SVG Filters for authentic pencil paper roughness & noise */}
      <svg className="hidden" aria-hidden="true">
        <filter id="paper-texture-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fffbf2" surfaceScale="1.2" result="light">
            <feDistantLight azimuth="60" elevation="55" />
          </feDiffuseLighting>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.98" />
            <feFuncG type="linear" slope="0.96" />
            <feFuncB type="linear" slope="0.92" />
          </feComponentTransfer>
          <feBlend mode="multiply" in="SourceGraphic" result="blend" />
        </filter>
        <filter id="pencil-stroke">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="rough" />
          <feDisplacementMap in="SourceGraphic" in2="rough" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Main Notebook Page Wrapper */}
      <div className="relative mx-auto my-3 sm:my-6 md:my-8 w-full max-w-4xl min-h-[92vh] bg-[#fbf8f0] shadow-[0_10px_35px_rgba(45,35,25,0.07),0_2px_8px_rgba(45,35,25,0.05),-3px_0_12px_rgba(45,35,25,0.04)] rounded-sm border border-[#e4ded0] flex flex-col">
        {/* Subtle Paper Grain Texture Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#d3c9b6 0.75px, transparent 0.75px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Notebook Ruled Lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 31px,
              rgba(182, 199, 214, 0.42) 31px,
              rgba(182, 199, 214, 0.42) 32px
            )`,
            backgroundPosition: '0 56px',
          }}
        />

        {/* Vertical Red Margin Line on the left */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none left-12 sm:left-20 md:left-24 w-[2px] bg-[#e38585] opacity-60 z-10"
          style={{
            boxShadow: '1px 0 0 rgba(227, 133, 133, 0.25)',
          }}
        />
        {/* Faint double margin trace typical of notebooks */}
        <div
          className="hidden sm:block absolute top-0 bottom-0 pointer-events-none left-[4.85rem] md:left-[5.85rem] w-[1px] bg-[#e38585] opacity-25 z-10"
        />

        {/* Notebook Spiral / Binder Holes on the Far Left */}
        <div className="absolute left-2 sm:left-4 top-10 bottom-10 flex flex-col justify-between pointer-events-none z-10">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="relative w-4 h-4 sm:w-5 sm:h-5">
              {/* Binder ring hole */}
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3b352b] opacity-80 shadow-inner flex items-center justify-center border border-[#2b2720]/40">
                <div className="w-2 h-2 rounded-full bg-[#201d18]" />
              </div>
              {/* Subtle paper indentation shadow */}
              <div className="absolute -inset-1 rounded-full border border-[#d6cbba] opacity-60" />
            </div>
          ))}
        </div>

        {/* Content slot */}
        <div className="relative z-20 flex-1 flex flex-col px-4 sm:px-12 md:px-16 py-6 sm:py-8 pl-14 sm:pl-28 md:pl-32">
          {children}
        </div>

        {/* Bottom notebook page edge detail */}
        <div className="relative h-6 border-t border-[#e8e2d4] bg-[#f7f3e8] px-8 flex items-center justify-between text-xs text-[#8c8577] font-caveat opacity-70 select-none">
          <span>no. 01 • sketch diary</span>
          <span>page 42</span>
        </div>
      </div>
    </div>
  );
};
