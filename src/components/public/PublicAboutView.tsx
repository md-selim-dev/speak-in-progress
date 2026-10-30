/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandIdentity } from '../../types';
import { User, Shield, Terminal, BookOpen, Heart, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface PublicAboutViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'features' | 'howItWorks' | 'faq') => void;
  onPrimaryAction: () => void;
  isAuthenticated: boolean;
}

export const PublicAboutView: React.FC<PublicAboutViewProps> = ({
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
          <User className="w-3.5 h-3.5" />
          <span>Origin & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-brand tracking-tight">
          About Speak in Progress
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Built by Md. Selim to solve the real friction of mastering spoken English fluency through daily faceless YouTube screen recordings and structured cadence training.
        </p>
      </section>

      {/* Founder & Purpose Story */}
      <section className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              The Motivation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
              Fluency as an Engineering Discipline
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              For non-native English speakers, the barrier to spoken fluency is rarely grammar or vocabulary comprehension. The real bottleneck is <em>motor-articulatory speed</em> and <em>unprompted cognitive retrieval</em> under pressure.
            </p>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Traditional language apps focus on multiple-choice quizzes or text exercises. Meanwhile, recording full camera videos creates paralyzing friction around lighting, facial expression, and studio equipment.
            </p>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              <strong>Speak in Progress</strong> was conceived and architected by Md. Selim as a focused personal production studio: a high-contrast desktop prompter paired with screen recording and active recall tests that removes camera anxiety completely.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white font-brand">Faceless Production</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Record your screen and microphone directly into OBS Studio. Zero video lighting, zero camera dread, 100% vocal delivery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white font-brand">120-Day CEFR Syllabus</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Structured progressive curriculum covering 6 levels (A1 to C2) with curated vocabulary and natural sentence cadence.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Bio Card & Mission Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/70 border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-stone-950 font-extrabold text-2xl font-brand shadow-lg shadow-emerald-500/20">
                MS
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-brand">Md. Selim</h3>
                <p className="text-xs font-mono text-emerald-400">Founder & Creator</p>
                <p className="text-xs text-stone-400 mt-0.5">Spoken Fluency Journey & Architecture</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-3 text-xs text-stone-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-stone-400">Direct Inquiries</span>
                <a href="mailto:support@mdselim.com" className="text-emerald-400 hover:underline font-mono">
                  support@mdselim.com
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-stone-400">Practice Modality</span>
                <span className="font-mono text-stone-200">Faceless PC Screen Recording</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-stone-400">Cadence Target</span>
                <span className="font-mono text-stone-200">130–160 Words / Minute</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Core Philosophy</span>
                <span className="font-mono text-stone-200">Progress, not perfection</span>
              </div>
            </div>
          </div>

          {/* Privacy & Workspace Access Notice */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Private Creator Workspace</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              This public site shares our daily practice methodology and feature documentation. Access to the teleprompter studio, script storage, and recording logs is protected for personalized creator access.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Principles of the Cognitive Cadence Method */}
      <section className="p-6 sm:p-10 rounded-3xl bg-stone-900/60 border border-white/[0.08] space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Methodology
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand mt-1">
            The Cognitive Cadence Method
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Four interconnected learning feedback loops built directly into the software.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">01. Muscle Memory</span>
            <h3 className="text-sm font-bold text-white font-brand">Subvocal Alignment</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Forcing constant forward momentum at 130–160 WPM eliminates mid-sentence hesitation and self-doubt.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-stone-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">02. Active Retrieval</span>
            <h3 className="text-sm font-bold text-white font-brand">90s Spontaneous Recall</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Immediate unprompted verbal synthesis ensures concepts are owned cognitively rather than merely read.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-stone-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">03. Visual Accountability</span>
            <h3 className="text-sm font-bold text-white font-brand">YouTube Output</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Publishing faceless recordings creates a permanent, auditable log of your accent, tone, and pacing growth.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-stone-950/80 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">04. Zero Asset Delay</span>
            <h3 className="text-sm font-bold text-white font-brand">Studio Packaging</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Integrated 2K thumbnail and intro card generators remove friction between finishing a recording and uploading.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="p-8 sm:p-12 rounded-3xl bg-stone-900/80 border border-white/10 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
          Learn How to Apply This Workflow
        </h2>
        <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto">
          Read the 5-step daily blueprint or explore the full technical studio breakdown.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('howItWorks')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>See the Daily 5-Step Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('faq')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-200 font-mono text-xs uppercase tracking-wider transition-all"
          >
            Frequently Asked Questions →
          </button>
        </div>
      </section>
    </div>
  );
};
