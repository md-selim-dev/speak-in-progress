/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BrandIdentity } from '../../types';
import { HelpCircle, ChevronDown, Search, Youtube, ExternalLink } from 'lucide-react';
import { PUBLIC_FAQ_ITEMS } from '../../config/seoSchemas';

interface PublicFaqViewProps {
  activeBrand: BrandIdentity;
  onNavigate: (page: 'home' | 'features' | 'howItWorks' | 'about') => void;
  onPrimaryAction: () => void;
  isAuthenticated: boolean;
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

  const faqItems = PUBLIC_FAQ_ITEMS;

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
        <p className="speakable-summary text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
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
      <section
        itemScope
        itemType="https://schema.org/FAQPage"
        className="max-w-3xl mx-auto space-y-3"
      >
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
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
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
                    <h2 itemProp="name" className="text-base sm:text-lg font-bold text-white font-brand">
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
                <div
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                  className={
                    isOpen
                      ? 'px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-stone-300 leading-relaxed border-t border-white/5'
                      : 'hidden'
                  }
                >
                  <p itemProp="text" className="speakable-faq">{item.a}</p>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Official YouTube Channel & Community */}
      <section className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-white/10 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
          <Youtube className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-brand">Follow on YouTube</h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
            Watch authentic daily spoken practice, pacing routines, unscripted retellings, and fluency documentation on our official YouTube channel.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="https://www.youtube.com/@SpeakInProgress"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20"
          >
            <Youtube className="w-4 h-4" />
            <span>Visit @SpeakInProgress on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-white/80" />
          </a>
        </div>
      </section>
    </div>
  );
};
