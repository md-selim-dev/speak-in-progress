/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PracticeStory, BrandIdentity } from '../types';
import {
  X,
  Copy,
  Check,
  Youtube,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Tag,
  FileText,
  Sliders,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  generateYouTubeTitles,
  generateYouTubeDescription,
  generateYouTubeTags,
  generateYouTubeTimestamps,
  DescriptionOptions,
} from '../lib/youtubeMetadataGenerator';

interface YouTubeVideoMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStory: PracticeStory;
  allStories?: PracticeStory[];
  onSelectStory?: (story: PracticeStory) => void;
  activeBrand?: BrandIdentity;
}

export const YouTubeVideoMetadataModal: React.FC<YouTubeVideoMetadataModalProps> = ({
  isOpen,
  onClose,
  activeStory,
  allStories = [],
  onSelectStory,
  activeBrand,
}) => {
  const [currentStory, setCurrentStory] = useState<PracticeStory>(activeStory);
  const [selectedTitleStyle, setSelectedTitleStyle] = useState<string>('standard');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Description section toggles
  const [includeOverview, setIncludeOverview] = useState<boolean>(true);
  const [includeExpressions, setIncludeExpressions] = useState<boolean>(true);
  const [includeTimestamps, setIncludeTimestamps] = useState<boolean>(true);
  const [includeMethodology, setIncludeMethodology] = useState<boolean>(true);
  const [includeSocialLinks, setIncludeSocialLinks] = useState<boolean>(true);
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);

  // Sync when activeStory prop changes
  useEffect(() => {
    if (activeStory) {
      setCurrentStory(activeStory);
    }
  }, [activeStory]);

  // Titles for the current story
  const titleOptions = useMemo(() => {
    return generateYouTubeTitles(currentStory);
  }, [currentStory]);

  // When story or title style changes, update customTitle
  useEffect(() => {
    const matched = titleOptions.find((t) => t.id === selectedTitleStyle) || titleOptions[0];
    setCustomTitle(matched.title);
  }, [currentStory, selectedTitleStyle, titleOptions]);

  // Re-generate description based on active options
  useEffect(() => {
    const desc = generateYouTubeDescription(currentStory, {
      includeOverview,
      includeExpressions,
      includeTimestamps,
      includeMethodology,
      includeSocialLinks,
      includeHashtags,
    });
    setCustomDescription(desc);
  }, [
    currentStory,
    includeOverview,
    includeExpressions,
    includeTimestamps,
    includeMethodology,
    includeSocialLinks,
    includeHashtags,
  ]);

  const tags = useMemo(() => {
    return generateYouTubeTags(currentStory);
  }, [currentStory]);

  const timestamps = useMemo(() => {
    return generateYouTubeTimestamps(currentStory);
  }, [currentStory]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleCopyAll = () => {
    const fullBundle = [
      `═══ YOUTUBE TITLE ═══`,
      customTitle,
      ``,
      `═══ YOUTUBE DESCRIPTION ═══`,
      customDescription,
      ``,
      `═══ YOUTUBE TAGS ═══`,
      tags,
    ].join('\n');

    handleCopy(fullBundle, 'all');
  };

  // Day navigation
  const currentIndex = allStories.findIndex((s) => s.id === currentStory.id || s.day === currentStory.day);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < allStories.length - 1;

  const handlePrevDay = () => {
    if (hasPrev) {
      const prev = allStories[currentIndex - 1];
      setCurrentStory(prev);
      if (onSelectStory) onSelectStory(prev);
    }
  };

  const handleNextDay = () => {
    if (hasNext) {
      const next = allStories[currentIndex + 1];
      setCurrentStory(next);
      if (onSelectStory) onSelectStory(next);
    }
  };

  const titleLength = customTitle.length;
  const descriptionLength = customDescription.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="yt-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
    >
      <div className="bg-stone-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/10 bg-stone-950/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="yt-modal-title" className="text-base sm:text-lg font-bold text-white font-brand truncate">
                  YouTube Upload Kit
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                  Day {currentStory.day}
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate">
                Pre-formatted title, description, timestamps & tags ready to paste into YouTube Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick link to YouTube Studio */}
            <a
              href="https://studio.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl border border-white/10 transition-all"
              title="Open YouTube Studio in a new tab"
            >
              <span>YouTube Studio</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Selector & Metadata Strip */}
        <div className="px-5 sm:px-7 py-3 border-b border-white/[0.06] bg-stone-950/50 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              disabled={!hasPrev}
              aria-label="Previous Day"
              className="p-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {allStories.length > 0 ? (
              <select
                value={currentStory.id || currentStory.day}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = allStories.find((s) => s.id === val || String(s.day) === val);
                  if (found) {
                    setCurrentStory(found);
                    if (onSelectStory) onSelectStory(found);
                  }
                }}
                className="bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-stone-200 font-mono focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                {allStories.map((story) => (
                  <option key={story.id || story.day} value={story.id || story.day}>
                    Day {story.day}: {story.title} ({story.level || 'A1'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-mono text-stone-300 font-bold">
                Day {currentStory.day}: {currentStory.title}
              </span>
            )}

            <button
              onClick={handleNextDay}
              disabled={!hasNext}
              aria-label="Next Day"
              className="p-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 font-mono">
              {currentStory.level || 'CEFR Practice'}
            </span>
            {currentStory.topic && (
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/5 text-stone-400">
                {currentStory.topic}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* SECTION 1: VIDEO TITLE */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="yt-title-input" className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>YouTube Video Title</span>
              </label>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono ${
                    titleLength > 100
                      ? 'text-red-400 font-bold'
                      : titleLength > 85
                      ? 'text-amber-400'
                      : 'text-stone-400'
                  }`}
                >
                  {titleLength} / 100 chars
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(customTitle, 'title')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copiedKey === 'title' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Title</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Title Style Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-stone-400 uppercase font-mono mr-1">Style:</span>
              {titleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedTitleStyle(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    selectedTitleStyle === opt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <input
              id="yt-title-input"
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-white/10 text-stone-100 font-sans text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* SECTION 2: VIDEO DESCRIPTION */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="yt-desc-textarea" className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Video Description</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-400">
                  {descriptionLength} / 5,000 chars
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(customDescription, 'desc')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {copiedKey === 'desc' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Description!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Description</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Section Toggles */}
            <div className="p-3 rounded-xl bg-stone-950/80 border border-white/5 flex flex-wrap items-center gap-3 text-[11px] text-stone-300 font-mono">
              <span className="text-stone-400 uppercase text-[10px]">Include:</span>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span>⏱️ Chapters</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeExpressions}
                  onChange={(e) => setIncludeExpressions(e.target.checked)}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span>📚 3 Expressions</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeMethodology}
                  onChange={(e) => setIncludeMethodology(e.target.checked)}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span>🎙️ Method</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeSocialLinks}
                  onChange={(e) => setIncludeSocialLinks(e.target.checked)}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span>🔗 Channel Links</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeHashtags}
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <span># Hashtags</span>
              </label>
            </div>

            <textarea
              id="yt-desc-textarea"
              rows={10}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-white/10 text-stone-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-y select-all"
            />
          </div>

          {/* SECTION 3: CHAPTERS / TIMESTAMPS FAST-COPY */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-200 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>YouTube Chapters & Timestamps (Quick Copy)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(timestamps, 'timestamps')}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'timestamps' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-400" />
                    <span>Copy Chapters</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] text-stone-400 font-mono whitespace-pre-wrap leading-relaxed select-all">
              {timestamps}
            </pre>
          </div>

          {/* SECTION 4: TAGS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="yt-tags-display" className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>YouTube Video Tags</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(tags, 'tags')}
                className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'tags' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Tags!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>Copy Tags</span>
                  </>
                )}
              </button>
            </div>
            <div
              id="yt-tags-display"
              className="p-3 rounded-xl bg-stone-950 border border-white/10 text-xs text-stone-300 font-mono leading-relaxed select-all max-h-24 overflow-y-auto"
            >
              {tags}
            </div>
          </div>
        </div>

        {/* Modal Footer / Master Copy Bar */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-white/10 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ready to paste directly into YouTube Studio upload dialog.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {copiedKey === 'all' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>All YouTube Metadata Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Everything</span>
                </>
              )}
            </button>

            <a
              href="https://studio.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Youtube className="w-4 h-4" />
              <span>Open YouTube Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
