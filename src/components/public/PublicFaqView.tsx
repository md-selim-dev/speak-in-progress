/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BrandIdentity } from '../../types';
import { HelpCircle, ChevronDown, Search, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PublicFaqViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'features' | 'howItWorks' | 'about') => void;
  onPrimaryAction: () => void;
  isAuthenticated: boolean;
}

interface FaqItem {
  q: string;
  a: string;
  category: 'General' | 'Prompter & Practice' | 'YouTube & Output' | 'Privacy & Access';
}

export const PublicFaqView: React.FC<PublicFaqViewProps> = ({
  activeBrand,
  onNavigate,
  onPrimaryAction,
  isAuthenticated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // first two open by default

  const faqItems: FaqItem[] = [
    {
      category: 'General',
      q: 'What is Speak in Progress?',
      a: 'Speak in Progress is a purpose-built desktop studio application engineered by Md. Selim for mastering English spoken fluency and YouTube content delivery. It combines an ultra-smooth teleprompter, an impromptu 90-second recall timer, a 2K thumbnail generator, a dynamic video intro suite, and a 120-day progressive CEFR syllabus (A1 to C2).',
    },
    {
      category: 'Prompter & Practice',
      q: 'Why practice spoken English with a teleprompter?',
      a: 'Reading along with calibrated auto-scroll (between 15 and 75 pixels per second, targeting 130–160 words per minute) trains neuromuscular speech rhythm and eliminates hesitation pauses. It conditions the speaker to formulate continuous English phrases without stopping to translate in their head.',
    },
    {
      category: 'Prompter & Practice',
      q: 'What is the 90-second impromptu recall challenge?',
      a: 'Immediately after reading through a script on the prompter, the text is hidden and a 90-second countdown begins. The speaker must spontaneously summarize the core points aloud using the target vocabulary. This bridges the critical gap between passive reading fluency and active unscripted conversational synthesis.',
    },
    {
      category: 'Prompter & Practice',
      q: 'Can I customize the teleprompter scroll speed and visual layout?',
      a: 'Yes. You can fine-tune scroll velocity between 15 and 75 pixels per second to match your natural speech cadence (110 to 165 WPM). You can also scale font size from 24px up to 64px, switch line height, adjust column margins, and toggle eye-level focus guides.',
    },
    {
      category: 'YouTube & Output',
      q: 'How does the faceless YouTube workflow function?',
      a: 'Rather than dealing with camera anxiety, studio lighting, or complex webcam rigs, you simply record your computer screen using free capture software like OBS Studio or native Windows/macOS tools while the teleprompter scrolls. Your voice is recorded via your microphone over the high-contrast prompter text, creating clean educational and commentary videos ready for YouTube.',
    },
    {
      category: 'YouTube & Output',
      q: 'Can I record with screen recorders other than OBS Studio?',
      a: 'Yes. Speak in Progress runs in any modern desktop browser. You can capture sessions using OBS Studio, native Windows Game Bar (Win+G), macOS QuickTime, Loom, or any PC screen recorder.',
    },
    {
      category: 'YouTube & Output',
      q: 'How does the Thumbnail & Video Intro suite work without external software?',
      a: 'The application contains native HTML5 canvas graphic engines. The Thumbnail Studio renders pixel-perfect 2560×1440 (2K) and 1920×1080 (FHD) PNG graphics with customizable titles, level badges, and color presets. The Video Intro Suite renders animated 5-second countdown title sequences directly in the browser with zero external editing required.',
    },
    {
      category: 'General',
      q: 'What is the 120-Day structured syllabus?',
      a: 'The application contains a built-in curriculum organized across 6 CEFR difficulty levels (A1 through C2). Each day provides an actionable script, key vocabulary breakdown, structural grammar patterns, and estimated speaking duration, guiding speakers from beginner confidence to executive-level articulation.',
    },
    {
      category: 'Privacy & Access',
      q: 'Can anyone create an account, or is the private studio restricted?',
      a: 'The public website, methodology documentation, feature breakdowns, and workflow guides are open to everyone worldwide. The private studio dashboard, personal script library, and recording persistence are currently reserved for the creator account to ensure an uninterrupted, personalized workflow.',
    },
    {
      category: 'General',
      q: 'How can I contact the creator or report an issue?',
      a: 'You can contact creator Md. Selim directly via email at support@mdselim.com for feedback, inquiries, or collaboration opportunities.',
    },
  ];

  const categories = ['All', 'General', 'Prompter & Practice', 'YouTube & Output', 'Privacy & Access'];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [faqItems, activeCategory, searchQuery]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-brand tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Clear, factual answers regarding the teleprompter studio, the Cognitive Cadence Method, faceless YouTube workflow, and technical architecture.
        </p>
      </section>

      {/* Search & Category Filter */}
      <section className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword (e.g. WPM, OBS, 90s, syllabus)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900/80 border border-white/10 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-stone-900 text-stone-300 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-900/40 border border-white/5 text-stone-400 text-sm">
            No matching questions found for "{searchQuery}". Try a different keyword or reset filters.
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <article
                key={idx}
                className="rounded-2xl bg-stone-900/60 border border-white/[0.08] hover:border-emerald-500/20 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white font-brand">
                      {item.q}
                    </h2>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-xl bg-stone-950/80 border border-white/10 flex items-center justify-center text-stone-300 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400 border-emerald-500/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-stone-300 leading-relaxed border-t border-white/5">
                    <p>{item.a}</p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Contact Support Box */}
      <section className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-white/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-brand">Have a Specific Question?</h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
            Need guidance on setting up OBS Studio, teleprompter pacing calibration, or private workspace inquiries?
          </p>
        </div>
        <div className="pt-2">
          <a
            href="mailto:support@mdselim.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs uppercase tracking-wider transition-all"
          >
            <span>Email Creator: support@mdselim.com</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};
