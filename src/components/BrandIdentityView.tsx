/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import { BRAND_PRESETS } from '../data/brandPresets';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Sliders,
  Type,
  Activity,
} from 'lucide-react';

interface BrandIdentityViewProps {
  activeBrand: BrandIdentity;
  setActiveBrand: (brand: BrandIdentity) => void;
  onNavigateToTeleprompter: () => void;
}

export const BrandIdentityView: React.FC<BrandIdentityViewProps> = ({
  activeBrand,
  setActiveBrand,
  onNavigateToTeleprompter,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [customAccent, setCustomAccent] = useState<string>(activeBrand.colors.accent.hex);
  const [logoPreviewMode, setLogoPreviewMode] = useState<'horizontal' | 'stacked' | 'icon-only'>('horizontal');
  const [isLogoAnimated, setIsLogoAnimated] = useState<boolean>(true);
  const [customTestText, setCustomTestText] = useState<string>(
    'Speaking English with mistakes is proof of progress. Ongoing honest reps.'
  );

  React.useEffect(() => {
    setCustomAccent(activeBrand.colors.accent.hex);
  }, [activeBrand]);

  const handleCopy = (text: string, type: 'hex' | 'handle') => {
    navigator.clipboard.writeText(text);
    if (type === 'hex') {
      setCopiedHex(text);
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedHandle(text);
      setTimeout(() => setCopiedHandle(null), 2000);
    }
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('active-logo-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAvatarPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rich dark gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 800);
    bgGrad.addColorStop(0, '#061411');
    bgGrad.addColorStop(1, '#020807');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 800);

    // Ambient radial glow behind the main logo (unboxed, no square line)
    const radialGlow = ctx.createRadialGradient(400, 400, 40, 400, 400, 360);
    radialGlow.addColorStop(0, `${customAccent}35`);
    radialGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(400, 400, 360, 0, Math.PI * 2);
    ctx.fill();

    // Draw S-P Modern Interlocking Progress Geometry
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 54;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // S ribbon
    ctx.beginPath();
    ctx.moveTo(240, 260);
    ctx.bezierCurveTo(240, 200, 320, 160, 420, 160);
    ctx.bezierCurveTo(520, 160, 560, 200, 560, 260);
    ctx.bezierCurveTo(560, 320, 500, 360, 420, 360);
    ctx.bezierCurveTo(340, 360, 240, 400, 240, 480);
    ctx.bezierCurveTo(240, 560, 320, 600, 420, 600);
    ctx.lineTo(540, 600);
    ctx.stroke();

    // P forward progress loop
    ctx.strokeStyle = customAccent;
    ctx.beginPath();
    ctx.moveTo(420, 360);
    ctx.lineTo(540, 360);
    ctx.bezierCurveTo(620, 360, 670, 410, 670, 480);
    ctx.bezierCurveTo(670, 550, 620, 600, 540, 600);
    ctx.lineTo(380, 600);
    ctx.stroke();

    // Ascending Momentum Arrow (top-right)
    ctx.strokeStyle = customAccent;
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.moveTo(520, 180);
    ctx.lineTo(650, 180);
    ctx.lineTo(650, 310);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(650, 180);
    ctx.lineTo(500, 330);
    ctx.stroke();

    // Equalizer bars in center
    ctx.fillStyle = customAccent;
    ctx.beginPath();
    ctx.roundRect(320, 420, 26, 80, 13);
    ctx.roundRect(380, 390, 26, 140, 13);
    ctx.roundRect(440, 360, 26, 200, 13);
    ctx.roundRect(500, 410, 26, 100, 13);
    ctx.fill();

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-avatar-800x800.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWatermarkPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // S-P Modern Interlocking Progress Geometry on 150x150 alpha
    ctx.translate(75, 75);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(-24, -28);
    ctx.bezierCurveTo(-24, -42, -8, -48, 8, -48);
    ctx.bezierCurveTo(24, -48, 30, -40, 30, -28);
    ctx.bezierCurveTo(30, -16, 18, -10, 2, -8);
    ctx.bezierCurveTo(-18, -6, -28, 2, -28, 18);
    ctx.bezierCurveTo(-28, 34, -14, 44, 8, 44);
    ctx.lineTo(26, 44);
    ctx.stroke();

    ctx.strokeStyle = customAccent;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(26, -10);
    ctx.bezierCurveTo(42, -10, 48, 0, 48, 16);
    ctx.bezierCurveTo(48, 32, 42, 44, 26, 44);
    ctx.lineTo(-4, 44);
    ctx.stroke();

    ctx.strokeStyle = customAccent;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(22, -38);
    ctx.lineTo(46, -38);
    ctx.lineTo(46, -14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(46, -38);
    ctx.lineTo(20, -12);
    ctx.stroke();

    ctx.fillStyle = customAccent;
    ctx.beginPath();
    ctx.roundRect(-22, 24, 4, 12, 2);
    ctx.roundRect(-14, 18, 4, 18, 2);
    ctx.roundRect(-6, 12, 4, 24, 2);
    ctx.roundRect(2, 20, 4, 16, 2);
    ctx.fill();

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-watermark-150x150.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Brand Hero Card with Multi-layered Shadow & Glow - Fully Responsive */}
      <section className="relative overflow-hidden bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
        <div
          className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 animate-pulse-halo"
          style={{ backgroundColor: activeBrand.colors.accent.hex }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-white/[0.08]">
          <div className="space-y-2.5">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm"
              style={{
                color: activeBrand.colors.accent.hex,
                backgroundColor: `${activeBrand.colors.accent.hex}15`,
                borderColor: `${activeBrand.colors.accent.hex}30`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official YouTube Identity</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-brand">
                Speak in Progress
              </h1>
              <span
                className="text-[11px] sm:text-xs font-mono font-medium px-2.5 py-1 rounded-md border"
                style={{
                  color: activeBrand.colors.accent.hex,
                  borderColor: `${activeBrand.colors.accent.hex}30`,
                  backgroundColor: `${activeBrand.colors.accent.hex}10`,
                }}
              >
                {activeBrand.colors.accent.name} Edition
              </span>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl leading-relaxed">
              Modern, clean, and authentic visual branding built for your pace and comfort. Designed for PC screen recordings, structured storytelling, and unscripted retellings whenever you choose to record.
            </p>
          </div>

          {/* Theme Edition Switcher */}
          <div className="flex flex-col gap-2 self-start lg:self-center w-full sm:w-auto">
            <span className="text-[11px] font-mono uppercase text-stone-400 font-semibold">
              Visual Palette:
            </span>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-stone-950/90 p-1.5 rounded-2xl border border-white/10 shadow-card-elevated">
              {BRAND_PRESETS.map((preset) => {
                const isSelected = preset.id === activeBrand.id;
                const editionLabel =
                  preset.id === 'speak-in-progress-emerald'
                    ? 'Emerald Spark (Flagship)'
                    : preset.id === 'speak-in-progress-cobalt'
                    ? 'Modern Cobalt'
                    : 'Studio Amber';

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActiveBrand(preset);
                      setCustomAccent(preset.colors.accent.hex);
                    }}
                    className={`relative flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap text-center ${
                      isSelected
                        ? 'shadow-modern-glow'
                        : 'text-stone-400 hover:text-white'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: preset.colors.accent.hex,
                            color: preset.colors.accent.textDark ? '#061210' : '#FFFFFF',
                          }
                        : {}
                    }
                  >
                    <span>{editionLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brand Narrative & Live Animated Equalizer Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-2">
              <Activity
                className="w-3.5 h-3.5"
                style={{ color: activeBrand.colors.accent.hex }}
              />
              <span>Channel Philosophy & Premise</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
              {activeBrand.conceptPhilosophy}
            </p>

            {/* Live Audio Equalizer Animation Motif */}
            <div className="bg-stone-950/70 border border-white/[0.06] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-badge-inset">
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-1 h-6 sm:h-7">
                  <div
                    className="w-1.5 rounded-full animate-wave-bar-1"
                    style={{ backgroundColor: activeBrand.colors.accent.hex }}
                  />
                  <div className="w-1.5 rounded-full bg-white animate-wave-bar-2" />
                  <div
                    className="w-1.5 rounded-full animate-wave-bar-3"
                    style={{ backgroundColor: activeBrand.colors.accent.hex }}
                  />
                  <div
                    className="w-1.5 rounded-full animate-wave-bar-4"
                    style={{ backgroundColor: activeBrand.colors.secondary.hex }}
                  />
                  <div className="w-1.5 rounded-full bg-white animate-wave-bar-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Active Spoken Cadence</span>
                  <span className="text-stone-400 text-[11px]">Unscripted Retelling Mode Enabled</span>
                </div>
              </div>
              <div
                className="text-[11px] sm:text-xs font-mono font-bold hidden sm:block"
                style={{ color: activeBrand.colors.accent.hex }}
              >
                PROGRESS &gt; PERFECTION
              </div>
            </div>
          </div>

          {/* YouTube Handles suggestions */}
          <div className="bg-stone-950/90 rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-card-elevated space-y-3">
            <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Recommended YouTube Handles
            </div>
            <div className="space-y-2">
              {activeBrand.handleSuggestions.map((handle) => (
                <div
                  key={handle}
                  className="flex items-center justify-between text-xs bg-stone-900/80 hover:bg-stone-850 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-white/[0.06] transition-all hover:border-emerald-500/40"
                >
                  <span className="font-mono text-stone-200 font-medium truncate">{handle}</span>
                  <button
                    onClick={() => handleCopy(handle, 'handle')}
                    className="text-stone-400 hover:text-emerald-400 p-1 shrink-0"
                    title="Copy Handle"
                  >
                    {copiedHandle === handle ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-stone-500">
              Claim handle in YouTube Studio Customization.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Logo Studio with Modern Shadows and Motion */}
      <section className="space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: activeBrand.colors.accent.hex }}
            >
              01. Visual Mark & Emblem
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vector Logo & Brand Mark
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
              Modern S-P interlocking geometry combining vocal soundwaves, acoustic loop, and forward momentum arrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsLogoAnimated(!isLogoAnimated)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5"
              style={
                isLogoAnimated
                  ? {
                      backgroundColor: `${customAccent}18`,
                      borderColor: `${customAccent}50`,
                      color: customAccent,
                    }
                  : {
                      backgroundColor: '#1c1917',
                      borderColor: '#292524',
                      color: '#a8a29e',
                    }
              }
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isLogoAnimated ? 'Animation: ON' : 'Animation: OFF'}</span>
            </button>
            <button
              onClick={handleDownloadSVG}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-stone-200 bg-stone-900 hover:bg-stone-850 rounded-xl border border-white/10 shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
            <button
              onClick={handleDownloadAvatarPNG}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-stone-200 bg-stone-900 hover:bg-stone-850 rounded-xl border border-white/10 shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Avatar (800x800)</span>
            </button>
            <button
              onClick={handleDownloadWatermarkPNG}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-extrabold rounded-xl shadow-modern-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: customAccent,
                color: '#061210',
              }}
              title="Official YouTube Video Watermark (150px × 150px)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Watermark (150×150)</span>
            </button>
          </div>
        </div>

        {/* Logo Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Main Visual Stage */}
          <div className="lg:col-span-8 bg-stone-950/70 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-12 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] relative overflow-hidden shadow-card-elevated group">
            <div
              className="absolute w-60 sm:w-80 h-60 sm:h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
              style={{ backgroundColor: customAccent }}
            />

            <div className="absolute inset-0 bg-modern-grid opacity-30 pointer-events-none" />

            <div id="active-logo-svg" className="relative z-10 py-4 sm:py-6 transition-all">
              <LogoMark
                brand={activeBrand}
                size="xl"
                layout={logoPreviewMode}
                showTagline={logoPreviewMode !== 'icon-only'}
                accentColor={customAccent}
                isAnimated={isLogoAnimated}
              />
            </div>

            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-center justify-between text-[10px] sm:text-xs text-stone-500 border-t border-white/[0.06] pt-2 sm:pt-3">
              <span>Layout: {logoPreviewMode.toUpperCase()}</span>
              <span className="truncate">Interlocking S-P Progression Ribbon</span>
            </div>
          </div>

          {/* Controls & Quick Styles */}
          <div className="lg:col-span-4 bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-card-elevated backdrop-blur-md">
            {/* Layout switch */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
                <Layers
                  className="w-3.5 h-3.5"
                  style={{ color: customAccent }}
                />
                <span>Layout Variant</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['horizontal', 'stacked', 'icon-only'] as const).map((mode) => {
                  const isCur = logoPreviewMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setLogoPreviewMode(mode)}
                      className="px-2.5 py-2 text-xs font-semibold rounded-xl capitalize border transition-all duration-200 text-center"
                      style={
                        isCur
                          ? {
                              backgroundColor: customAccent,
                              color: '#061210',
                              borderColor: customAccent,
                              fontWeight: 700,
                            }
                          : {
                              backgroundColor: 'rgba(12, 10, 9, 0.8)',
                              color: '#a8a29e',
                              borderColor: 'rgba(255, 255, 255, 0.08)',
                            }
                      }
                    >
                      {mode.replace('-', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Hue Tuner */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
                  <Sliders
                    className="w-3.5 h-3.5"
                    style={{ color: customAccent }}
                  />
                  <span>Accent Energy</span>
                </div>
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                  style={{
                    color: customAccent,
                    borderColor: `${customAccent}40`,
                    backgroundColor: `${customAccent}10`,
                  }}
                >
                  {customAccent}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { name: 'Emerald Spark (Flagship)', hex: '#10B981' },
                  { name: 'Electric Neo Mint', hex: '#00F5A0' },
                  { name: 'Electric Cobalt', hex: '#3B82F6' },
                  { name: 'Sunrise Amber', hex: '#F59E0B' },
                  { name: 'Cyan Horizon', hex: '#06B6D4' },
                  { name: 'Violet Surge', hex: '#8B5CF6' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setCustomAccent(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                      customAccent.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-modern-glow'
                        : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* YouTube Avatar Circle Preview */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Avatar Preview
              </div>
              <div className="flex items-center gap-3.5 bg-stone-950/80 p-3 rounded-2xl border border-white/[0.08] shadow-badge-inset">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-inner flex items-center justify-center bg-stone-900 shrink-0"
                  style={{ borderColor: `${customAccent}80` }}
                >
                  <LogoMark
                    brand={activeBrand}
                    size="xs"
                    layout="icon-only"
                    accentColor={customAccent}
                    isAnimated={isLogoAnimated}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">Speak in Progress</div>
                  <div className="text-[11px] text-stone-400 truncate">{activeBrand.handleSuggestions[0]}</div>
                </div>
              </div>
            </div>

            {/* YouTube Video Watermark Preview (150x150) */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300 uppercase tracking-wider">
                <span>Video Watermark (150×150)</span>
                <span className="font-mono text-[10px]" style={{ color: customAccent }}>Official</span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-stone-950/80 p-3 rounded-2xl border border-white/[0.08] shadow-badge-inset">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl overflow-hidden border flex items-center justify-center bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:6px_6px] shrink-0"
                    style={{ borderColor: `${customAccent}60` }}
                  >
                    <div className="w-8 h-8">
                      <LogoMark
                        brand={activeBrand}
                        size="xs"
                        layout="icon-only"
                        accentColor={customAccent}
                        isAnimated={false}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Alpha Watermark</div>
                    <div className="text-[10px] text-stone-400 truncate">150 × 150 px PNG</div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadWatermarkPNG}
                  className="p-2 rounded-xl text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-white/10 shrink-0 transition-all active:scale-95"
                  title="Download 150x150 Watermark PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 60-30-10 Color Architecture with Multi-Layered Shadows */}
      <section className="space-y-5 sm:space-y-6">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: activeBrand.colors.accent.hex }}
          >
            02. Palette Harmony
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            60-30-10 Color Architecture
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Balanced contrast: 60% dominant {activeBrand.colors.primary.name.toLowerCase()} ground, 30% {activeBrand.colors.secondary.name.toLowerCase()} structural cards, and 10% {activeBrand.colors.accent.name.toLowerCase()} focal accent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Object.entries(activeBrand.colors).map(([key, swatch]) => (
            <div
              key={key}
              className="group bg-stone-900/60 border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 hover:shadow-card-hover transition-all duration-300 shadow-card-elevated"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white capitalize truncate">{swatch.name}</div>
                    <div className="text-[11px] sm:text-xs text-stone-400 truncate">{swatch.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(swatch.hex, 'hex')}
                  className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors shrink-0"
                  title="Copy Hex"
                >
                  {copiedHex === swatch.hex ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="bg-stone-950/80 p-2.5 sm:p-3 rounded-xl border border-white/[0.06] space-y-1 shadow-badge-inset">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-500">HEX</span>
                  <span className="text-stone-200 font-bold">{swatch.hex}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-500">HSL</span>
                  <span className="text-stone-300">{swatch.hsl}</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 leading-snug">
                {swatch.notes}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Hierarchy */}
      <section className="space-y-5 sm:space-y-6">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: activeBrand.colors.accent.hex }}
          >
            03. Type Hierarchy
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Typographic Scale & Specimen
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Strict pairing: Plus Jakarta Sans for brand headlines and DM Sans for teleprompter clarity.
          </p>
        </div>

        <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-card-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
              <Type
                className="w-3.5 h-3.5"
                style={{ color: activeBrand.colors.accent.hex }}
              />
              <span>Live Specimen Tester</span>
            </div>
            <div className="text-xs text-stone-400 font-mono">
              Display: Plus Jakarta Sans · Body: DM Sans
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
                Custom Preview String
              </label>
              <input
                type="text"
                value={customTestText}
                onChange={(e) => setCustomTestText(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none transition-colors shadow-badge-inset"
                style={{
                  outlineColor: activeBrand.colors.accent.hex,
                }}
              />
            </div>

            {/* Specimen ladder */}
            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase">
                  Display Headline
                </span>
                <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-brand break-words">
                  {customTestText}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase">
                  Teleprompter Reader Body
                </span>
                <div className="text-sm sm:text-lg md:text-xl text-stone-200 leading-relaxed font-sans break-words">
                  {customTestText}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase">
                  Editorial Observation · Italic
                </span>
                <div
                  className="text-xs sm:text-base italic font-editorial"
                  style={{ color: `${activeBrand.colors.accent.hex}ee` }}
                >
                  "{activeBrand.toneGuidelines.philosophyQuote}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct CTA */}
      <div
        className="relative overflow-hidden border rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 shadow-modern-glow"
        style={{
          background: `linear-gradient(135deg, ${activeBrand.colors.secondary.hex} 0%, #061210 50%, #030807 100%)`,
          borderColor: `${activeBrand.colors.accent.hex}40`,
        }}
      >
        <div className="space-y-1 relative z-10">
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: activeBrand.colors.accent.hex }}
          >
            Ready to record on PC?
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-brand">
            Launch the Teleprompter Studio
          </div>
          <div className="text-xs text-stone-400">
            Pre-loaded with story practice, expressions, unscripted retelling mode, and mic audio recorder.
          </div>
        </div>
        <button
          onClick={onNavigateToTeleprompter}
          className="relative z-10 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap self-start sm:self-center shadow-lg hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: activeBrand.colors.accent.hex,
            color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
          }}
        >
          Launch Teleprompter Studio →
        </button>
      </div>
    </div>
  );
};
