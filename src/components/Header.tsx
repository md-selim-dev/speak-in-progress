/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import { User } from 'firebase/auth';
import { LogOut, Globe, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeBrand: BrandIdentity;
  activeTab: 'identity' | 'tone' | 'channel' | 'teleprompter' | 'export';
  setActiveTab: (tab: 'identity' | 'tone' | 'channel' | 'teleprompter' | 'export') => void;
  onQuickRecord: () => void;
  currentUser?: User | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrand,
  activeTab,
  setActiveTab,
  onQuickRecord,
  currentUser,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-stone-950/85 backdrop-blur-xl shadow-card-elevated">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no clutter) */}
        <button
          onClick={() => setActiveTab('identity')}
          className="group flex items-center gap-3 text-left transition-transform active:scale-95"
        >
          <LogoMark
            brand={activeBrand}
            size="xs"
            layout="icon-only"
            isAnimated={true}
          />
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-extrabold tracking-tight text-white transition-colors whitespace-nowrap font-brand"
              style={{
                textShadow: `0 0 20px ${activeBrand.colors.accent.hex}33`,
              }}
            >
              Speak in Progress
            </span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-slate-400 bg-white/[0.03] shadow-badge-inset hidden sm:inline"
            >
              STUDIO
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line navigation links with animated active state */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-400">
          {[
            { id: 'teleprompter', label: 'Teleprompter Studio' },
            { id: 'identity', label: 'Brand Identity' },
            { id: 'tone', label: 'Voice & Tone' },
            { id: 'channel', label: 'Banner & Channel' },
            { id: 'export', label: 'Export Kit' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`relative py-1 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'hover:text-stone-200 text-stone-400'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-3.5 left-0 right-0 h-[2px] rounded-full transition-all shadow-sm"
                    style={{
                      backgroundColor: activeBrand.colors.accent.hex,
                      boxShadow: `0 0 12px ${activeBrand.colors.accent.hex}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Quick Record */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onQuickRecord}
            className="group relative px-4 py-2 text-xs font-bold text-white rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2 overflow-hidden shadow-modern-glow"
            style={{
              backgroundColor: activeBrand.colors.accent.hex,
              color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
            }}
          >
            {/* Shimmer line animation */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
            <span className="relative font-extrabold">Record Screen</span>
          </button>

          {/* Clean, quiet Sign Out action */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3 py-2 text-xs font-semibold text-stone-400 hover:text-white bg-stone-900/90 hover:bg-stone-800 rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center justify-between border-t border-white/[0.06] px-4 py-2 bg-stone-950/90 overflow-x-auto text-xs font-medium text-stone-400 gap-4">
        {[
          { id: 'teleprompter', label: 'Teleprompter' },
          { id: 'identity', label: 'Identity' },
          { id: 'tone', label: 'Tone' },
          { id: 'channel', label: 'Channel' },
          { id: 'export', label: 'Export' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className="whitespace-nowrap transition-colors"
            style={
              activeTab === item.id
                ? { color: activeBrand.colors.accent.hex, fontWeight: 700 }
                : {}
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
