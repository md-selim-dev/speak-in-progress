/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandIdentity } from '../../types';
import { Sliders, Zap, Image as ImageIcon, Film, Mic, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface PublicFeaturesViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'howItWorks' | 'about' | 'faq') => void;
  onPrimaryAction: () => void;
  isAuthenticated: boolean;
}

export const PublicFeaturesView: React.FC<PublicFeaturesViewProps> = ({
  activeBrand,
  onNavigate,
  onPrimaryAction,
  isAuthenticated,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <Sliders className="w-3.5 h-3.5" />
          <span>Integrated Creator Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-brand tracking-tight">
          Everything Needed for YouTube Spoken Practice
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Four purpose-built studios working seamlessly inside a single high-performance workspace. Designed strictly around real, existing features for authentic PC screen recording.
        </p>
      </section>

      {/* 4 Feature Deep-Dives */}
      <div className="space-y-8 sm:space-y-12">
        {/* Module 1: Teleprompter Studio */}
        <article className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Module 01 · Production Core
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand">
                  Interactive Teleprompter Studio
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">15–75 px/s Speed</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">130–160 WPM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Dual Reading Modes & Eye-Line Beam
              </h3>
              <p className="text-stone-400">
                Switch effortlessly between <strong>Continuous Auto-Scroll</strong> with live speed adjustment or <strong>Paragraph Focus</strong> mode. The calibrated horizontal eye-line focus beam keeps your gaze locked to your webcam or recording window for natural eye-contact.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                OBS Screen Recording & Mic Rehearsal
              </h3>
              <p className="text-stone-400">
                Press <kbd className="font-mono bg-stone-800 px-1.5 py-0.5 rounded text-white text-xs">F</kbd> for clean, distraction-free recording canvas optimized for OBS Studio and Loom. Features a browser-native Web Audio microphone rehearsal recorder with instant audio playback.
              </p>
            </div>
          </div>
        </article>

        {/* Module 2: Deliberate Fluency Methodology */}
        <article className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Module 02 · Cognitive Engine
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand">
                  Deliberate Fluency Methodology
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">120 Graded Days</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">A1 to C2 CEFR</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                90-Second Unscripted Memory Recall
              </h3>
              <p className="text-stone-400">
                Immediately following the story reading, the teleprompter hides the text. You verbalize the core narrative using 4 structured cognitive anchor triggers under a 90-second countdown, training the brain to retrieve syntax without visual crutches.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Stumble-Rate Analytics & Private Cloud Vault
              </h3>
              <p className="text-stone-400">
                Record your script independence rating (1–5 stars), stumble friction notes, and win-of-the-day. All sessions sync automatically to your private, encrypted Cloud Firestore database.
              </p>
            </div>
          </div>
        </article>

        {/* Module 3: 16:9 Thumbnail Studio */}
        <article className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Module 03 · YouTube Assets
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand">
                  16:9 High-CTR Thumbnail Studio
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">2K (2560×1440)</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">FHD (1920×1080)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                High-Contrast Typography & Highlight Words
              </h3>
              <p className="text-stone-400">
                Built-in HTML5 Canvas rendering engine with automatic word-wrapping, customizable highlight words, day badges, and zero overlapping text. Designed for maximum click-through rate on YouTube homepages and suggested video feeds.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Instant 1-Click PNG Download
              </h3>
              <p className="text-stone-400">
                Export crisp, broadcast-ready PNG thumbnails instantly in both 2560×1440 (2K crisp resolution) and 1920×1080 standard full HD, ready to drag and drop straight into YouTube Studio.
              </p>
            </div>
          </div>
        </article>

        {/* Module 4: Video Intro & Banner Suite */}
        <article className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Module 04 · Channel Branding
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand">
                  Video Intro & Channel Banner Suite
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">MP4 / WebM</span>
              <span className="px-2.5 py-1 rounded-lg bg-stone-950/80 border border-white/10">Channel Safe Zones</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                Animated Video Stings with Audio
              </h3>
              <p className="text-stone-400">
                Generate 3–4 second animated video stings with real audio chords that introduce your daily episodes consistently. Rendered client-side and exportable in WebM with duration metadata intact.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base font-brand flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                2560×1440 Channel Banners & Logos
              </h3>
              <p className="text-stone-400">
                Export YouTube channel headers aligned to mobile and TV safe zones, plus 150×150 corner branding watermarks and scalable SVG logos that give your YouTube channel visual authority.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Internal Navigation & Action Row */}
      <section className="bg-gradient-to-b from-stone-900/60 to-stone-950 border border-white/10 rounded-3xl p-6 sm:p-10 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white font-brand">
          Ready to see how these modules connect together?
        </h3>
        <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
          Explore the exact 5-step daily workflow used to produce authentic video sessions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('howItWorks')}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-bold rounded-xl text-stone-200 bg-stone-800 hover:bg-stone-700 border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore 5-Step Workflow</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={onPrimaryAction}
            className="w-full sm:w-auto px-7 py-3 min-h-[44px] text-xs font-black rounded-xl transition-all shadow-modern-glow flex items-center justify-center gap-2"
            style={{
              backgroundColor: activeBrand.colors.accent.hex,
              color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
            }}
          >
            <span>{isAuthenticated ? 'Enter Studio' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
