/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { Copy, Check, MessageSquare, ShieldAlert, CheckCircle2, Wand2, Sparkles } from 'lucide-react';

interface ToneScriptBibleViewProps {
  activeBrand: BrandIdentity;
}

export const ToneScriptBibleView: React.FC<ToneScriptBibleViewProps> = ({ activeBrand }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Hook generator states
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [customTopic, setCustomTopic] = useState<string>('The Morning Routine Shift');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generatedTitles = [
    `Speak in Progress · Day ${selectedDay} | ${customTopic}`,
    `Day ${selectedDay} · Retelling ${customTopic} Without Script`,
    `Speaking English at My Own Pace: Day ${selectedDay} (${customTopic})`,
  ];

  const generatedThumbnailHooks = [
    `DAY ${selectedDay < 10 ? '0' + selectedDay : selectedDay} · ${customTopic.toUpperCase().slice(0, 20)}`,
    `NO SCRIPT · RETELLING DAY ${selectedDay}`,
    `SPEAK IN PROGRESS · DAY ${selectedDay}`,
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Editorial Header */}
      <section className="relative overflow-hidden bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider"
            style={{
              color: activeBrand.colors.accent.hex,
              backgroundColor: `${activeBrand.colors.accent.hex}15`,
              border: `1px solid ${activeBrand.colors.accent.hex}30`,
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Voice, Personality & Delivery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
            Speak in Progress · Voice & Tone Bible
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed font-sans">
            The foundation of <strong>Speak in Progress</strong> is radical authenticity. You create videos based on your own schedule and comfort. The goal is steady, sustainable growth—making mistakes, learning, and documenting real fluency reps in public view.
          </p>
        </div>

        {/* Philosophy Card */}
        <div
          className="mt-6 sm:mt-8 bg-stone-950/80 border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 shadow-badge-inset"
          style={{ borderColor: `${activeBrand.colors.accent.hex}30` }}
        >
          <div
            className="w-2 sm:w-2.5 h-12 sm:h-14 rounded-full shrink-0"
            style={{ backgroundColor: activeBrand.colors.accent.hex }}
          />
          <div className="space-y-1 min-w-0">
            <div
              className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: activeBrand.colors.accent.hex }}
            >
              Core Channel Motto
            </div>
            <p className="text-sm sm:text-lg italic text-white font-editorial">
              "{activeBrand.toneGuidelines.philosophyQuote}"
            </p>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts Matrix - Responsive */}
      <section className="space-y-4 sm:space-y-6">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: activeBrand.colors.accent.hex }}
          >
            01. Authentic Communication
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            What We Say vs. What We Ban
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Never apologize for showing up. Speak with quiet confidence and continuous momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Do say card */}
          <div className="bg-stone-900/60 border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-card-elevated">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Signature Voice (Do Say)</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {activeBrand.toneGuidelines.doSay.map((phrase, i) => (
                <div
                  key={i}
                  className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs text-stone-200 leading-relaxed flex items-start gap-2.5 shadow-sm"
                >
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{phrase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don't say card */}
          <div className="bg-stone-900/60 border border-rose-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-card-elevated">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Banned Habits (Don't Say)</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {activeBrand.toneGuidelines.dontSay.map((phrase, i) => (
                <div
                  key={i}
                  className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs text-stone-300 leading-relaxed flex items-start gap-2.5 shadow-sm"
                >
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✗</span>
                  <span>{phrase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Part Video Script Formulas - Responsive Grid */}
      <section className="space-y-4 sm:space-y-6">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: activeBrand.colors.accent.hex }}
          >
            02. Standard Video Architecture
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The 4-Part Practice Script
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Keep every video between 4 to 7 minutes. Follow this exact flow for effortless recording whenever you create.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Part 1 */}
          <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-card-elevated">
            <div className="flex items-center justify-between">
              <div
                className="text-[11px] sm:text-xs font-mono font-bold"
                style={{ color: activeBrand.colors.accent.hex }}
              >
                PART 1 · INTRODUCTION (15–25s)
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `"Welcome back to Speak in Progress. Today is Day 1 of my speaking journey. Today's story is about morning routines, and my focus is on speaking in full thoughts without translating in my head first. Let's get right into it."`,
                    'script-intro'
                  )
                }
                className="text-stone-400 hover:text-white p-1 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'script-intro' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">Daily Intent & Target</h3>
            <p className="text-xs text-stone-300 bg-stone-950/80 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] leading-relaxed font-sans shadow-badge-inset">
              "Welcome back to Speak in Progress. Today is Day [X] of my speaking journey. Today's story explores [Topic], and my focus today is [Skill, e.g., natural pacing]. Let's jump into the story."
            </p>
            <div className="text-[11px] text-stone-400">
              💡 <em>Hook the viewer with your honest speaking goal within 5 seconds.</em>
            </div>
          </div>

          {/* Part 2 */}
          <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-card-elevated">
            <div
              className="text-[11px] sm:text-xs font-mono font-bold"
              style={{ color: activeBrand.colors.accent.hex }}
            >
              PART 2 · STORY READING (2–3 MIN)
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">Teleprompter Delivery</h3>
            <p className="text-xs text-stone-300 bg-stone-950/80 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] leading-relaxed font-sans shadow-badge-inset">
              Read the story cleanly on your PC screen. When you mispronounce a word, <strong>do not restart the video</strong>! Simply pause for half a second, say the word again with correct intonation, and continue smoothly.
            </p>
            <div className="text-[11px] text-stone-400">
              💡 <em>Viewers love seeing a natural self-correction—it proves this is genuine practice!</em>
            </div>
          </div>

          {/* Part 3 */}
          <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-card-elevated">
            <div className="flex items-center justify-between">
              <div
                className="text-[11px] sm:text-xs font-mono font-bold"
                style={{ color: activeBrand.colors.accent.hex }}
              >
                PART 3 · USEFUL EXPRESSIONS (45–60s)
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `"From today's story, there are three expressions that make spoken English sound so much more natural: First, 'hit the ground running'..."`,
                    'script-exp'
                  )
                }
                className="text-stone-400 hover:text-white p-1 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'script-exp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">3 High-Value Phrases</h3>
            <p className="text-xs text-stone-300 bg-stone-950/80 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] leading-relaxed font-sans shadow-badge-inset">
              "From this story, here are 3 phrases you can use in everyday conversation. Number 1: [Phrase] — it means [Meaning]. In a sentence: [Your real-life example]."
            </p>
            <div className="text-[11px] text-stone-400">
              💡 <em>Share a real sentence from your own life. That makes the phrase unforgettable.</em>
            </div>
          </div>

          {/* Part 4 */}
          <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-card-elevated">
            <div className="flex items-center justify-between">
              <div
                className="text-[11px] sm:text-xs font-mono font-bold"
                style={{ color: activeBrand.colors.accent.hex }}
              >
                PART 4 · RETELLING & REFLECTION (1–2 MIN)
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `"Now for the hardest and most important part: I am hiding the script. Here is the story in my own words..."`,
                    'script-retell'
                  )
                }
                className="text-stone-400 hover:text-white p-1 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedKey === 'script-retell' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">Script-Free Memory Retelling</h3>
            <p className="text-xs text-stone-300 bg-stone-950/80 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] leading-relaxed font-sans shadow-badge-inset">
              "Now comes the real workout. I am hiding the script. Let me retell this story from memory in my own English... [Retell in 30-60s]... Remember: progress, not perfection. See you in the next session!"
            </p>
            <div className="text-[11px] text-stone-400">
              💡 <em>This builds true unscripted speaking fluency without mental translation.</em>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Bengali / Creator Context Note */}
      <section className="bg-stone-900/40 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3.5 shadow-card-elevated">
        <div
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ color: activeBrand.colors.accent.hex }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Strategy Note · কেন নিজের গতিতে প্র্যাকটিস সবচেয়ে সেরা (বাংলা গাইডলাইন)</span>
        </div>
        <div className="text-xs sm:text-sm text-stone-300 leading-relaxed space-y-3">
          <p>
            <strong>১. মানসিক চাপমুক্ত ধারাবাহিকতা:</strong> কোনো কৃত্রিম দিনসীমা (যেমন ১২০ দিন বা ১০০ দিন) নিজের ওপর চাপিয়ে দেওয়ার দরকার নেই। আপনি যখন সময় ও কমফোর্ট পাবেন, তখনই ১টি গল্প নিয়ে বসবেন, স্ক্রিনে রিডিং পড়বেন এবং সাথে সাথে <em>স্ক্রিপ্ট বন্ধ করে নিজের ভাষায় রিটেল করবেন</em>।
          </p>
          <p>
            <strong>২. ধাপে ধাপে ক্যামেরার আত্মবিশ্বাস তৈরি:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-400">
            <li><strong>Stage 1 (শুরুর ভিডিওগুলো):</strong> সম্পূর্ণ Faceless। পিসির স্ক্রিন রেকর্ডার + মাইক্রোফোনে স্পষ্ট কণ্ঠে গল্প বলা ও রিটেলিং। নিজের ভয়েস রেকর্ড শোনার জড়তা কাটানো।</li>
            <li><strong>Stage 2 (মাঝামাঝি পর্যায়):</strong> যখন আপনি স্বাচ্ছন্দ্য বোধ করবেন, স্ক্রিন রেকর্ডিংয়ের সাথে ইন্ট্রো বা রিফ্লেকশনে ছোট কর্নার ক্যামেরা (Webcam) যুক্ত করা।</li>
            <li><strong>Stage 3 (পরবর্তী পর্যায়):</strong> পূর্ণ আত্মবিশ্বাস। ক্যামেরা ফেস করে রিটেলিং এবং পাবলিক স্পিকিং পোর্টফোলিও হিসেবে তুলে ধরা।</li>
          </ul>
        </div>
      </section>

      {/* Interactive Title & Thumbnail Hook Generator */}
      <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: activeBrand.colors.accent.hex }}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Instant Generator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              YouTube Title & Hook Generator
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Generate consistent, click-worthy, algorithm-friendly titles for Speak in Progress.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
              Day / Session Number
            </label>
            <input
              type="number"
              min="1"
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
              className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-100 font-mono focus:outline-none shadow-badge-inset"
              style={{ outlineColor: activeBrand.colors.accent.hex }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-400 uppercase mb-1.5">
              Story Topic / Title
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full bg-stone-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none shadow-badge-inset"
              style={{ outlineColor: activeBrand.colors.accent.hex }}
            />
          </div>
        </div>

        {/* Output Formulas */}
        <div className="space-y-4 pt-1">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Optimized Video Titles
          </div>
          <div className="space-y-2">
            {generatedTitles.map((title, i) => (
              <div
                key={i}
                className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between gap-3 shadow-sm hover:border-emerald-500/30 transition-colors"
              >
                <span className="text-xs font-medium text-stone-200 truncate">{title}</span>
                <button
                  onClick={() => handleCopy(title, `title-${i}`)}
                  className="text-stone-400 hover:text-emerald-400 p-1 shrink-0"
                  title="Copy Title"
                >
                  {copiedKey === `title-${i}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider pt-2">
            Matching Thumbnail Text Slogans
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {generatedThumbnailHooks.map((hook, i) => (
              <div
                key={i}
                className="bg-stone-950/80 p-3 rounded-xl border border-white/[0.06] flex items-center justify-between gap-2 shadow-sm"
              >
                <span
                  className="text-xs font-bold font-mono truncate"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  {hook}
                </span>
                <button
                  onClick={() => handleCopy(hook, `hook-${i}`)}
                  className="text-stone-400 hover:text-white p-1 shrink-0"
                >
                  {copiedKey === `hook-${i}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
