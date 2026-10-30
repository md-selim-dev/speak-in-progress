/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandIdentity } from '../../types';
import { Play, Sparkles, Monitor, Mic, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PublicHowItWorksViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'features' | 'about' | 'faq') => void;
  onPrimaryAction: () => void;
  isAuthenticated: boolean;
}

export const PublicHowItWorksView: React.FC<PublicHowItWorksViewProps> = ({
  activeBrand,
  onNavigate,
  onPrimaryAction,
  isAuthenticated,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Select Daily Script or Curriculum Topic',
      subtitle: 'Structured Leveled Progression (A1 through C2)',
      description:
        'Choose from the built-in 120-Day structured syllabus organized across 6 CEFR difficulty levels, or paste your own custom script. Each lesson features target vocabulary, sentence patterns, and estimated spoken duration.',
      bullets: [
        'Curated CEFR levels from Beginner (A1) to Mastery (C2)',
        'Built-in reflection prompts and business communication scenarios',
        'Direct synchronization to your private cloud library'
      ],
      icon: Clock,
    },
    {
      num: '02',
      title: 'Calibrate Prompter Speed & Visual Layout',
      subtitle: 'Target 130–160 Spoken Words Per Minute',
      description:
        'Adjust the smooth auto-scroll velocity between 15 and 75 pixels per second to match your conversational pace. Fine-tune font sizes from 24px up to 64px, switch line height, and toggle reading guides for eye-level tracking.',
      bullets: [
        'Real-time WPM pacing counter and estimated finish clock',
        'High-contrast dark-mode typography minimizing eye fatigue',
        'Spacebar keyboard control for zero-distraction recording'
      ],
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Record Seamlessly with PC Screen Capture (OBS)',
      subtitle: 'Faceless YouTube Production Philosophy',
      description:
        'Hit record in OBS Studio, native Windows Game Bar, or macOS QuickTime. The teleprompter fills your monitor with pristine typography while your condenser mic captures crisp voiceover, eliminating camera anxiety.',
      bullets: [
        'Zero camera setup or studio lighting required',
        '100% focus on pronunciation, cadence, and vocal confidence',
        'Clean, undistracted visual feed ideal for YouTube desktop recordings'
      ],
      icon: Monitor,
    },
    {
      num: '04',
      title: 'Run the 90-Second Impromptu Recall Challenge',
      subtitle: 'Active Spontaneous Cognitive Synthesis',
      description:
        'Immediately after reading the prompter, flip to the impromptu challenge. With the text hidden, deliver a spontaneous 90-second verbal summary using target vocabulary. This bridges passive reading into active fluency.',
      bullets: [
        'Hard 90-second countdown with visual pulse warnings',
        'Forces natural conversational retrieval without crutches',
        'Measurable improvement in unscripted articulation over time'
      ],
      icon: Mic,
    },
    {
      num: '05',
      title: 'Package Assets in Thumbnail & Intro Suites',
      subtitle: 'Zero-Export Canvas Generation (2K & 1080p)',
      description:
        'Generate high-CTR YouTube thumbnails with level badges, bold typography, and gradient accents right in your browser. Render high-res PNGs and dynamic video intro title cards to complete your YouTube upload.',
      bullets: [
        '2560×1440 and 1920×1080 native canvas PNG exports',
        'Pre-configured aesthetic templates matching YouTube standards',
        'Browser-rendered video intro countdowns with zero watermarks'
      ],
      icon: Play,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <Play className="w-3.5 h-3.5" />
          <span>Daily Workflow Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-brand tracking-tight">
          How Speak in Progress Works
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          A disciplined, 5-phase daily spoken workout that pairs teleprompter-guided reading with active recall and high-impact YouTube video packaging.
        </p>
      </section>

      {/* Steps List */}
      <section className="space-y-6 sm:space-y-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <article
              key={step.num}
              className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col md:flex-row gap-6 sm:gap-8 items-start"
            >
              {/* Step indicator */}
              <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto md:min-w-[120px] gap-3 shrink-0">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400/90">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400/80 uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand mt-1">
                    {step.title}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  {step.description}
                </p>
                <ul className="grid sm:grid-cols-3 gap-2.5 pt-2">
                  {step.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/70 p-3 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>

      {/* Recommended Pacing Guide Table */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950 border border-white/[0.08] space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Calibration Reference
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-brand mt-1">
            Teleprompter Speed vs. Spoken Cadence
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Target pacing guide based on real speech velocity for clear, confident YouTube English narration.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-300 border-collapse">
            <thead>
              <tr className="border-b border-white/10 font-mono text-stone-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Prompter Scroll Speed</th>
                <th className="py-3 px-4">Target WPM</th>
                <th className="py-3 px-4">Recommended Tone & Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">A1–A2 (Foundational)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">18–25 px/sec</td>
                <td className="py-3.5 px-4 font-mono">110–125 WPM</td>
                <td className="py-3.5 px-4 text-stone-400">Vowel elongation, syllable precision, breathing control</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">B1–B2 (Conversational)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">30–42 px/sec</td>
                <td className="py-3.5 px-4 font-mono">130–145 WPM</td>
                <td className="py-3.5 px-4 text-stone-400">Natural pauses, connected speech, professional inflection</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">C1–C2 (Advanced Mastery)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">45–60 px/sec</td>
                <td className="py-3.5 px-4 font-mono">150–165 WPM</td>
                <td className="py-3.5 px-4 text-stone-400">Rapid thought delivery, authoritative storytelling, debate cadence</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA & Interlinks */}
      <section className="p-8 sm:p-12 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
          Ready to Practice Today’s 5-Step Session?
        </h2>
        <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto">
          Launch your personal studio or discover deep-dive feature specifications and curriculum details.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onPrimaryAction}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isAuthenticated ? 'Enter Personal Workspace' : 'Sign In with Authorized Google ID'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('features')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-200 font-mono text-xs uppercase tracking-wider transition-all"
          >
            Explore Feature Breakdown →
          </button>
        </div>
      </section>
    </div>
  );
};
