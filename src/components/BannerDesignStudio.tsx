/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import {
  Download,
  Eye,
  Type,
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  Tv,
  Palette,
  ShieldCheck,
} from 'lucide-react';

interface BannerDesignStudioProps {
  activeBrand: BrandIdentity;
}

export type BannerPresetTheme = 'acoustic-horizon' | 'architectural-minimal' | 'studio-warmth' | 'dynamic-chevron';

export const BannerDesignStudio: React.FC<BannerDesignStudioProps> = ({ activeBrand }) => {
  const [selectedTheme, setSelectedTheme] = useState<BannerPresetTheme>('acoustic-horizon');
  const [channelTitle, setChannelTitle] = useState<string>('SPEAK IN PROGRESS');
  const [mottoText, setMottoText] = useState<string>('Progress, not perfection');
  const [sublineText, setSublineText] = useState<string>(
    'The Spoken English Journey · Unscripted Stories & Natural Retellings'
  );
  const [activeAccentColor, setActiveAccentColor] = useState<string>(activeBrand?.colors?.accent?.hex || '#10B981');
  const [shadowDepth, setShadowDepth] = useState<'subtle' | 'studio' | 'glow'>('studio');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [showMetricsBadge, setShowMetricsBadge] = useState<boolean>(true);
  const [viewportMode, setViewportMode] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  React.useEffect(() => {
    if (activeBrand?.colors?.accent?.hex) {
      setActiveAccentColor(activeBrand.colors.accent.hex);
    }
  }, [activeBrand]);

  // Generate 2560x1440 High-Resolution Canvas PNG without 120-day limit
  const handleExport2560PNG = () => {
    setIsExporting(true);
    const canvas = document.createElement('canvas');
    canvas.width = 2560;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const W = 2560;
    const H = 1440;
    const centerY = H / 2; // 720
    const safeTop = 508;
    const safeBottom = 931;
    const safeHeight = 423;

    // --- 1. Background Ground ---
    if (selectedTheme === 'studio-warmth') {
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#0F0E13');
      bgGrad.addColorStop(0.5, '#16151E');
      bgGrad.addColorStop(1, '#09080C');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Warm ambient radial glow in safe zone
      const radial = ctx.createRadialGradient(W / 2, centerY, 80, W / 2, centerY, 800);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
    } else if (selectedTheme === 'architectural-minimal') {
      ctx.fillStyle = '#080A0E';
      ctx.fillRect(0, 0, W, H);

      // Fine grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    } else if (selectedTheme === 'dynamic-chevron') {
      ctx.fillStyle = '#060A12';
      ctx.fillRect(0, 0, W, H);

      // Diagonal gradient streaks
      const diag = ctx.createLinearGradient(0, safeTop, W, safeBottom);
      diag.addColorStop(0, `${activeAccentColor}0D`);
      diag.addColorStop(0.5, `${activeAccentColor}28`);
      diag.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = diag;
      ctx.fillRect(0, safeTop, W, safeHeight);
    } else {
      // Default: Emerald Spark Horizon (Flagship) - Eye-Pleasing
      ctx.fillStyle = '#061411';
      ctx.fillRect(0, 0, W, H);

      // Multi-layer radial ambient glow in eye-pleasing Emerald Spark
      const radial = ctx.createRadialGradient(W / 2, centerY, 100, W / 2, centerY, 900);
      radial.addColorStop(0, `${activeAccentColor}47`);
      radial.addColorStop(0.6, 'rgba(11, 36, 31, 0.7)');
      radial.addColorStop(1, '#061411');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
    }

    // --- 2. Central Glassmorphic Identity System Container (in Safe Zone) ---
    const cardW = 1460;
    const cardH = 360;
    const cardX = (W - cardW) / 2;
    const cardY = centerY - cardH / 2;

    // Outer subtle shadow for identity card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = shadowDepth === 'glow' ? 80 : shadowDepth === 'studio' ? 50 : 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;

    ctx.fillStyle = 'rgba(15, 20, 32, 0.88)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Glowing border for identity system with emerald spark presence
    ctx.strokeStyle =
      shadowDepth === 'glow'
        ? activeAccentColor
        : `${activeAccentColor}33`;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Subtle inner bevel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cardX + 4, cardY + 4, cardW - 8, cardH - 8);

    // --- 3. Left Identity: S-P Monogram Emblem (100% Faithful to LogoMark with Emerald Spark) ---
    const logoX = cardX + 110;
    const logoY = centerY;
    const logoSize = 136;

    // Vibrant ambient radial glow behind emblem in Emerald Spark
    const ambientGlow = ctx.createRadialGradient(logoX, logoY, 15, logoX, logoY, 95);
    ambientGlow.addColorStop(0, activeAccentColor);
    ambientGlow.addColorStop(0.45, `${activeAccentColor}55`);
    ambientGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGlow;
    ctx.beginPath();
    ctx.arc(logoX, logoY, 95, 0, Math.PI * 2);
    ctx.fill();

    // Standalone Main Logo Emblem (Unboxed: no square frames or border lines)
    ctx.save();
    const scale = logoSize / 100;
    ctx.translate(logoX - logoSize / 2, logoY - logoSize / 2);
    ctx.scale(scale, scale);

    // Dimensional drop shadow for the standalone vector geometry
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Linear Gradients in Emerald Spark
    const spAccentGrad = ctx.createLinearGradient(0, 0, 100, 100);
    spAccentGrad.addColorStop(0, '#FFFFFF');
    spAccentGrad.addColorStop(0.35, activeAccentColor);
    spAccentGrad.addColorStop(1, activeAccentColor);

    // Continuous S-P Ribbon (White / Crisp Mint with Emerald Flow)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // d="M30 32C30 25.3726 35.3726 20 42 20H56C62.6274 20 68 25.3726 68 32C68 38.6274 62.6274 44 56 44H42C35.3726 44 30 49.3726 30 56C30 62.6274 35.3726 68 42 68H56"
    ctx.moveTo(30, 32);
    ctx.bezierCurveTo(30, 25.3726, 35.3726, 20, 42, 20);
    ctx.lineTo(56, 20);
    ctx.bezierCurveTo(62.6274, 20, 68, 25.3726, 68, 32);
    ctx.bezierCurveTo(68, 38.6274, 62.6274, 44, 56, 44);
    ctx.lineTo(42, 44);
    ctx.bezierCurveTo(35.3726, 44, 30, 49.3726, 30, 56);
    ctx.bezierCurveTo(30, 62.6274, 35.3726, 68, 42, 68);
    ctx.lineTo(56, 68);
    ctx.stroke();

    // The Progress Loop (P loop in vibrant Emerald Spark gradient)
    ctx.strokeStyle = spAccentGrad;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // d="M44 44H64C71.732 44 78 50.268 78 58C78 65.732 71.732 72 64 72H46"
    ctx.moveTo(44, 44);
    ctx.lineTo(64, 44);
    ctx.bezierCurveTo(71.732, 44, 78, 50.268, 78, 58);
    ctx.bezierCurveTo(78, 65.732, 71.732, 72, 64, 72);
    ctx.lineTo(46, 72);
    ctx.stroke();

    // Ascending Momentum Arrow (Top-Right Progress Cue in Vivid Emerald Spark)
    ctx.strokeStyle = activeAccentColor;
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // d="M62 20L78 20M78 20L78 36M78 20L60 38"
    ctx.moveTo(62, 20);
    ctx.lineTo(78, 20);
    ctx.lineTo(78, 36);
    ctx.moveTo(78, 20);
    ctx.lineTo(60, 38);
    ctx.stroke();

    // Dynamic Voice Waveform Bars in Central Acoustic Chamber (Emerald Spark & Crisp White)
    // Bar 1 (Emerald Spark)
    ctx.fillStyle = activeAccentColor;
    ctx.beginPath();
    ctx.roundRect(36, 48, 3.5, 10, 1.75);
    ctx.fill();

    // Bar 2 (Crisp White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(43, 44, 3.5, 18, 1.75);
    ctx.fill();

    // Bar 3 (Emerald Spark, Peak Resonance)
    ctx.fillStyle = activeAccentColor;
    ctx.beginPath();
    ctx.roundRect(50, 40, 3.5, 26, 1.75);
    ctx.fill();

    // Bar 4 (Crisp White)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(57, 46, 3.5, 14, 1.75);
    ctx.fill();

    // Progress Origin Dot (in Vivid Emerald Spark)
    ctx.fillStyle = activeAccentColor;
    ctx.beginPath();
    ctx.arc(70, 27, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // --- 4. Center Typography: Channel Title & Motto ---
    const textStartX = cardX + 225;

    // Top Category / Series Label
    ctx.fillStyle = activeAccentColor;
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('THE SPOKEN ENGLISH LAB · FACELESS PC ARCHIVE', textStartX, centerY - 65);

    // Main Display Title: SPEAK IN PROGRESS
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 78px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(channelTitle.toUpperCase(), textStartX, centerY + 12);

    // Motto: "Progress, not perfection"
    const mottoY = centerY + 78;
    ctx.fillStyle = activeAccentColor;
    ctx.font = 'italic bold 28px "Playfair Display", Georgia, serif';
    ctx.fillText(`“${mottoText}”`, textStartX, mottoY);

    // Separator dot & Subline
    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px "DM Sans", sans-serif';
    ctx.fillText(`— ${sublineText}`, textStartX + ctx.measureText(`“${mottoText}” `).width + 10, mottoY - 2);

    // --- 5. Right Identity Placeholder: Metrics & Handle Card ---
    if (showMetricsBadge) {
      const badgeW = 280;
      const badgeH = 260;
      const badgeX = cardX + cardW - badgeW - 50;
      const badgeY = centerY - badgeH / 2;

      ctx.fillStyle = 'rgba(10, 14, 24, 0.9)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 20);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Handle Tag
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('@SpeakInProgress', badgeX + badgeW / 2, badgeY + 45);

      // Soundwave bars inside badge
      const barCenterX = badgeX + badgeW / 2;
      const heights = [20, 45, 65, 90, 60, 35, 18];
      const barW = 8;
      const gap = 12;
      const totalWaveW = heights.length * (barW + gap);
      const startWaveX = barCenterX - totalWaveW / 2;

      heights.forEach((h, i) => {
        const bx = startWaveX + i * (barW + gap);
        const by = badgeY + 120 - h / 2;
        ctx.fillStyle = i % 2 === 0 ? activeAccentColor : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(bx, by, barW, h, 4);
        ctx.fill();
      });

      // Bottom Milestone Tag
      ctx.fillStyle = activeAccentColor;
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText('PRACTICE AT MY OWN PACE', badgeX + badgeW / 2, badgeY + 200);

      ctx.fillStyle = '#64748B';
      ctx.font = '16px "DM Sans", sans-serif';
      ctx.fillText('Continuous Speaking Journey', badgeX + badgeW / 2, badgeY + 230);
    }

    // --- 6. Export file download ---
    setTimeout(() => {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `speak-in-progress-banner-${selectedTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 150);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Studio Header Card - Fully Responsive */}
      <section className="relative overflow-hidden bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
        <div
          className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeAccentColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-white/[0.08]">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official YouTube Banner Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-brand">
              Speak in Progress · YouTube Banner
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl leading-relaxed">
              Designed around your motto <strong>“Progress, not perfection”</strong>. Practice whenever your schedule allows—no rigid day limits, just an authentic, steady voice journey.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-start lg:self-center">
            <button
              onClick={handleExport2560PNG}
              disabled={isExporting}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold rounded-xl shadow-modern-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeAccentColor,
                color: '#061210',
              }}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating 2560×1440...' : 'Export Banner (2560×1440 PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Viewport Safe Zone Navigation Tabs - Fully Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-stone-400 font-medium">Safe Zone View:</span>
            <div className="flex flex-wrap items-center bg-stone-950 p-1 rounded-xl border border-white/10 shadow-badge-inset">
              <button
                onClick={() => setViewportMode('all')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewportMode === 'all' ? 'bg-stone-800 text-white font-bold shadow-sm' : 'text-stone-400'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>All Devices</span>
              </button>
              <button
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewportMode === 'desktop' ? 'bg-stone-800 text-white font-bold shadow-sm' : 'text-stone-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewportMode === 'mobile' ? 'bg-stone-800 text-white font-bold shadow-sm' : 'text-stone-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Safe Zone</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
                showSafeZones
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-stone-950 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSafeZones ? 'Safe Outlines: ON' : 'Safe Outlines: OFF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Live Banner Canvas Display */}
      <section className="bg-stone-950 border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Banner Frame (Standard 16:9 responsive display representing the 2560 x 1440 canvas) */}
        <div
          className={`relative w-full aspect-[16/9] min-h-[220px] sm:min-h-[340px] md:min-h-[440px] max-h-[580px] overflow-hidden flex items-center justify-center transition-all duration-500 select-none p-2 sm:p-4 ${
            selectedTheme === 'studio-warmth'
              ? 'bg-[#0E0E14]'
              : selectedTheme === 'architectural-minimal'
              ? 'bg-[#080A0E]'
              : 'bg-[#061210]'
          }`}
        >
          {/* Subtle architectural grid pattern */}
          <div className="absolute inset-0 bg-modern-grid opacity-30 pointer-events-none" />

          {/* Theme-specific background visuals */}
          {selectedTheme === 'acoustic-horizon' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `radial-gradient(ellipse at 50% 50%, ${activeAccentColor}33 0%, transparent 75%)`,
              }}
            />
          )}

          {selectedTheme === 'studio-warmth' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #F59E0B25 0%, transparent 60%)`,
              }}
            />
          )}

          {/* Desktop Safe Strip Background Tint */}
          <div
            className={`absolute left-0 right-0 h-[30%] border-y pointer-events-none transition-all ${
              showSafeZones && viewportMode !== 'mobile'
                ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                : 'border-transparent'
            }`}
          />

          {/* Mobile Safe Zone Box Overlay */}
          {showSafeZones && (
            <div className="absolute w-[86%] sm:w-[72%] md:w-[60.4%] h-[34%] sm:h-[30%] border-2 border-dashed border-emerald-400/50 rounded-xl sm:rounded-2xl pointer-events-none flex flex-col justify-between p-1.5 sm:p-2 z-30">
              <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-mono text-emerald-300 bg-stone-950/80 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-400/30">
                <span>MOBILE SAFE ZONE</span>
                <span className="hidden sm:inline">NEVER CROPPED</span>
              </div>
              <div className="text-[8px] sm:text-[9px] font-mono text-emerald-300/80 bg-stone-950/80 px-1.5 sm:px-2 py-0.5 rounded self-end border border-emerald-400/20">
                Visible on All Devices
              </div>
            </div>
          )}

          {/* --- The Identity System Container --- */}
          <div
            className={`relative z-20 w-[92%] sm:w-[80%] md:w-[64%] lg:w-[58%] max-w-4xl py-3 sm:py-5 px-3 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 sm:gap-6 ${
              shadowDepth === 'glow'
                ? 'bg-stone-950/90 border-emerald-500/50 shadow-modern-glow'
                : shadowDepth === 'studio'
                ? 'bg-stone-950/85 border-white/15 shadow-card-elevated'
                : 'bg-stone-950/75 border-white/10 shadow-md'
            }`}
          >
            {/* Left: Modern S-P Emblem Lockup */}
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 min-w-0">
              <div className="relative shrink-0 flex items-center justify-center">
                <LogoMark
                  brand={activeBrand}
                  size="sm"
                  layout="icon-only"
                  accentColor={activeAccentColor}
                  isAnimated={true}
                />
              </div>

              {/* Center Typography Lockup */}
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className="text-[8px] sm:text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-wider truncate"
                    style={{ color: activeAccentColor }}
                  >
                    THE SPOKEN ENGLISH LAB
                  </span>
                  <span className="text-stone-600 hidden md:inline">·</span>
                  <span className="text-[9px] text-stone-400 font-mono hidden md:inline">
                    FACELESS PC ARCHIVE
                  </span>
                </div>

                {/* Primary Display Title: SPEAK IN PROGRESS */}
                <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-brand truncate drop-shadow-md">
                  {channelTitle}
                </h2>

                {/* The Motto: "Progress, not perfection" */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs md:text-sm">
                  <span className="font-editorial italic font-bold text-white tracking-wide">
                    “{mottoText}”
                  </span>
                  <span className="text-stone-500 hidden sm:inline">—</span>
                  <span className="text-stone-300 text-[9px] sm:text-xs truncate hidden sm:inline">
                    {sublineText}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Metrics & Handle Tag */}
            {showMetricsBadge && (
              <div className="hidden lg:flex flex-col items-center justify-center bg-stone-900/80 border border-white/10 px-4 py-2.5 rounded-xl shadow-badge-inset shrink-0">
                <span className="text-[10px] font-mono text-stone-300 font-bold">@SpeakInProgress</span>
                <div className="flex items-end gap-1 h-4 my-1">
                  <div
                    className="w-1 rounded-full animate-wave-bar-1"
                    style={{ backgroundColor: activeAccentColor }}
                  />
                  <div className="w-1 bg-white rounded-full animate-wave-bar-2" />
                  <div
                    className="w-1 rounded-full animate-wave-bar-3"
                    style={{ backgroundColor: activeAccentColor }}
                  />
                  <div className="w-1 bg-white rounded-full animate-wave-bar-4" />
                </div>
                <span
                  className="text-[9px] font-mono font-bold tracking-wider"
                  style={{ color: activeAccentColor }}
                >
                  AT MY OWN PACE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Viewport Dimension Spec Bar */}
        <div className="bg-stone-900/80 border-t border-white/[0.08] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-400">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-white font-bold">YouTube Banner:</span>
            <span>2560 × 1440 (16:9)</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span
              className="font-bold"
              style={{ color: activeAccentColor }}
            >
              Safe Zone: 1546 × 423
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-stone-300 text-[11px] sm:text-xs">Guaranteed Anti-Crop Alignment</span>
          </div>
        </div>
      </section>

      {/* Banner Design Controls & Customization Grid - Responsive Stack */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Style Presets */}
        <div className="lg:col-span-5 bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-card-elevated backdrop-blur-md">
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
            style={{ color: activeAccentColor }}
          >
            <Layers className="w-4 h-4" />
            <span>Design Presets</span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'acoustic-horizon',
                title: 'Emerald Spark Horizon (Flagship)',
                desc: 'Eye-pleasing botanical obsidian ground with warm emerald spark ambient glow and progressive soundwaves.',
                accent: '#10B981',
              },
              {
                id: 'studio-warmth',
                title: 'Studio Warmth',
                desc: 'Warm amber tones echoing focused desk lamp lighting and storytelling.',
                accent: '#F59E0B',
              },
              {
                id: 'architectural-minimal',
                title: 'Architectural Minimal',
                desc: 'Subtle technical grid, crisp high-contrast monochrome, and technical precision.',
                accent: '#FFFFFF',
              },
              {
                id: 'dynamic-chevron',
                title: 'Dynamic Chevron',
                desc: 'Forward momentum angles representing steady speaking fluency gains.',
                accent: '#06B6D4',
              },
            ].map((preset) => {
              const isSelected = selectedTheme === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedTheme(preset.id as BannerPresetTheme);
                    if (preset.id === 'studio-warmth') setActiveAccentColor('#F59E0B');
                    else if (preset.id === 'dynamic-chevron') setActiveAccentColor('#06B6D4');
                    else if (preset.id === 'architectural-minimal') setActiveAccentColor('#38BDF8');
                    else setActiveAccentColor('#10B981');
                  }}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-start gap-3 sm:gap-4 ${
                    isSelected
                      ? 'bg-stone-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-stone-950/60 border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full mt-1 shrink-0 border-2"
                    style={{
                      backgroundColor: preset.accent,
                      borderColor: isSelected ? '#FFFFFF' : 'transparent',
                    }}
                  />
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white truncate">{preset.title}</div>
                    <div className="text-[11px] sm:text-xs text-stone-400 leading-relaxed">{preset.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Accent Color Tuner */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" style={{ color: activeAccentColor }} />
                <span>Accent Energy</span>
              </div>
              <span className="font-mono" style={{ color: activeAccentColor }}>{activeAccentColor}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {[
                { name: 'Emerald Spark (Flagship)', hex: '#10B981' },
                { name: 'Electric Neo Mint', hex: '#00F5A0' },
                { name: 'Electric Cobalt', hex: '#3B82F6' },
                { name: 'Sunrise Amber', hex: '#F59E0B' },
                { name: 'Cyan Horizon', hex: '#06B6D4' },
                { name: 'Violet Surge', hex: '#8B5CF6' },
                { name: 'Pure Chalk', hex: '#FFFFFF' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveAccentColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                    activeAccentColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Copy & Typography Customizer */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-card-elevated backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeAccentColor }}>
            <Type className="w-4 h-4" />
            <span>Typography & Copywriting</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase mb-1.5">
                Channel Name Headline
              </label>
              <input
                type="text"
                value={channelTitle}
                onChange={(e) => setChannelTitle(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white tracking-tight focus:outline-none focus:border-emerald-400 shadow-badge-inset font-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase mb-1.5">
                Core Motto Headline
              </label>
              <input
                type="text"
                value={mottoText}
                onChange={(e) => setMottoText(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 shadow-badge-inset"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase mb-1.5">
                Continuous Subline / Tagline
              </label>
              <input
                type="text"
                value={sublineText}
                onChange={(e) => setSublineText(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
              />
            </div>

            {/* Depth & Shadow Setting */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-stone-300 uppercase">
                Shadow Depth & Glassmorphism
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'subtle', label: 'Subtle Hairline' },
                  { id: 'studio', label: 'Layered Studio Depth' },
                  { id: 'glow', label: 'Illuminated Glow' },
                ].map((s) => {
                  const isSelected = shadowDepth === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setShadowDepth(s.id as any)}
                      className={`px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'font-bold shadow-md'
                          : 'bg-stone-950 text-stone-400 border-white/[0.06] hover:text-white'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: activeAccentColor,
                              color: '#061210',
                              borderColor: activeAccentColor,
                            }
                          : undefined
                      }
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metric Badge Toggle */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-stone-950/80 rounded-xl sm:rounded-2xl border border-white/[0.06]">
              <div>
                <span className="text-xs font-bold text-white block">Right-Side Status Badge</span>
                <span className="text-[11px] text-stone-400">Shows @SpeakInProgress and active practice status</span>
              </div>
              <button
                onClick={() => setShowMetricsBadge(!showMetricsBadge)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  showMetricsBadge ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showMetricsBadge ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
