import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative flex-shrink-0" style={{ width: 390, height: 844 }}>
      {/* Phone body */}
      <div
        className="absolute inset-0 rounded-[54px] overflow-hidden"
        style={{
          boxShadow:
            '0 0 0 2px #2A2A2A, 0 0 0 4px #1A1A1A, 0 50px 100px rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.6)',
          background: '#0D0D0D',
        }}
      >
        {/* Screen area */}
        <div className="absolute inset-[3px] rounded-[51px] overflow-hidden bg-black">
          {/* Dynamic Island */}
          <div
            className="absolute top-[14px] left-1/2 -translate-x-1/2 z-50 rounded-full"
            style={{
              width: 126,
              height: 37,
              background: '#000',
              boxShadow: '0 0 0 1px #1A1A1A',
            }}
          />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[59px] z-40 flex items-end px-7 pb-2 pointer-events-none">
            <span className="text-white text-[14px] font-semibold tracking-tight">9:41</span>
            <div className="ml-auto flex items-center gap-[6px]">
              {/* Signal bars */}
              <div className="flex gap-[2px] items-end h-[12px]">
                <div className="w-[3px] h-[5px] bg-white rounded-[1px] opacity-40" />
                <div className="w-[3px] h-[7px] bg-white rounded-[1px] opacity-60" />
                <div className="w-[3px] h-[9px] bg-white rounded-[1px] opacity-80" />
                <div className="w-[3px] h-[12px] bg-white rounded-[1px]" />
              </div>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                <path d="M3.5 6.5a6.5 6.5 0 019 0l-1.5 1.5a4.5 4.5 0 00-6 0L3.5 6.5z" opacity="0.7" />
                <path d="M0.5 3.5A10.5 10.5 0 0115.5 3.5l-1.5 1.5A8.5 8.5 0 002 5L0.5 3.5z" opacity="0.4" />
              </svg>
              {/* Battery */}
              <div className="flex items-center">
                <div
                  className="relative rounded-[3px]"
                  style={{ width: 25, height: 12, border: '1px solid rgba(255,255,255,0.5)' }}
                >
                  <div
                    className="absolute inset-[1.5px] rounded-[1.5px]"
                    style={{ width: '70%', background: 'white' }}
                  />
                </div>
                <div
                  className="rounded-r-[1px]"
                  style={{
                    width: 2,
                    height: 5,
                    background: 'rgba(255,255,255,0.4)',
                    marginLeft: 1,
                  }}
                />
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="absolute inset-0 overflow-hidden">{children}</div>

          {/* Home Indicator */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
            style={{ width: 130, height: 5, background: 'rgba(255,255,255,0.35)' }}
          />
        </div>
      </div>

      {/* Side volume buttons */}
      <div
        className="absolute rounded-l-sm"
        style={{
          left: -4,
          top: 96,
          width: 4,
          height: 48,
          background: '#2A2A2A',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.5)',
        }}
      />
      <div
        className="absolute rounded-l-sm"
        style={{
          left: -4,
          top: 154,
          width: 4,
          height: 64,
          background: '#2A2A2A',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.5)',
        }}
      />
      <div
        className="absolute rounded-l-sm"
        style={{
          left: -4,
          top: 228,
          width: 4,
          height: 64,
          background: '#2A2A2A',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.5)',
        }}
      />
      {/* Power button */}
      <div
        className="absolute rounded-r-sm"
        style={{
          right: -4,
          top: 160,
          width: 4,
          height: 80,
          background: '#2A2A2A',
          boxShadow: '1px 0 3px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}
