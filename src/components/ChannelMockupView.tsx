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
  Sparkles as SparklesIcon,
  Film,
} from 'lucide-react';
import { VideoWatermarkStudio } from './VideoWatermarkStudio';
import { ThumbnailDesignStudio } from './ThumbnailDesignStudio';
import { VideoIntroStudio } from './VideoIntroStudio';

export type ChannelSubTab = 'banner-studio' | 'thumbnail-studio' | 'intro-studio' | 'watermark-studio' | 'channel-mockup';

interface ChannelMockupViewProps {
  activeBrand: BrandIdentity;
  defaultSubTab?: ChannelSubTab;
}

export const ChannelMockupView: React.FC<ChannelMockupViewProps> = ({ activeBrand, defaultSubTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<ChannelSubTab>(
    defaultSubTab || 'banner-studio'
  );

  // Channel Mockup States
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [copiedAbout, setCopiedAbout] = useState<boolean>(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  const handleCopyAbout = () => {
    navigator.clipboard.writeText(activeBrand.youtubeMeta.aboutBio);
    setCopiedAbout(true);
    setTimeout(() => setCopiedAbout(false), 2000);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Sub-navigation Switcher between Banner Studio, Thumbnail Studio, Intro Studio, Watermark Studio, and Channel Mockup */}
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
            onClick={() => setActiveSubTab('thumbnail-studio')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'thumbnail-studio'
                ? 'shadow-modern-glow'
                : 'text-stone-400 hover:text-white'
            }`}
            style={
              activeSubTab === 'thumbnail-studio'
                ? {
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                  }
                : {}
            }
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>16:9 Thumbnails</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intro-studio')}
            className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'intro-studio'
                ? 'shadow-modern-glow'
                : 'text-stone-400 hover:text-white'
            }`}
            style={
              activeSubTab === 'intro-studio'
                ? {
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                  }
                : {}
            }
          >
            <Film className="w-3.5 h-3.5" />
            <span>3-4s Video Intro</span>
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
            <span>150×150 Watermark</span>
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
            <span>Channel & Videos</span>
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

      {/* 2. Official 16:9 Thumbnail Studio */}
      {activeSubTab === 'thumbnail-studio' && <ThumbnailDesignStudio activeBrand={activeBrand} />}

      {/* 3. Official 3-4s Video Intro Studio */}
      {activeSubTab === 'intro-studio' && <VideoIntroStudio activeBrand={activeBrand} />}

      {/* 4. Official 150x150 Video Watermark Studio */}
      {activeSubTab === 'watermark-studio' && <VideoWatermarkStudio activeBrand={activeBrand} />}

      {/* 5. Simulated Channel Mockup View */}
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

          {/* Real YouTube Video Feed & Uploads Mockup */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  YouTube Feed Simulation
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-brand">
                  Latest Video Uploads & Thumbnails
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  See how your unboxed Emerald Spark logo and high-contrast thumbnails capture attention in the YouTube browse feed.
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('thumbnail-studio')}
                className="px-4 py-2 text-xs font-bold rounded-xl shadow-modern-glow transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02] active:scale-95"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: '#061210',
                }}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Open 16:9 Thumbnail Studio</span>
              </button>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  day: 1,
                  category: 'SPEAKING LAB',
                  title: 'The Morning Routine Shift',
                  highlight: 'Routine Shift',
                  hook: '“PROGRESS, NOT PERFECTION” · RETELLING',
                  duration: '14:28',
                  views: '3.4K views',
                  timeAgo: '2 days ago',
                },
                {
                  day: 7,
                  category: 'FLUENCY DRILL',
                  title: 'Stop Translating In Your Head',
                  highlight: 'Translating',
                  hook: 'HOW TO THINK DIRECTLY IN ENGLISH',
                  duration: '18:05',
                  views: '5.1K views',
                  timeAgo: '5 days ago',
                },
                {
                  day: 14,
                  category: 'UNSCRIPTED PRACTICE',
                  title: 'Speaking Without Hesitation',
                  highlight: 'Without Hesitation',
                  hook: 'FACELESS AUDIO DRILL · DAILY LOG',
                  duration: '12:44',
                  views: '2.8K views',
                  timeAgo: '1 week ago',
                },
              ].map((video) => (
                <div
                  key={video.day}
                  className="bg-stone-900/50 border border-white/[0.08] rounded-2xl overflow-hidden shadow-card-elevated group hover:border-emerald-500/40 transition-all flex flex-col"
                >
                  {/* High Quality Thumbnail Card */}
                  <div
                    className="relative w-full aspect-video border-b border-white/[0.08] p-4 flex flex-col justify-between overflow-hidden select-none"
                    style={{
                      backgroundColor: '#030B09',
                      backgroundImage: `radial-gradient(circle at 35% 45%, ${activeBrand.colors.accent.hex}22 0%, #030B09 100%)`,
                    }}
                  >
                    {/* Top Row: Category Badge + Unboxed Logo */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black shadow-md"
                        style={{
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: '#04120D',
                        }}
                      >
                        DAY {video.day < 10 ? `0${video.day}` : video.day} · {video.category}
                      </div>

                      {/* Standalone Brand Logo in Thumbnail Corner */}
                      <div className="p-1 rounded-xl bg-stone-950/60 backdrop-blur-sm border border-white/10 shadow-lg">
                        <LogoMark brand={activeBrand} size="xs" layout="icon-only" isAnimated={false} />
                      </div>
                    </div>

                    {/* Central Title */}
                    <div className="relative z-10 my-auto space-y-1">
                      <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-brand leading-tight drop-shadow-md">
                        {video.title.split(' ').map((word, wIdx) => {
                          const isH = video.highlight.toLowerCase().includes(word.toLowerCase());
                          return (
                            <span
                              key={wIdx}
                              style={{ color: isH ? activeBrand.colors.accent.hex : '#FFFFFF' }}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </h4>
                      <p
                        className="text-[10px] font-bold tracking-wide"
                        style={{ color: activeBrand.colors.accent.hex }}
                      >
                        {video.hook}
                      </p>
                    </div>

                    {/* Bottom strip */}
                    <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-white/10 text-[9px] font-mono text-stone-400">
                      <span className="font-bold text-white tracking-wider">SPEAK IN PROGRESS</span>
                      <span className="text-[10px] bg-black/85 text-white font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* YouTube Video Metadata Below Thumbnail */}
                  <div className="p-4 flex gap-3 flex-1 items-start">
                    <div className="w-9 h-9 rounded-full bg-stone-950 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                      <LogoMark brand={activeBrand} size="xs" layout="icon-only" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        Day {video.day < 10 ? `0${video.day}` : video.day}: {video.title} (Natural English Speaking Practice)
                      </h5>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                        <span>Speak in Progress</span>
                        <span className="w-1 h-1 rounded-full bg-stone-600" />
                        <span>{video.views}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-600" />
                        <span>{video.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Prompt to Open Full Studio */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${activeBrand.colors.accent.hex}20`,
                    borderColor: `${activeBrand.colors.accent.hex}40`,
                    color: activeBrand.colors.accent.hex,
                  }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Full-Fidelity 16:9 Thumbnail Studio Available</div>
                  <div className="text-[11px] text-stone-300">
                    Export high-res 1080p / 1440p PNGs with custom headlines, keyword glow, and soundwaves.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('thumbnail-studio')}
                className="px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 bg-stone-800 hover:bg-stone-700 text-white border border-white/10"
              >
                <span>Launch Thumbnail Studio</span>
                <span>→</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
