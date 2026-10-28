/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import { BannerDesignStudio } from './BannerDesignStudio';
import {
  Download,
  Copy,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Tv,
} from 'lucide-react';
import { VideoWatermarkStudio } from './VideoWatermarkStudio';

interface ChannelMockupViewProps {
  activeBrand: BrandIdentity;
  defaultSubTab?: 'banner-studio' | 'watermark-studio' | 'channel-mockup';
}

export const ChannelMockupView: React.FC<ChannelMockupViewProps> = ({ activeBrand, defaultSubTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'banner-studio' | 'watermark-studio' | 'channel-mockup'>(
    defaultSubTab || 'banner-studio'
  );

  // Channel Mockup States
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [copiedAbout, setCopiedAbout] = useState<boolean>(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Thumbnail Studio state
  const [thumbDay, setThumbDay] = useState<number>(1);
  const [thumbTitle, setThumbTitle] = useState<string>('The Morning Routine Shift');
  const [thumbTheme, setThumbTheme] = useState<'emerald' | 'mint' | 'cobalt' | 'amber'>('emerald');

  const handleCopyAbout = () => {
    navigator.clipboard.writeText(activeBrand.youtubeMeta.aboutBio);
    setCopiedAbout(true);
    setTimeout(() => setCopiedAbout(false), 2000);
  };

  // Export 1280x720 Thumbnail PNG
  const handleDownloadThumbnailPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accentColor =
      thumbTheme === 'emerald'
        ? '#10B981'
        : thumbTheme === 'mint'
        ? '#00F5A0'
        : thumbTheme === 'cobalt'
        ? '#3B82F6'
        : '#F59E0B';

    // Dark sleek background in botanical obsidian
    ctx.fillStyle = '#061411';
    ctx.fillRect(0, 0, 1280, 720);

    // Outer border with accent
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1266, 706);

    // Top Header Badge: DAY XX · SPEAKING PRACTICE
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(80, 70, 420, 60, 14);
    ctx.fill();

    ctx.fillStyle = '#061210';
    ctx.font = '900 26px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const dayStr = thumbDay < 10 ? `DAY 0${thumbDay} · SPEAKING LAB` : `DAY ${thumbDay} · SPEAKING LAB`;
    ctx.fillText(dayStr, 290, 110);

    // Main Story Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';

    const words = thumbTitle.split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach((word) => {
      if ((line1 + word).length < 20) {
        line1 += `${word} `;
      } else {
        line2 += `${word} `;
      }
    });

    ctx.fillText(line1.trim(), 80, 260);
    if (line2) {
      ctx.fillText(line2.trim(), 80, 350);
    }

    // Method subline with "Progress, not perfection" motto
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('“PROGRESS, NOT PERFECTION” · RETELLING', 80, line2 ? 440 : 360);

    // Bottom Branding Strip
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.roundRect(80, 560, 1120, 84, 18);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SPEAK IN PROGRESS', 120, 612);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '24px "DM Sans", sans-serif';
    ctx.fillText('· Spoken English Journey', 480, 612);

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-thumbnail-day-${thumbDay}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Sub-navigation Switcher between Banner Studio and Channel Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-stone-950 p-1 sm:p-1.5 rounded-2xl border border-white/10 shadow-badge-inset w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('banner-studio')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'banner-studio'
                ? 'shadow-modern-glow'
                : 'text-stone-400 hover:text-white'
            }`}
            style={
              activeSubTab === 'banner-studio'
                ? {
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                  }
                : {}
            }
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2560×1440 Banner</span>
          </button>

          <button
            onClick={() => setActiveSubTab('watermark-studio')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'watermark-studio'
                ? 'shadow-modern-glow'
                : 'text-stone-400 hover:text-white'
            }`}
            style={
              activeSubTab === 'watermark-studio'
                ? {
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                  }
                : {}
            }
          >
            <Tv className="w-3.5 h-3.5" />
            <span>150×150 Video Watermark</span>
          </button>

          <button
            onClick={() => setActiveSubTab('channel-mockup')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'channel-mockup'
                ? 'shadow-modern-glow'
                : 'text-stone-400 hover:text-white'
            }`}
            style={
              activeSubTab === 'channel-mockup'
                ? {
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                  }
                : {}
            }
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Channel & Thumbnails</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-stone-400">
          <span
            className="w-2 h-2 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: activeBrand.colors.accent.hex }}
          />
          <span style={{ color: activeBrand.colors.accent.hex }}>PROGRESS, NOT PERFECTION</span>
        </div>
      </div>

      {/* 1. Dedicated Banner Design Studio */}
      {activeSubTab === 'banner-studio' && <BannerDesignStudio activeBrand={activeBrand} />}

      {/* 2. Official 150x150 Video Watermark Studio */}
      {activeSubTab === 'watermark-studio' && <VideoWatermarkStudio activeBrand={activeBrand} />}

      {/* 3. Simulated Channel Mockup View */}
      {activeSubTab === 'channel-mockup' && (
        <div className="space-y-8 sm:space-y-12">
          {/* Section Header */}
          <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div className="space-y-2">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: activeBrand.colors.accent.hex,
                    backgroundColor: `${activeBrand.colors.accent.hex}15`,
                    border: `1px solid ${activeBrand.colors.accent.hex}30`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Channel Mockup & Packaging</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
                  Speak in Progress · Channel Experience
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  Experience how your audience sees Speak in Progress on YouTube desktop and mobile apps without arbitrary day limits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-white/10 shadow-badge-inset">
                  <button
                    onClick={() => setDevicePreview('desktop')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs ${
                      devicePreview === 'desktop' ? 'bg-stone-800 text-white font-bold shadow-sm' : 'text-stone-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop (1440px)</span>
                  </button>
                  <button
                    onClick={() => setDevicePreview('mobile')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs ${
                      devicePreview === 'mobile' ? 'bg-stone-800 text-white font-bold shadow-sm' : 'text-stone-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Simulated YouTube Channel Header */}
          <section className="bg-stone-950 border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {/* Banner Canvas Area */}
            <div
              className={`relative w-full transition-all duration-300 flex items-center justify-center overflow-hidden ${
                devicePreview === 'mobile' ? 'h-40 sm:h-52' : 'h-52 sm:h-64 md:h-80'
              }`}
              style={{
                backgroundColor: activeBrand.colors.primary.hex,
                backgroundImage: `radial-gradient(ellipse at 50% 50%, ${activeBrand.colors.secondary.hex} 0%, ${activeBrand.colors.primary.hex} 100%)`,
              }}
            >
              {/* Subtle grid */}
              <div className="absolute inset-0 bg-modern-grid opacity-30 pointer-events-none" />

              {/* Safe Zone Visual Overlays for creator guidance */}
              {showSafeZones && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-2 sm:p-4">
                  <div className="w-[92%] sm:w-[72%] h-[82%] border-2 border-dashed border-emerald-400/40 rounded-xl sm:rounded-2xl flex flex-col justify-between p-2 sm:p-3">
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-emerald-300 bg-stone-950/80 px-2 py-0.5 rounded-md self-start border border-emerald-400/20">
                      Mobile & Desktop Safe Zone (1546 × 423)
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-emerald-300 bg-stone-950/80 px-2 py-0.5 rounded-md self-end border border-emerald-400/20">
                      Safe on all devices
                    </div>
                  </div>
                </div>
              )}

              {/* Banner Central Typography Lockup */}
              <div className="relative z-10 text-center px-4 space-y-1.5 sm:space-y-2">
                <div
                  className="inline-flex items-center gap-2 bg-stone-900/80 border border-white/10 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono shadow-badge-inset"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: activeBrand.colors.accent.hex }}
                  />
                  <span>THE SPOKEN ENGLISH JOURNEY</span>
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-brand drop-shadow-md">
                  Speak in Progress
                </h3>
                <p className="text-xs sm:text-sm font-editorial italic text-stone-200 max-w-xl mx-auto drop-shadow">
                  “Progress, not perfection” — Continuous Spoken Practice & Retellings
                </p>
              </div>
            </div>

            {/* Channel Details Bar */}
            <div className="p-5 sm:p-8 lg:p-10 bg-stone-900/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Channel Profile Picture (Avatar) */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-stone-800 bg-stone-950 shadow-2xl shrink-0 flex items-center justify-center">
                    <LogoMark brand={activeBrand} size="sm" layout="icon-only" isAnimated={true} />
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-brand truncate">
                        Speak in Progress
                      </span>
                      <span
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full font-bold flex items-center justify-center text-[10px] sm:text-xs shadow-sm shrink-0"
                        style={{
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                        }}
                      >
                        ✓
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-stone-400">
                      <span className="font-mono text-stone-200 font-semibold">@SpeakInProgress</span>
                      <span aria-hidden="true">·</span>
                      <span>Ongoing Video Series</span>
                      <span aria-hidden="true">·</span>
                      <span>Faceless Screen Practice</span>
                    </div>

                    <p className="text-xs text-stone-400 max-w-xl truncate pt-0.5">
                      {activeBrand.subline}
                    </p>
                  </div>
                </div>

                {/* Subscribe Button Mockup */}
                <div className="flex items-center gap-3">
                  <button className="px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-stone-950 bg-white hover:bg-stone-200 rounded-full transition-all shrink-0 shadow-lg">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* YouTube Navigation Tabs */}
              <div className="flex items-center gap-5 sm:gap-6 text-xs font-semibold text-stone-400 border-b border-white/[0.08] pb-3 overflow-x-auto">
                <span className="text-white border-b-2 border-white pb-3 -mb-3 font-bold whitespace-nowrap">HOME</span>
                <span className="hover:text-white cursor-pointer whitespace-nowrap">VIDEOS</span>
                <span className="hover:text-white cursor-pointer whitespace-nowrap">SHORTS</span>
                <span className="hover:text-white cursor-pointer whitespace-nowrap">PLAYLISTS</span>
                <span className="hover:text-white cursor-pointer whitespace-nowrap">COMMUNITY</span>
                <span
                  className="pb-3 -mb-3 font-bold whitespace-nowrap border-b-2"
                  style={{
                    color: activeBrand.colors.accent.hex,
                    borderColor: activeBrand.colors.accent.hex,
                  }}
                >
                  ABOUT BIO
                </span>
              </div>

              {/* About Section Text Ready to Copy */}
              <div className="bg-stone-950/80 p-5 sm:p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-badge-inset">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Official YouTube "About" Bio (Copy & Paste to YouTube Studio)
                  </div>
                  <button
                    onClick={handleCopyAbout}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 shadow-sm"
                    style={{
                      color: activeBrand.colors.accent.hex,
                      backgroundColor: `${activeBrand.colors.accent.hex}15`,
                      borderColor: `${activeBrand.colors.accent.hex}30`,
                    }}
                  >
                    {copiedAbout ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAbout ? 'Copied Bio!' : 'Copy About Text'}</span>
                  </button>
                </div>

                <pre className="text-xs text-stone-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {activeBrand.youtubeMeta.aboutBio}
                </pre>
              </div>
            </div>
          </section>

          {/* 16:9 Thumbnail Studio */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  Click-Through Packaging
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  16:9 YouTube Thumbnail Studio
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  High-contrast, faceless thumbnail template featuring your “Progress, not perfection” motto.
                </p>
              </div>

              <button
                onClick={handleDownloadThumbnailPNG}
                className="px-4 py-2 text-xs font-extrabold rounded-xl shadow-modern-glow transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02] active:scale-95"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Thumbnail PNG (1280x720)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-5 bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
                    Session / Day Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={thumbDay}
                    onChange={(e) => setThumbDay(parseInt(e.target.value) || 1)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-stone-100 font-mono focus:outline-none shadow-badge-inset"
                    style={{ outlineColor: activeBrand.colors.accent.hex }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
                    Story Title Headline
                  </label>
                  <input
                    type="text"
                    value={thumbTitle}
                    onChange={(e) => setThumbTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-stone-100 focus:outline-none shadow-badge-inset"
                    style={{ outlineColor: activeBrand.colors.accent.hex }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
                    Accent Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'emerald', label: 'Emerald Spark', hex: '#10B981', darkText: false },
                      { id: 'mint', label: 'Neo Mint', hex: '#00F5A0', darkText: true },
                      { id: 'cobalt', label: 'Cobalt', hex: '#3B82F6', darkText: false },
                      { id: 'amber', label: 'Amber', hex: '#F59E0B', darkText: false },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setThumbTheme(t.id as any)}
                        className={`px-2.5 py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                          thumbTheme === t.id
                            ? 'font-bold shadow-md'
                            : 'bg-stone-950 text-stone-400 border-white/[0.06] hover:text-white'
                        }`}
                        style={
                          thumbTheme === t.id
                            ? {
                                backgroundColor: t.hex,
                                color: t.darkText ? '#061411' : '#FFFFFF',
                                borderColor: t.hex,
                              }
                            : {}
                        }
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/[0.06] text-[11px] text-stone-400 leading-relaxed shadow-badge-inset">
                  💡 <strong>Thumbnail Best Practice:</strong> Keep title text concise (2–4 words) for maximum click-through rate on smartphone feeds!
                </div>
              </div>

              {/* 16:9 Live Preview Canvas */}
              <div className="lg:col-span-7 bg-stone-900/40 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-card-elevated">
                {(() => {
                  const currentAccent =
                    thumbTheme === 'emerald'
                      ? '#10B981'
                      : thumbTheme === 'mint'
                      ? '#00F5A0'
                      : thumbTheme === 'cobalt'
                      ? '#3B82F6'
                      : '#F59E0B';
                  const currentTextDark = thumbTheme === 'mint';

                  return (
                    <div
                      className="w-full aspect-video rounded-2xl border-4 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
                      style={{
                        backgroundColor: '#061411',
                        borderColor: currentAccent,
                        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 25px ${currentAccent}33`,
                      }}
                    >
                      {/* Day Badge */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div
                          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm font-mono font-black shadow-lg"
                          style={{
                            backgroundColor: currentAccent,
                            color: currentTextDark ? '#061411' : '#FFFFFF',
                          }}
                        >
                          DAY {thumbDay < 10 ? `0${thumbDay}` : thumbDay} · PRACTICE
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono text-stone-400 hidden sm:block">
                          PROGRESS, NOT PERFECTION
                        </div>
                      </div>

                      {/* Big Bold Headline */}
                      <div className="relative z-10 space-y-1 sm:space-y-2 my-auto">
                        <h4 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase font-brand drop-shadow-lg">
                          {thumbTitle}
                        </h4>
                        <p
                          className="text-[11px] sm:text-sm font-bold"
                          style={{
                            color: currentAccent,
                          }}
                        >
                          “PROGRESS, NOT PERFECTION” · RETELLING
                        </p>
                      </div>

                  {/* Bottom Channel Strip */}
                  <div className="relative z-10 flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white uppercase tracking-wider font-brand text-[11px] sm:text-xs">
                        SPEAK IN PROGRESS
                      </span>
                      <span className="text-stone-400 hidden sm:inline">· Spoken English Journey</span>
                    </div>
                    <div className="text-stone-400 font-mono text-[9px] sm:text-[10px]">1080P SCREEN LOG</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>
        </div>
      )}
    </div>
  );
};
