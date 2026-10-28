/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandIdentity } from '../types';
import { Copy, Check, Download, FileText, Youtube, Sparkles, Tv, ExternalLink } from 'lucide-react';

interface ExportKitViewProps {
  activeBrand: BrandIdentity;
}

export const ExportKitView: React.FC<ExportKitViewProps> = ({ activeBrand }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Watermark Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-12 h-12 rounded-xl border flex items-center justify-center bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:6px_6px] shrink-0"
                style={{ borderColor: `${activeBrand.colors.accent.hex}60` }}
              >
                <div className="text-[10px] font-black font-mono" style={{ color: activeBrand.colors.accent.hex }}>
                  150px
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white">Video Watermark (150×150)</div>
                <div className="text-xs text-stone-400">Bottom-right corner 1-click subscribe badge</div>
              </div>
            </div>

            <button
              onClick={handleDownloadWatermarkPNG}
              className="px-3.5 py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                color: '#061210',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          {/* JSON Config Item */}
          <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-stone-900 shrink-0">
                <FileText className="w-5 h-5 text-stone-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white">Brand JSON Package</div>
                <div className="text-xs text-stone-400">Complete color codes, typography & tags</div>
              </div>
            </div>

            <button
              onClick={handleDownloadBrandJSON}
              className="px-3.5 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-white/10 rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 pt-2 border-t border-white/[0.06]">
          Upload the <strong>150×150 Watermark</strong> in <strong>YouTube Studio &gt; Customization &gt; Branding &gt; Video watermark</strong>!
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
    </div>
  );
};
