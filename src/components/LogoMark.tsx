/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandIdentity } from '../types';

interface LogoMarkProps {
  brand: BrandIdentity;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  layout?: 'icon-only' | 'horizontal' | 'stacked';
  showTagline?: boolean;
  accentColor?: string;
  isAnimated?: boolean;
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  brand,
  size = 'md',
  layout = 'horizontal',
  showTagline = false,
  accentColor,
  isAnimated = false,
  className = '',
}) => {
  const accent = accentColor || brand.colors.accent.hex;

  const iconSizes = {
    xs: 24,
    sm: 32,
    md: 46,
    lg: 68,
    xl: 104,
    hero: 140,
  };

  const dim = iconSizes[size];

  // Modern clean vector emblem for "Speak in Progress"
  const renderGlyph = () => {
    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        {/* Ambient subtle glow behind mark */}
        {isAnimated && (
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse-halo pointer-events-none"
            style={{ backgroundColor: accent }}
          />
        )}

        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 shrink-0 transition-transform duration-300 ${
            isAnimated ? 'hover:scale-105' : ''
          }`}
          style={{
            filter: `drop-shadow(0 4px 12px ${accent}25)`,
          }}
        >
          <defs>
            <linearGradient id="spAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor={accent} />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>

          {/* Standalone Main Logo Geometry - Unboxed without square lines */}

          {/* Interlocking S & P Progress Geometry */}
          {/* Continuous Ribbon: S curve flowing into P's forward trajectory */}
          <path
            d="M30 32C30 25.3726 35.3726 20 42 20H56C62.6274 20 68 25.3726 68 32C68 38.6274 62.6274 44 56 44H42C35.3726 44 30 49.3726 30 56C30 62.6274 35.3726 68 42 68H56"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* The Progress Loop: P loop interlocking with an ascending vocal accent */}
          <path
            d="M44 44H64C71.732 44 78 50.268 78 58C78 65.732 71.732 72 64 72H46"
            stroke="url(#spAccentGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Ascending Momentum Arrow (Top-Right Progress Cue) */}
          <path
            d="M62 20L78 20M78 20L78 36M78 20L60 38"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Voice Waveform Bars in Center Acoustic Chamber */}
          <rect
            x="36"
            y="48"
            width="3.5"
            height="10"
            rx="1.75"
            fill={accent}
            className={isAnimated ? 'animate-wave-bar-1 origin-center' : ''}
          />
          <rect
            x="43"
            y="44"
            width="3.5"
            height="18"
            rx="1.75"
            fill="#FFFFFF"
            className={isAnimated ? 'animate-wave-bar-2 origin-center' : ''}
          />
          <rect
            x="50"
            y="40"
            width="3.5"
            height="26"
            rx="1.75"
            fill={accent}
            className={isAnimated ? 'animate-wave-bar-3 origin-center' : ''}
          />
          <rect
            x="57"
            y="46"
            width="3.5"
            height="14"
            rx="1.75"
            fill="#FFFFFF"
            className={isAnimated ? 'animate-wave-bar-4 origin-center' : ''}
          />

          {/* Progress Origin Dot */}
          <circle cx="70" cy="27" r="4.5" fill={accent} />
        </svg>
      </div>
    );
  };

  if (layout === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderGlyph()}</div>;
  }

  const titleSizes = {
    xs: 'text-sm font-bold',
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
    hero: 'text-4xl md:text-5xl font-extrabold',
  };

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {renderGlyph()}
        <div className="flex flex-col items-center">
          <span className={`tracking-tight text-white ${titleSizes[size]}`}>
            {brand.name}
          </span>
          {showTagline && (
            <span className="text-xs text-stone-400 mt-1 max-w-xs font-medium">
              {brand.tagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {renderGlyph()}
      <div className="flex flex-col min-w-0">
        <span className={`tracking-tight text-white whitespace-nowrap ${titleSizes[size]}`}>
          {brand.name}
        </span>
        {showTagline && (
          <span className="text-xs text-stone-400 truncate max-w-xs md:max-w-md font-medium">
            {brand.tagline}
          </span>
        )}
      </div>
    </div>
  );
};
