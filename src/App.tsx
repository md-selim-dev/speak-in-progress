/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandIdentity } from './types';
import { BRAND_PRESETS } from './data/brandPresets';
import { Header } from './components/Header';
import { BrandIdentityView } from './components/BrandIdentityView';
import { ToneScriptBibleView } from './components/ToneScriptBibleView';
import { ChannelMockupView } from './components/ChannelMockupView';
import { TeleprompterStudioView } from './components/TeleprompterStudioView';
import { ExportKitView } from './components/ExportKitModal';

export default function App() {
  const [activeBrand, setActiveBrand] = useState<BrandIdentity>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_brand_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = BRAND_PRESETS.find((p) => p.id === parsed.id);
        if (match) return match;
      }
    } catch {
      // ignore
    }
    return BRAND_PRESETS[0]; // Speak in Progress (Emerald Spark Flagship)
  });

  const [activeTab, setActiveTab] = useState<'identity' | 'tone' | 'channel' | 'teleprompter' | 'export'>('identity');

  const handleBrandChange = (newBrand: BrandIdentity) => {
    setActiveBrand(newBrand);
    try {
      localStorage.setItem('speak_in_progress_brand_v4', JSON.stringify(newBrand));
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickRecord = () => {
    setActiveTab('teleprompter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen flex flex-col text-stone-100 transition-colors duration-700 relative overflow-x-hidden selection:bg-emerald-400/25 selection:text-emerald-200"
      style={{ backgroundColor: activeBrand.colors.primary.hex }}
    >
      {/* Ambient background glow orb with smooth floating animation */}
      <div
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-1000 -z-10"
        style={{ backgroundColor: activeBrand.colors.accent.hex }}
      />

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Header
        activeBrand={activeBrand}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickRecord={handleQuickRecord}
      />

      {/* Main Content View with transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'identity' && (
          <div className="animate-fade-in">
            <BrandIdentityView
              activeBrand={activeBrand}
              setActiveBrand={handleBrandChange}
              onNavigateToTeleprompter={handleQuickRecord}
            />
          </div>
        )}

        {activeTab === 'tone' && (
          <div className="animate-fade-in">
            <ToneScriptBibleView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'channel' && (
          <div className="animate-fade-in">
            <ChannelMockupView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'teleprompter' && (
          <div className="animate-fade-in">
            <TeleprompterStudioView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="animate-fade-in">
            <ExportKitView activeBrand={activeBrand} />
          </div>
        )}
      </main>

      {/* Quiet, Human Editorial Footer */}
      <footer className="border-t border-white/[0.08] bg-stone-950/90 py-8 px-6 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                boxShadow: `0 0 10px ${activeBrand.colors.accent.hex}`,
              }}
            />
            <span className="font-bold text-stone-200 font-brand">Speak in Progress</span>
            <span className="text-stone-600">·</span>
            <span>Spoken English Journey & Studio</span>
          </div>

          <div className="text-stone-400 text-center sm:text-right">
            Progress, not perfection · Built for PC screen recording & public storytelling
          </div>
        </div>
      </footer>
    </div>
  );
}
