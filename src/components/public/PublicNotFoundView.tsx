/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrandIdentity } from '../../types';
import { AlertCircle, Home, ArrowRight, Sliders, BookOpen, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface PublicNotFoundViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'features' | 'howItWorks' | 'about' | 'faq') => void;
}

export const PublicNotFoundView: React.FC<PublicNotFoundViewProps> = ({
  activeBrand,
  onNavigate,
}) => {
  useEffect(() => {
    // Strictly inform search engine crawlers that this route is not indexable (prevent soft 404)
    document.title = 'Page Not Found (404) — Speak in Progress';
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const googlebotMeta = document.querySelector('meta[name="googlebot"]');
    robotsMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    googlebotMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 sm:py-20 text-center space-y-8 animate-fade-in">
      {/* 404 Visual Indicator */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-950/40 border border-amber-500/30">
          <span>Error 404 · Page Not Found</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-brand tracking-tight">
          Lost in the Studio?
        </h1>
        <p className="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed">
          The page or resource you are looking for does not exist, has been removed, or the URL was entered incorrectly.
        </p>
      </div>

      {/* Return to Home CTA */}
      <div className="pt-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-modern-glow hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Studio Home</span>
        </a>
      </div>

      {/* Helpful Directory of Public Pages */}
      <div className="pt-8 border-t border-white/10 text-left space-y-4">
        <h2 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider text-center">
          Explore Available Public Pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          <a
            href="/features"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('features');
            }}
            className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 hover:border-emerald-500/30 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">Features</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          <a
            href="/how-it-works"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('howItWorks');
            }}
            className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 hover:border-emerald-500/30 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">How It Works</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('about');
            }}
            className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 hover:border-emerald-500/30 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">About &amp; Mission</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          <a
            href="/faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('faq');
            }}
            className="p-3.5 rounded-xl bg-stone-900/60 border border-white/10 hover:border-emerald-500/30 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300">Frequently Asked Questions</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
};
