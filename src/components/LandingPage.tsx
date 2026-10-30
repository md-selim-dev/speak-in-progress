/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Globe,
  ExternalLink,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { SITE_CONFIG, PublicPageId } from '../config/site';
import { updatePageSEO } from '../lib/seoHelper';
import { PublicFeaturesView } from './public/PublicFeaturesView';
import { PublicHowItWorksView } from './public/PublicHowItWorksView';
import { PublicAboutView } from './public/PublicAboutView';
import { PublicFaqView } from './public/PublicFaqView';

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
  unauthorizedDomain?: string | null;
  onDismissDomainError?: () => void;
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
  unauthorizedDomain,
  onDismissDomainError,
}) => {
  const getPageFromPath = (pathname: string): PublicPageId => {
    if (typeof window === 'undefined') return 'home';
    const clean = pathname.toLowerCase().replace(/\/+$/, '');
    if (clean === '/features') return 'features';
    if (clean === '/how-it-works' || clean === '/howitworks') return 'howItWorks';
    if (clean === '/about') return 'about';
    if (clean === '/faq') return 'faq';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PublicPageId>(() => {
    return typeof window !== 'undefined' ? getPageFromPath(window.location.pathname) : 'home';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
      updatePageSEO(page);
    };
    window.addEventListener('popstate', handlePopState);
    updatePageSEO(currentPage);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PublicPageId) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    const targetPath = SITE_CONFIG.pages[page]?.path || '/';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    updatePageSEO(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('insights');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
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

  const navLinks: { id: PublicPageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-[#030705] text-stone-100 flex flex-col selection:bg-emerald-400/25 selection:text-emerald-200 relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="fixed top-8 sm:top-12 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[240px] sm:h-[350px] rounded-full blur-[100px] sm:blur-[140px] opacity-15 pointer-events-none -z-10"
        style={{ backgroundColor: activeBrand.colors.accent.hex }}
      />

      {/* Top Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-stone-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 text-left group cursor-pointer focus:outline-none"
          >
            <LogoMark brand={activeBrand} size="xs" layout="icon-only" isAnimated={true} />
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate font-brand group-hover:text-emerald-300 transition-colors"
                style={{ textShadow: `0 0 20px ${activeBrand.colors.accent.hex}33` }}
              >
                Speak in Progress
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-stone-400 bg-white/[0.03] hidden lg:inline shrink-0">
                CREATOR STUDIO
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-stone-900/60 p-1 rounded-xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Insights Anchor Button (shown if on home) */}
            {currentPage === 'home' && (
              <button
                onClick={scrollToInsights}
                className="hidden sm:flex text-xs font-semibold text-stone-300 hover:text-white px-3 py-2 min-h-[38px] rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Insights</span>
              </button>
            )}

            {/* Primary Action Button: 'Enter Studio' once authenticated, or 'Sign In' */}
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              className="px-3.5 sm:px-4 py-2 min-h-[38px] text-xs font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap flex items-center gap-1.5 sm:gap-2 shadow-modern-glow disabled:opacity-50"
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

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 min-h-[38px] rounded-xl text-stone-300 hover:text-white border border-white/10 bg-stone-900/60"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-stone-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-mono flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
              <a
                href="mailto:support@mdselim.com"
                className="text-xs text-stone-400 hover:text-emerald-400 px-3.5 py-1.5 flex items-center gap-2 font-mono"
              >
                <span>Support: support@mdselim.com</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Public Body (Switches seamlessly between Home and Subpages without page reload) */}
      <main
        itemScope
        itemType="https://schema.org/WebPage"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16"
      >
        {currentPage !== 'home' ? (
          <div className="space-y-8">
            {/* Accessible Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <button
                onClick={() => navigateTo('home')}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-emerald-400 font-bold">
                {SITE_CONFIG.pages[currentPage]?.title.split('—')[0].trim() || currentPage}
              </span>
            </nav>

            {/* Subpage Views */}
            {currentPage === 'features' && (
              <PublicFeaturesView
                activeBrand={activeBrand}
                onNavigate={navigateTo}
                onPrimaryAction={handlePrimaryAction}
                isAuthenticated={isAuthenticated}
              />
            )}

            {currentPage === 'howItWorks' && (
              <PublicHowItWorksView
                activeBrand={activeBrand}
                onNavigate={navigateTo}
                onPrimaryAction={handlePrimaryAction}
                isAuthenticated={isAuthenticated}
              />
            )}

            {currentPage === 'about' && (
              <PublicAboutView
                activeBrand={activeBrand}
                onNavigate={navigateTo}
                onPrimaryAction={handlePrimaryAction}
                isAuthenticated={isAuthenticated}
              />
            )}

            {currentPage === 'faq' && (
              <PublicFaqView
                activeBrand={activeBrand}
                onNavigate={navigateTo}
                onPrimaryAction={handlePrimaryAction}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        ) : (
          <div className="space-y-14 sm:space-y-20 lg:space-y-24">
            {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 max-w-full text-center leading-snug">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="truncate sm:whitespace-normal">Faceless Screen-Recording Studio · PC & OBS Ready</span>
          </div>

          <h1
            itemProp="name"
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-brand leading-[1.18] sm:leading-[1.15]"
          >
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

          <p
            itemProp="description"
            className="speakable-summary text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed px-1"
          >
            A specialized YouTube production suite and deliberate spoken practice framework. Built for PC screen recording, calibrated teleprompter pacing, unscripted memory retellings, and consistent fluency gains.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              aria-label={isAuthenticated ? 'Enter creator studio' : 'Sign in to studio'}
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
              aria-label="View methodology insights and speech research"
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
        <section
          id="workflow"
          itemScope
          itemType="https://schema.org/HowTo"
          className="bg-stone-900/60 border border-white/[0.08] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl space-y-6"
        >
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Daily Practice Architecture
            </span>
            <h2 itemProp="name" className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
              The 5-Step Screen Recording Workflow
            </h2>
            <p itemProp="description" className="text-xs sm:text-sm text-stone-400">
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
                <article
                  key={idx}
                  itemProp="step"
                  itemScope
                  itemType="https://schema.org/HowToStep"
                  className={`p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2 hover:border-emerald-500/30 transition-all flex flex-col justify-between ${
                    idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <meta itemProp="position" content={String(idx + 1)} />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {item.step}
                      </span>
                      <Icon className="w-4 h-4 text-stone-400" />
                    </div>
                    <h3 itemProp="name" className="text-sm font-bold text-white font-brand">{item.title}</h3>
                    <p itemProp="text" className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Feature Grid: 4 Studio Modules */}
        <section id="features" className="space-y-6">
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
            <article className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
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
            </article>

            {/* Feature 2 */}
            <article className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
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
            </article>

            {/* Feature 3 */}
            <article className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
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
            </article>

            {/* Feature 4 */}
            <article className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
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
            </article>
          </div>
        </section>

        {/* ====================================================
            SEO, AEO & METHODOLOGY INSIGHTS SECTION (#insights)
            Provides rich, indexed educational content without revealing private data
            ==================================================== */}
        <section
          id="insights"
          itemScope
          itemType="https://schema.org/Article"
          className="scroll-mt-24 bg-stone-900/40 border border-white/[0.08] rounded-3xl p-5 sm:p-8 lg:p-12 space-y-8 sm:space-y-12 backdrop-blur-xl"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/50 border border-emerald-500/30">
              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
              <span>Public Methodology & Research</span>
            </div>
            <h2 itemProp="headline" className="text-2xl sm:text-4xl font-extrabold text-white font-brand">
              The Cognitive Cadence Method
            </h2>
            <p itemProp="description" className="speakable-methodology text-xs sm:text-sm text-stone-300 leading-relaxed">
              Why passive listening and vocabulary lists fail to produce spontaneous speech, and how deliberate screen recording forces synaptic myelination.
            </p>
          </div>

          {/* 4 In-Depth Research Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <article className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
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
            </article>

            <article className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
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
            </article>

            <article className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
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
            </article>

            <article className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all">
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
            </article>
          </div>

          {/* Interactive Cadence & Pacing Calculator (Interactive Tool) */}
          <div
            id="pacing-tool"
            className="p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-stone-950/90 border border-emerald-500/20 space-y-6"
          >
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
              <div
                role="group"
                aria-label="Teleprompter speech pacing selection"
                className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-2 bg-stone-900 p-1 rounded-xl border border-white/10 w-full sm:w-auto shrink-0"
              >
                {(['conversational', 'presentation', 'executive'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedPace(mode)}
                    aria-pressed={selectedPace === mode}
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
                aria-label="Target script length in words"
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

          {/* Frequently Asked Questions (Structured for Google Search Engine FAQ Schema & AEO) */}
          <div id="faq" className="space-y-6 pt-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Common Inquiries
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-brand">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              <article
                itemScope
                itemType="https://schema.org/Question"
                className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 itemProp="name" className="text-sm font-bold text-white font-brand">
                    What is Speak in Progress?
                  </h4>
                </div>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text" className="speakable-faq text-xs text-stone-400 leading-relaxed">
                    A dedicated production workspace built for creators documenting their spoken English journey on YouTube through faceless screen recording, teleprompter practice, and unscripted memory retellings.
                  </p>
                </div>
              </article>

              <article
                itemScope
                itemType="https://schema.org/Question"
                className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 itemProp="name" className="text-sm font-bold text-white font-brand">
                    What is the Cognitive Cadence Method?
                  </h4>
                </div>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text" className="speakable-faq text-xs text-stone-400 leading-relaxed">
                    A language acquisition framework that pairs calibrated teleprompter pacing (130-150 words per minute) with immediate unscripted recall, building active synaptic retrieval pathways under gentle time pressure.
                  </p>
                </div>
              </article>

              <article
                itemScope
                itemType="https://schema.org/Question"
                className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 itemProp="name" className="text-sm font-bold text-white font-brand">
                    Why faceless screen-recording?
                  </h4>
                </div>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text" className="speakable-faq text-xs text-stone-400 leading-relaxed">
                    Removing face-camera pressure eliminates lighting, makeup, and framing friction, letting you dedicate 100% of cognitive energy to voice projection, idiom usage, and continuous speech flow.
                  </p>
                </div>
              </article>

              <article
                itemScope
                itemType="https://schema.org/Question"
                className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 itemProp="name" className="text-sm font-bold text-white font-brand">
                    Why are speech pauses and stumbles encouraged?
                  </h4>
                </div>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text" className="speakable-faq text-xs text-stone-400 leading-relaxed">
                    In deliberate practice, vocal stumbles indicate that the speaker is practicing at the frontier of their competence. Tracking daily stumble rates replaces anxiety with objective neuro-linguistic metrics.
                  </p>
                </div>
              </article>

              <article
                itemScope
                itemType="https://schema.org/Question"
                className="p-5 rounded-2xl bg-stone-950/70 border border-white/5 space-y-2 md:col-span-2 lg:col-span-2"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 itemProp="name" className="text-sm font-bold text-white font-brand">
                    Is internal studio data secure?
                  </h4>
                </div>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text" className="speakable-faq text-xs text-stone-400 leading-relaxed">
                    Yes. All personal recordings, teleprompter drafts, stumble logs, and studio progress are stored securely in a private, encrypted database. Only this public overview is indexable by search engines.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="bg-gradient-to-b from-stone-900/80 to-stone-950 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-14 text-center space-y-5 sm:space-y-6 relative overflow-hidden">
          {/* Subtle ambient accent glow behind enlarged logo */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 rounded-full blur-[80px] opacity-25 pointer-events-none"
            style={{ backgroundColor: activeBrand.colors.accent.hex }}
          />

          {/* Prominent Logo Container */}
          <div className="flex justify-center relative z-10">
            <div className="p-3.5 sm:p-4 rounded-3xl bg-stone-950/80 border border-white/10 shadow-2xl inline-flex items-center justify-center transition-transform hover:scale-105 duration-300">
              <LogoMark brand={activeBrand} size="lg" layout="icon-only" isAnimated={true} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-brand relative z-10">
            {isAuthenticated
              ? 'Ready to Record Today’s Session?'
              : 'Begin Your Spoken English Practice'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed relative z-10">
            {isAuthenticated
              ? 'You are signed in as creator. Jump straight into the teleprompter studio, recording suite, or thumbnail generator.'
              : 'Sign in to access your personalized teleprompter studio, daily unscripted prompts, and private cloud sync.'}
          </p>
          <div className="pt-2 relative z-10">
            <button
              onClick={handlePrimaryAction}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[46px] text-sm font-black rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-modern-glow inline-flex items-center justify-center gap-2 cursor-pointer"
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
          </div>
        )}
      </main>

      {/* Clean Public Footer (Without Internal Infrastructure Jargon) */}
      <footer className="border-t border-white/[0.08] bg-stone-950/95 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-xs text-stone-400 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1: Brand & Slogan */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <LogoMark brand={activeBrand} size="xs" layout="icon-only" isAnimated={false} />
                <span className="font-extrabold text-base text-white font-brand">
                  Speak in Progress
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-md">
                A specialized YouTube production suite and deliberate spoken practice framework. Built for PC screen recording, calibrated teleprompter pacing (15–75 px/s, 130–160 WPM), unscripted memory retellings, and consistent fluency gains.
              </p>
              <p className="text-[11px] text-stone-400">
                Progress, not perfection · Built for PC screen recording & public storytelling
              </p>
            </div>

            {/* Col 2: Public Navigation */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono font-bold text-stone-200 uppercase tracking-wider">
                Public Suite
              </div>
              <ul className="space-y-2 text-xs">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => navigateTo(link.id)}
                      className={`hover:text-emerald-400 transition-colors cursor-pointer ${
                        currentPage === link.id ? 'text-emerald-400 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Direct Inquiries */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono font-bold text-stone-200 uppercase tracking-wider">
                Creator & Inquiries
              </div>
              <div className="space-y-2 text-xs text-stone-400">
                <p>Founder: <span className="text-stone-200 font-semibold">{SITE_CONFIG.creator.name}</span></p>
                <p>Inquiries: <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-emerald-400 hover:underline">{SITE_CONFIG.supportEmail}</a></p>
                <p className="text-[11px] text-stone-400 pt-1">
                  Focused on spoken English cadence, active memory recall, and faceless YouTube content creation.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <div>
              © {new Date().getFullYear()} Speak in Progress · Founded by Md. Selim. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button onClick={() => navigateTo('home')} className="hover:text-emerald-400 cursor-pointer">Home</button>
              <span>·</span>
              <button onClick={() => navigateTo('features')} className="hover:text-emerald-400 cursor-pointer">Features</button>
              <span>·</span>
              <button onClick={() => navigateTo('howItWorks')} className="hover:text-emerald-400 cursor-pointer">How It Works</button>
              <span>·</span>
              <button onClick={() => navigateTo('about')} className="hover:text-emerald-400 cursor-pointer">About</button>
              <span>·</span>
              <button onClick={() => navigateTo('faq')} className="hover:text-emerald-400 cursor-pointer">FAQ</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================
          MODAL: Unauthorized Account Dialog (Polite & Human-Friendly)
          ==================================================== */}
      {unauthorizedEmail && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center max-h-[92vh] overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shrink-0 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white font-brand">Private Studio Access</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                You signed in with <strong className="text-stone-100 break-all">{unauthorizedEmail}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/90 border border-white/10 text-xs text-stone-300 leading-relaxed text-left space-y-2">
              <p className="font-semibold text-stone-100 text-sm">
                This is only for a private user.
              </p>
              <p className="text-xs text-stone-300">
                To learn more about this, contact:{' '}
                <a
                  href="mailto:support@mdselim.com?subject=Inquiry%20about%20Speak%20in%20Progress%20Studio"
                  className="text-emerald-400 hover:text-emerald-300 underline font-mono font-bold transition-colors inline-block"
                >
                  support@mdselim.com
                </a>
              </p>
              <p className="text-[11px] text-stone-400 pt-1 border-t border-white/5">
                This workspace and teleprompter database are currently reserved for the owner account. Multi-user accounts will be supported in an upcoming release.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <a
                href="mailto:support@mdselim.com?subject=Inquiry%20about%20Speak%20in%20Progress%20Studio"
                className="w-full px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Contact: support@mdselim.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onSwitchAccount}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl text-xs font-semibold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Try Another Google Account</span>
              </button>

              <button
                onClick={onDismissUnauthorized}
                className="w-full px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 transition-all"
              >
                Return to Public Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: Unauthorized Domain Guide (Fix for Netlify domain)
          ==================================================== */}
      {unauthorizedDomain && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center max-h-[92vh] overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shrink-0 shadow-inner">
              <Globe className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white font-brand">Authorize Domain for Studio Access</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Authentication blocked access because{' '}
                <strong className="text-emerald-400 font-mono break-all">{unauthorizedDomain}</strong>{' '}
                has not yet been added to your project’s Authorized Domains list.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/90 border border-white/10 text-xs text-stone-300 leading-relaxed text-left space-y-2.5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                How to Fix in 30 Seconds:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-stone-300 text-xs">
                <li>
                  Go to Firebase Console: <strong className="text-white font-mono">reverberant-block-5mn89</strong>
                </li>
                <li>
                  Navigate to <strong className="text-white">Authentication</strong> &gt; <strong className="text-white">Settings</strong> &gt; <strong className="text-white">Authorized domains</strong>
                </li>
                <li>
                  Click <strong className="text-white">Add domain</strong> and enter:
                  <div className="mt-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-emerald-500/30 font-mono text-emerald-300 text-xs select-all flex items-center justify-between">
                    <span>{unauthorizedDomain}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(unauthorizedDomain);
                        }
                      }}
                      className="text-[10px] text-stone-400 hover:text-white underline ml-2"
                    >
                      Copy
                    </button>
                  </div>
                </li>
                <li>
                  Click <strong className="text-white">Save</strong>, then come back here and click Sign In!
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://console.firebase.google.com/project/reverberant-block-5mn89/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Open Firebase Console Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onDismissDomainError && (
                <button
                  onClick={onDismissDomainError}
                  className="w-full px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 transition-all"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
