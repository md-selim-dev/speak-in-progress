/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BrandIdentity, PracticeStory } from '../types';
import { Copy, Check, Download, FileText, Youtube, Sparkles, Tv, ExternalLink, Image as ImageIcon, Film, Clock, Tag } from 'lucide-react';
import { exportThumbnailPNG } from './ThumbnailDesignStudio';
import { SAMPLE_STORIES } from '../data/sampleStories';
import { YouTubeVideoMetadataModal } from './YouTubeVideoMetadataModal';
import {
  generateYouTubeTitles,
  generateYouTubeDescription,
  generateYouTubeTags,
  generateYouTubeTimestamps,
} from '../lib/youtubeMetadataGenerator';

interface ExportKitViewProps {
  activeBrand: BrandIdentity;
}

export const ExportKitView: React.FC<ExportKitViewProps> = ({ activeBrand }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [showDayUploadModal, setShowDayUploadModal] = useState<boolean>(false);

  const currentDayStory = useMemo(() => {
    return SAMPLE_STORIES.find((s) => s.day === selectedDayNum) || SAMPLE_STORIES[0];
  }, [selectedDayNum]);

  const currentDayTitle = useMemo(() => {
    const titles = generateYouTubeTitles(currentDayStory);
    return titles[0]?.title || `Day ${currentDayStory.day}: ${currentDayStory.title}`;
  }, [currentDayStory]);

  const currentDayDescription = useMemo(() => {
    return generateYouTubeDescription(currentDayStory);
  }, [currentDayStory]);

  const currentDayTags = useMemo(() => {
    return generateYouTubeTags(currentDayStory);
  }, [currentDayStory]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadBrandJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeBrand, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `speak-in-progress-brand-package.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadWatermarkPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.translate(75, 75);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(-24, -28);
    ctx.bezierCurveTo(-24, -42, -8, -48, 8, -48);
    ctx.bezierCurveTo(24, -48, 30, -40, 30, -28);
    ctx.bezierCurveTo(30, -16, 18, -10, 2, -8);
    ctx.bezierCurveTo(-18, -6, -28, 2, -28, 18);
    ctx.bezierCurveTo(-28, 34, -14, 44, 8, 44);
    ctx.lineTo(26, 44);
    ctx.stroke();

    ctx.strokeStyle = activeBrand.colors.accent.hex;
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(26, -10);
    ctx.bezierCurveTo(42, -10, 48, 0, 48, 16);
    ctx.bezierCurveTo(48, 32, 42, 44, 26, 44);
    ctx.lineTo(-4, 44);
    ctx.stroke();

    ctx.strokeStyle = activeBrand.colors.accent.hex;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(22, -38);
    ctx.lineTo(46, -38);
    ctx.lineTo(46, -14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(46, -38);
    ctx.lineTo(20, -12);
    ctx.stroke();

    ctx.fillStyle = activeBrand.colors.accent.hex;
    ctx.beginPath();
    ctx.roundRect(-22, 24, 4, 12, 2);
    ctx.roundRect(-14, 18, 4, 18, 2);
    ctx.roundRect(-6, 12, 4, 24, 2);
    ctx.roundRect(2, 20, 4, 16, 2);
    ctx.fill();

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-watermark-150x150.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedTags = activeBrand.youtubeMeta.defaultTags.join(', ');

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header - Fully Responsive */}
      <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
              style={{
                color: activeBrand.colors.accent.hex,
                backgroundColor: `${activeBrand.colors.accent.hex}15`,
                borderColor: `${activeBrand.colors.accent.hex}35`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Handoff</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
              Speak in Progress · Export & Upload Kit
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Copy-ready descriptions, channel tags, about section text, and JSON configuration files ready for YouTube Studio whenever you publish.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
            <button
              onClick={handleDownloadWatermarkPNG}
              className="px-4 py-2.5 sm:py-3 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center justify-center gap-2"
              title="Official YouTube 150x150 Corner Watermark"
            >
              <Tv className="w-3.5 h-3.5" style={{ color: activeBrand.colors.accent.hex }} />
              <span>150×150 Watermark PNG</span>
            </button>

            <button
              onClick={handleDownloadBrandJSON}
              className="px-5 py-2.5 sm:py-3 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: '#061210',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Brand JSON</span>
            </button>
          </div>
        </div>
      </section>

      {/* Copy-Ready YouTube Metadata Pack - Responsive Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Channel Details Card */}
        <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-card-elevated">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeBrand.colors.accent.hex }}>
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Channel Identification</span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Channel Name</span>
              <button
                onClick={() => handleCopy('Speak in Progress', 'name')}
                className="text-stone-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'name' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-sm font-bold text-white shadow-badge-inset font-brand">
              Speak in Progress
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Channel Motto / Tagline</span>
              <button
                onClick={() => handleCopy(activeBrand.tagline, 'tagline')}
                className="text-stone-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'tagline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs text-stone-200 shadow-badge-inset">
              {activeBrand.tagline}
            </div>
          </div>

          {/* Primary Handle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Top Handle Recommendation</span>
              <button
                onClick={() => handleCopy(activeBrand.handleSuggestions[0], 'handle')}
                className="text-stone-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'handle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div
              className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs font-mono shadow-badge-inset font-semibold"
              style={{ color: activeBrand.colors.accent.hex }}
            >
              {activeBrand.handleSuggestions[0]}
            </div>
          </div>

          {/* Channel SEO Tags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>YouTube Channel Keyword Tags</span>
              <button
                onClick={() => handleCopy(formattedTags, 'tags')}
                className="text-stone-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="bg-stone-950/80 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs text-stone-300 font-mono leading-relaxed max-h-28 overflow-y-auto shadow-badge-inset">
              {formattedTags}
            </div>
          </div>
        </div>

        {/* Video Description Template */}
        <div className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-card-elevated flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeBrand.colors.accent.hex }}>
                <FileText className="w-4 h-4" />
                <span>Upload Defaults Description</span>
              </div>
              <button
                onClick={() => handleCopy(activeBrand.youtubeMeta.videoDescriptionTemplate, 'desc')}
                className="px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: '#061210',
                }}
              >
                {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-950" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>

            <pre className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] text-xs text-stone-300 whitespace-pre-wrap font-sans leading-relaxed max-h-[340px] overflow-y-auto shadow-badge-inset">
              {activeBrand.youtubeMeta.videoDescriptionTemplate}
            </pre>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-white/[0.06]">
            Paste this directly into <strong>YouTube Studio &gt; Settings &gt; Upload Defaults</strong>!
          </div>
        </div>
      </section>

      {/* Daily Video Title & Description Generator (Day 1 to 120) */}
      <section className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Daily Video Upload System (Day 1 to 120)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">
              Instant Title & Description Generator for YouTube Uploads
            </h3>
            <p className="text-xs text-stone-400">
              Pick any day's practice session to get a ready-to-paste Title, structured Description with timestamps and 3 key expressions, and SEO tags.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="export-day-select" className="text-xs text-stone-400 font-mono">Select Day:</label>
            <select
              id="export-day-select"
              value={selectedDayNum}
              onChange={(e) => setSelectedDayNum(Number(e.target.value))}
              className="bg-stone-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              {SAMPLE_STORIES.map((s) => (
                <option key={s.day} value={s.day}>
                  Day {s.day}: {s.title} ({s.level || 'A1'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Preview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Day Title Preview */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Day {currentDayStory.day} Video Title</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentDayTitle, 'day-title')}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'day-title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'day-title' ? 'Copied!' : 'Copy Title'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-stone-900 border border-white/5 font-mono text-xs text-stone-100 select-all leading-relaxed">
              {currentDayTitle}
            </div>
            <div className="text-[11px] text-stone-400 flex items-center justify-between">
              <span>{currentDayTitle.length} / 100 characters</span>
              <span className="text-emerald-400 font-mono font-semibold">CEFR {currentDayStory.level || 'A1'}</span>
            </div>
          </div>

          {/* Day Tags Preview */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Day {currentDayStory.day} YouTube Tags</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentDayTags, 'day-tags')}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'day-tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'day-tags' ? 'Copied!' : 'Copy Tags'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-stone-900 border border-white/5 font-mono text-xs text-stone-300 select-all leading-relaxed max-h-20 overflow-y-auto">
              {currentDayTags}
            </div>
            <div className="text-[11px] text-stone-400">
              Ready to paste directly into YouTube Studio's tag box.
            </div>
          </div>
        </div>

        {/* Day Description Preview */}
        <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Video Description (with Timestamps & 3 Expressions)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(currentDayDescription, 'day-desc')}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'day-desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'day-desc' ? 'Copied Description!' : 'Copy Description'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDayUploadModal(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Open Full Upload Kit</span>
              </button>
            </div>
          </div>

          <pre className="bg-stone-900/90 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] text-xs text-stone-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[300px] overflow-y-auto shadow-badge-inset select-all">
            {currentDayDescription}
          </pre>
        </div>
      </section>

      {/* YouTube Studio Visual Assets Pack */}
      <section className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeBrand.colors.accent.hex }}>
              <Tv className="w-4 h-4" />
              <span>Channel Branding Assets Pack</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-brand">
              Official YouTube Studio Visual Assets
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">Ready to upload</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Watermark Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:6px_6px] shrink-0"
                style={{ borderColor: `${activeBrand.colors.accent.hex}60` }}
              >
                <div className="text-[10px] font-black font-mono" style={{ color: activeBrand.colors.accent.hex }}>
                  150px
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Watermark (150×150)</div>
                <div className="text-[10px] text-stone-400 truncate">1-click subscribe corner badge</div>
              </div>
            </div>

            <button
              onClick={handleDownloadWatermarkPNG}
              className="w-full py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: '#061210',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>

          {/* 16:9 Episode Thumbnail Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center bg-stone-900 shrink-0"
                style={{ borderColor: `${activeBrand.colors.accent.hex}40` }}
              >
                <ImageIcon className="w-5 h-5" style={{ color: activeBrand.colors.accent.hex }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Thumbnail (1080p)</div>
                <div className="text-[10px] text-stone-400 truncate">High-CTR unboxed logo PNG</div>
              </div>
            </div>

            <button
              onClick={() =>
                exportThumbnailPNG(activeBrand, {
                  day: 1,
                  title: 'The Morning Routine Shift',
                  category: 'SPEAKING LAB',
                  resolution: '1080p',
                })
              }
              className="w-full py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: '#061210',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>

          {/* 3-4s Intro Video Bumper Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center bg-stone-900 shrink-0"
                style={{ borderColor: `${activeBrand.colors.accent.hex}40` }}
              >
                <Film className="w-5 h-5" style={{ color: activeBrand.colors.accent.hex }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Intro Bumper (3–4s)</div>
                <div className="text-[10px] text-stone-400 truncate">60fps with Natural Sound</div>
              </div>
            </div>

            <div className="text-[10px] text-emerald-400 font-mono text-center bg-stone-900/60 py-1 rounded-lg border border-white/5 truncate">
              Corporate FX & Cinematic · 1080p
            </div>
          </div>

          {/* JSON Config Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center bg-stone-900 shrink-0">
                <FileText className="w-5 h-5 text-stone-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Brand JSON</div>
                <div className="text-[10px] text-stone-400 truncate">Hex codes & YouTube tags</div>
              </div>
            </div>

            <button
              onClick={handleDownloadBrandJSON}
              className="w-full py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 pt-2 border-t border-white/[0.06] flex flex-wrap gap-4">
          <span>
            Upload the <strong>150×150 Watermark</strong> in <strong>YouTube Studio &gt; Customization &gt; Branding &gt; Video watermark</strong>.
          </span>
          <span>
            Drop the <strong>3–4s Video Intro</strong> at the beginning of each speaking session video before uploading.
          </span>
        </div>
      </section>

      {/* Brand Identity Summary Cheat Sheet - Responsive Grid */}
      <section className="bg-stone-900/40 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 space-y-5 shadow-card-elevated">
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: activeBrand.colors.accent.hex }}>
          Speak in Progress · Brand Quick Sheet
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 text-xs">
          <div className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] space-y-1 shadow-sm">
            <span className="text-stone-500 font-mono uppercase text-[10px]">Primary Ground</span>
            <div className="text-white font-bold">{activeBrand.colors.primary.hex}</div>
            <div className="text-stone-400 text-[11px]">{activeBrand.colors.primary.name}</div>
          </div>

          <div className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] space-y-1 shadow-sm">
            <span className="text-stone-500 font-mono uppercase text-[10px]">Accent Energy</span>
            <div className="font-bold" style={{ color: activeBrand.colors.accent.hex }}>{activeBrand.colors.accent.hex}</div>
            <div className="text-stone-400 text-[11px]">{activeBrand.colors.accent.name}</div>
          </div>

          <div className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] space-y-1 shadow-sm">
            <span className="text-stone-500 font-mono uppercase text-[10px]">Headline Typography</span>
            <div className="text-white font-bold">{activeBrand.typography.displayFont}</div>
            <div className="text-stone-400 text-[11px]">Weight: ExtraBold / 800</div>
          </div>

          <div className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/[0.06] space-y-1 shadow-sm">
            <span className="text-stone-500 font-mono uppercase text-[10px]">Prompter Reading Font</span>
            <div className="text-white font-bold">{activeBrand.typography.bodyFont}</div>
            <div className="text-stone-400 text-[11px]">High Contrast Readability</div>
          </div>
        </div>
      </section>

      {/* YouTube Video Metadata & Description Upload Kit Modal */}
      {showDayUploadModal && (
        <YouTubeVideoMetadataModal
          isOpen={showDayUploadModal}
          onClose={() => setShowDayUploadModal(false)}
          activeStory={currentDayStory}
          allStories={SAMPLE_STORIES}
          onSelectStory={(s) => setSelectedDayNum(s.day)}
          activeBrand={activeBrand}
        />
      )}
    </div>
  );
};
