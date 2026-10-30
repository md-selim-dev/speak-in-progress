/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import {
  Radio,
  BookOpen,
  Sparkles,
  Mic,
  CheckSquare,
  Lock,
  LogIn,
  ChevronRight,
  Sliders,
  Film,
  Image as ImageIcon,
  Shield,
  Lightbulb,
  Clock,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  activeBrand: BrandIdentity;
  isAuthenticated?: boolean;
  onEnterStudio?: () => void;
  onLogin: () => Promise<void>;
  isLoggingIn: boolean;
  loginError: string | null;
  unauthorizedEmail: string | null;
  onDismissUnauthorized: () => void;
  onSwitchAccount: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  activeBrand,
  isAuthenticated = false,
  onEnterStudio,
  onLogin,
  isLoggingIn,
  loginError,
  unauthorizedEmail,
  onDismissUnauthorized,
  onSwitchAccount,
}) => {
  // Interactive Cadence Calculator for SEO & Methodology Showcase
  const [sampleWordCount, setSampleWordCount] = useState<number>(240);
  const [selectedPace, setSelectedPace] = useState<'conversational' | 'presentation' | 'executive'>(
    'conversational'
  );

  const paces = {
    conversational: { wpm: 130, label: 'Conversational (130 WPM)', pxSpeed: 28 },
    presentation: { wpm: 145, label: 'Presentation (145 WPM)', pxSpeed: 34 },
    executive: { wpm: 160, label: 'Executive (160 WPM)', pxSpeed: 42 },
  };

  const currentPaceConfig = paces[selectedPace];
  const calculatedSeconds = Math.round((sampleWordCount / currentPaceConfig.wpm) * 60);
  const calculatedMins = Math.floor(calculatedSeconds / 60);
  const calculatedRemSeconds = calculatedSeconds % 60;

  const scrollToInsights = () => {
    const el = document.getElementById('insights');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrimaryAction = () => {
    if (isAuthenticated && onEnterStudio) {
      onEnterStudio();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#030705] text-stone-100 flex flex-col selection:bg-emerald-400/25 selection:text-emerald-200 relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="fixed top-8 sm:top-12 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[240px] sm:h-[350px] rounded-full blur-[100px] sm:blur-[140px] opacity-15 pointer-events-none -z-10"
        style={{ backgroundColor: activeBrand.colors.accent.hex }}
      />

      {/* Top Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-stone-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <LogoMark brand={activeBrand} size="xs" layout="icon-only" isAnimated={true} />
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate font-brand"
                style={{ textShadow: `0 0 20px ${activeBrand.colors.accent.hex}33` }}
              >
                Speak in Progress
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-stone-400 bg-white/[0.03] hidden sm:inline shrink-0">
                CREATOR STUDIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Insights Anchor Button */}
            <button
              onClick={scrollToInsights}
              className="text-xs font-semibold text-stone-300 hover:text-white px-3 sm:px-3.5 py-2 min-h-[40px] rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Insights</span>
            </button>

            {/* Primary Action Button: 'Enter Studio' once authenticated, or 'Sign In' */}
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              className="px-3.5 sm:px-4 py-2 min-h-[40px] text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap flex items-center gap-1.5 sm:gap-2 shadow-modern-glow disabled:opacity-50"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
              }}
            >
              {isAuthenticated ? (
                <>
                  <span>Enter Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign In'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Hero */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-14 sm:space-y-20 lg:space-y-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 max-w-full text-center leading-snug">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="truncate sm:whitespace-normal">Faceless Screen-Recording Studio · PC & OBS Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-brand leading-[1.18] sm:leading-[1.15]">
            Documenting Real English Fluency,{' '}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, #FFFFFF, ${activeBrand.colors.accent.hex}, #A7F3D0)`,
              }}
            >
              One Authentic Day at a Time.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed px-1">
            A specialized YouTube production suite and deliberate spoken practice framework. Built for PC screen recording, calibrated teleprompter pacing, unscripted memory retellings, and consistent fluency gains.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[46px] text-sm font-black rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-modern-glow flex items-center justify-center gap-2.5"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
              }}
            >
              {isAuthenticated ? (
                <>
                  <span>Enter Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign In to Studio'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={scrollToInsights}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[46px] text-sm font-bold rounded-xl text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Methodology Insights</span>
            </button>
          </div>

          {/* Clean Privacy Notice */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-stone-400">
            <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span>Private Creator Studio · Secure Cloud Synchronization</span>
          </div>

          {loginError && (
            <div className="max-w-md mx-auto p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}
        </div>

        {/* 5-Step Workflow Interactive Timeline */}
        <section className="bg-stone-900/60 border border-white/[0.08] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Daily Practice Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
              The 5-Step Screen Recording Workflow
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Structured specifically for recording clean, faceless YouTube videos on PC with OBS or Loom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
            {[
              {
                step: 'Step 1',
                title: 'Voiceover Intro',
                desc: '15-second opening hook tailored for each session to greet viewers with energy.',
                icon: Radio,
              },
              {
                step: 'Step 2',
                title: 'Story Reading',
                desc: 'Continuous teleprompter reading with calibrated WPM pacing and eye-line beam.',
                icon: BookOpen,
              },
              {
                step: 'Step 3',
                title: 'Key Expressions',
                desc: 'Curated collocations and idioms with contextual meaning, example, and vocal tip.',
                icon: Sparkles,
              },
              {
                step: 'Step 4',
                title: 'Unscripted Retelling',
                desc: 'Speak freely from memory for 90 seconds using anchor triggers without reading.',
                icon: Mic,
              },
              {
                step: 'Step 5',
                title: 'Private Log',
                desc: 'Script independence rating, win-of-the-day log, and stumble notes.',
                icon: CheckSquare,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2 hover:border-emerald-500/30 transition-all flex flex-col justify-between ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {item.step}
                      </span>
                      <Icon className="w-4 h-4 text-stone-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-brand">{item.title}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Grid: 4 Studio Modules */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Creator Toolkit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
              Everything Needed for a Complete YouTube Journey
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Four integrated studios running inside a single high-performance workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-brand">
                Interactive Teleprompter Studio
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Choose between Paragraph Focus mode or Continuous Auto-Scroll with live scroll speed adjustment (15–75 px/s) and estimated WPM. Features clean screen recording mode (<kbd className="font-mono bg-stone-800 px-1 py-0.5 rounded text-[11px]">F</kbd>), eye-line focus beam, and mic rehearsal recorder.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-stone-400">
                <span>· Continuous Auto-Scroll</span>
                <span>· Paragraph Focus</span>
                <span>· Audio Practice Rehearsal</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-brand">
                Deliberate Fluency Methodology
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Based on cognitive retrieval research, combining structured narrative reading with immediate unscripted recall. Designed to break intermediate fluency plateaus through daily verbal output and screen-recorded accountability.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-stone-400">
                <span>· Cognitive Retrieval Anchors</span>
                <span>· Stumble-Rate Analytics</span>
                <span>· Private Firestore Vault</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-brand">
                16:9 Thumbnail Studio
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Generate high-CTR 2K (2560×1440) and FHD (1920×1080) YouTube thumbnails. Complete with high-contrast typography, customizable highlight words, day badges, and clean branding without overlapping text.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-stone-400">
                <span>· High-CTR Typography</span>
                <span>· Word Highlighting</span>
                <span>· Instant PNG Download</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-brand">
                Video Intro & Banner Suite
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Create 3–4 second animated video stings with real audio chords, 2560×1440 channel banners with desktop/mobile TV safe zones, and 150×150 corner watermarks that keep your YouTube channel cohesive and distinctive.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono text-stone-400">
                <span>· MP4 / WebM Intro Video</span>
                <span>· Channel Banner Exporter</span>
                <span>· SVG Logo Generator</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SEO & METHODOLOGY INSIGHTS SECTION (#insights)
            Provides rich, indexed educational content without revealing private data
            ==================================================== */}
        <section
          id="insights"
          className="scroll-mt-24 bg-stone-900/40 border border-white/[0.08] rounded-3xl p-5 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 backdrop-blur-xl"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/50 border border-emerald-500/30">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span>Public Methodology & Research</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-brand">
              The Cognitive Cadence Method
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Why passive listening and vocabulary lists fail to produce spontaneous speech, and how deliberate screen recording forces synaptic myelination.
            </p>
          </div>

          {/* 4 In-Depth Research Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shrink-0">
                  01
                </span>
                <h3 className="text-base font-bold text-white font-brand">
                  The Active Retrieval Paradigm
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Reading comprehension relies on passive recognition. True fluency, however, requires rapid memory retrieval under time pressure. By enforcing a 90-second unscripted retelling immediately after teleprompter practice, speakers train the brain to construct grammatical structures dynamically without relying on visual text crutches.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shrink-0">
                  02
                </span>
                <h3 className="text-base font-bold text-white font-brand">
                  Calibrated Teleprompter Pacing
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Most language learners speak either too quickly from anxiety or excessively slow due to cognitive hesitation. A calibrated teleprompter moving at 130–150 words per minute (WPM) establishes a steady respiratory rhythm, trains natural syntactic pauses, and eliminates monotone vocal fatigue.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shrink-0">
                  03
                </span>
                <h3 className="text-base font-bold text-white font-brand">
                  Faceless Recording Freedom
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                On-camera video production introduces severe appearance anxiety, lighting friction, and cosmetic self-consciousness. Faceless PC screen recording with OBS or Loom channels 100% of cognitive energy into articulation, intonation, and authentic storytelling, yielding 10x higher recording consistency.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs shrink-0">
                  04
                </span>
                <h3 className="text-base font-bold text-white font-brand">
                  Normalizing the Stumble Rate
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                In traditional language learning, a pause or stumble is stigmatized as a failure. In deliberate practice, stumbles are celebrated as neurological evidence of operating at the edge of competence. Tracking daily stumble rates turns vocal vulnerability into an objective metric of progress.
              </p>
            </div>
          </div>

          {/* Interactive Cadence & Pacing Calculator (Interactive Tool) */}
          <div className="p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-stone-950/90 border border-emerald-500/20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Interactive Speech Pacing Tool
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-brand mt-0.5">
                  Calculate Teleprompter Pacing & Cadence
                </h3>
                <p className="text-xs text-stone-400">
                  Experiment with word density and speaking rates used by broadcast narrators.
                </p>
              </div>

              {/* Responsive Pacing Segment Control */}
              <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-2 bg-stone-900 p-1 rounded-xl border border-white/10 w-full sm:w-auto shrink-0">
                {(['conversational', 'presentation', 'executive'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedPace(mode)}
                    className={`px-2.5 sm:px-3 py-2 min-h-[36px] rounded-lg text-[11px] sm:text-xs font-medium capitalize transition-all text-center truncate ${
                      selectedPace === mode
                        ? 'bg-emerald-500 text-black font-bold shadow'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Slider for Word Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">Target Script Length</span>
                <span className="font-bold text-emerald-400">{sampleWordCount} words</span>
              </div>
              <input
                type="range"
                min={80}
                max={600}
                step={20}
                value={sampleWordCount}
                onChange={(e) => setSampleWordCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 bg-stone-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] sm:text-xs font-mono text-stone-500">
                <span>80 words (~1 min intro)</span>
                <span className="hidden sm:inline">240 words (5-para story)</span>
                <span>600 words (deep dive)</span>
              </div>
            </div>

            {/* Calculated Results Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-xl bg-stone-900/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Estimated Read Time</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {calculatedMins > 0 ? `${calculatedMins}m ` : ''}
                  {calculatedRemSeconds}s
                </div>
                <div className="text-[11px] text-stone-500">
                  Target pace: {currentPaceConfig.wpm} words/min
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Prompter Scroll Rate</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  ~{currentPaceConfig.pxSpeed} px/sec
                </div>
                <div className="text-[11px] text-stone-500">Smooth vertical drift speed</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Unscripted Recall Window</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">90 seconds</div>
                <div className="text-[11px] text-stone-500">Post-reading memory retrieval</div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions (Structured for Google Search Engine FAQ Schema) */}
          <div className="space-y-6 pt-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Common Inquiries
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-brand">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white font-brand">
                    What is Speak in Progress?
                  </h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  A dedicated production workspace built for creators documenting their spoken English journey on YouTube through faceless screen recording, teleprompter practice, and unscripted memory retellings.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white font-brand">
                    Why faceless screen-recording?
                  </h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Removing face-camera pressure eliminates lighting, makeup, and framing friction, letting you dedicate 100% of cognitive energy to voice projection, idiom usage, and continuous speech flow.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 className="text-sm font-bold text-white font-brand">
                    Is internal studio data secure?
                  </h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Yes. All personal recordings, teleprompter drafts, stumble logs, and studio progress are stored securely in a private, encrypted Cloud Firestore database. Only this public overview is indexable by search engines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="bg-gradient-to-b from-stone-900/80 to-stone-950 border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 text-center space-y-4 sm:space-y-5">
          <LogoMark brand={activeBrand} size="sm" layout="icon-only" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-brand">
            {isAuthenticated
              ? 'Ready to Record Today’s Session?'
              : 'Begin Your Spoken English Practice'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            {isAuthenticated
              ? 'You are signed in as creator. Jump straight into the teleprompter studio, recording suite, or thumbnail generator.'
              : 'Sign in to access your personalized teleprompter studio, daily unscripted prompts, and Cloud Firestore sync.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[46px] text-sm font-black rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-modern-glow inline-flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
              }}
            >
              {isAuthenticated ? (
                <>
                  <span>Enter Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Opening Sign In...' : 'Sign In with Google'}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-white/[0.08] bg-stone-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-400 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
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

      {/* ====================================================
          MODAL: Unauthorized Account Dialog
          ==================================================== */}
      {unauthorizedEmail && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-5 sm:p-8 space-y-4 shadow-2xl text-center max-h-[92vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shrink-0">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white font-brand">Private Workspace Restricted</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                You signed in with <strong className="text-stone-100 break-all">{unauthorizedEmail}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-white/10 text-xs text-stone-400 leading-relaxed text-left">
              This creator studio and Cloud Firestore database are currently in private single-user mode. Access is restricted to authorized credentials.
              <div className="text-[11px] text-stone-500 mt-2">
                Public registration and multi-user SaaS accounts will be available in an upcoming release.
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onSwitchAccount}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Try Another Account</span>
              </button>

              <button
                onClick={onDismissUnauthorized}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all"
              >
                Return to Public Landing Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
