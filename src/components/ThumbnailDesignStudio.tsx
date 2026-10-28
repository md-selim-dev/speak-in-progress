/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import {
  Download,
  Copy,
  Check,
  Eye,
  Sparkles,
  Sliders,
  Layers,
  Image as ImageIcon,
  Monitor,
  Maximize2,
  Tv,
  Music,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ThumbnailDesignStudioProps {
  activeBrand: BrandIdentity;
}

export type ThumbnailTheme = 'obsidian-emerald' | 'acoustic-waveform' | 'high-contrast-split' | 'midnight-neon';
export type LogoPlacement = 'top-right' | 'top-left' | 'bottom-left' | 'badge-integrated';
export type ThumbnailResolution = '1080p' | '720p' | '1440p';

const TOPIC_PRESETS = [
  {
    day: 1,
    title: 'The Morning Routine Shift',
    highlightWord: 'Routine Shift',
    category: 'SPEAKING LAB',
    hook: '“PROGRESS, NOT PERFECTION” · RETELLING',
    theme: 'obsidian-emerald' as ThumbnailTheme,
  },
  {
    day: 7,
    title: 'Stop Translating In Your Head',
    highlightWord: 'Translating',
    category: 'FLUENCY DRILL',
    hook: 'HOW TO THINK DIRECTLY IN ENGLISH',
    theme: 'acoustic-waveform' as ThumbnailTheme,
  },
  {
    day: 14,
    title: 'Speaking Without Hesitation',
    highlightWord: 'Without Hesitation',
    category: 'UNSCRIPTED PRACTICE',
    hook: 'FACELESS AUDIO DRILL · DAILY LOG',
    theme: 'high-contrast-split' as ThumbnailTheme,
  },
  {
    day: 30,
    title: 'The Retelling Breakthrough',
    highlightWord: 'Breakthrough',
    category: 'MILESTONE RECORDING',
    hook: '30-DAY CONTINUOUS SPOKEN PRACTICE',
    theme: 'midnight-neon' as ThumbnailTheme,
  },
];

export const ThumbnailDesignStudio: React.FC<ThumbnailDesignStudioProps> = ({ activeBrand }) => {
  const [day, setDay] = useState<number>(1);
  const [category, setCategory] = useState<string>('SPEAKING LAB');
  const [headline, setHeadline] = useState<string>('The Morning Routine Shift');
  const [highlightWord, setHighlightWord] = useState<string>('Routine Shift');
  const [hookText, setHookText] = useState<string>('“PROGRESS, NOT PERFECTION” · RETELLING');
  const [channelLabel, setChannelLabel] = useState<string>('SPEAK IN PROGRESS');
  const [theme, setTheme] = useState<ThumbnailTheme>('obsidian-emerald');
  const [accentColor, setAccentColor] = useState<string>(activeBrand.colors.accent.hex || '#10B981');
  const [logoPlacement, setLogoPlacement] = useState<LogoPlacement>('top-right');
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [logoStyle, setLogoStyle] = useState<'monogram' | 'badge'>('monogram');
  const [showWaveform, setShowWaveform] = useState<boolean>(true);
  const [showYouTubeOverlay, setShowYouTubeOverlay] = useState<boolean>(false);
  const [resolution, setResolution] = useState<ThumbnailResolution>('1080p');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync brand accent
  useEffect(() => {
    if (activeBrand.colors?.accent?.hex) {
      setAccentColor(activeBrand.colors.accent.hex);
    }
  }, [activeBrand]);

  const handleApplyPreset = (p: typeof TOPIC_PRESETS[0]) => {
    setDay(p.day);
    setHeadline(p.title);
    setHighlightWord(p.highlightWord);
    setCategory(p.category);
    setHookText(p.hook);
    setTheme(p.theme);
  };

  // Helper to draw standalone unboxed LogoMark on Canvas
  const drawVectorLogo = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    accent: string
  ) => {
    ctx.save();
    const scale = size / 100;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Subtle drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Linear gradient for P
    const grad = ctx.createLinearGradient(0, 0, 100, 100);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.4, accent);
    grad.addColorStop(1, accent);

    // S Path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(30, 32);
    ctx.bezierCurveTo(30, 25.3726, 35.3726, 20, 42, 20);
    ctx.lineTo(56, 20);
    ctx.bezierCurveTo(62.6274, 20, 68, 25.3726, 68, 32);
    ctx.bezierCurveTo(68, 38.6274, 62.6274, 44, 56, 44);
    ctx.lineTo(42, 44);
    ctx.bezierCurveTo(35.3726, 44, 30, 49.3726, 30, 56);
    ctx.bezierCurveTo(30, 62.6274, 35.3726, 68, 42, 68);
    ctx.lineTo(56, 68);
    ctx.stroke();

    // P Path
    ctx.strokeStyle = grad;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(44, 44);
    ctx.lineTo(64, 44);
    ctx.bezierCurveTo(71.732, 44, 78, 50.268, 78, 58);
    ctx.bezierCurveTo(78, 65.732, 71.732, 72, 64, 72);
    ctx.lineTo(46, 72);
    ctx.stroke();

    // Momentum Arrow
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(62, 20);
    ctx.lineTo(78, 20);
    ctx.lineTo(78, 36);
    ctx.moveTo(78, 20);
    ctx.lineTo(60, 38);
    ctx.stroke();

    // Waveform bars
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(36, 48, 3.5, 10, 1.75);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(43, 44, 3.5, 18, 1.75);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(50, 40, 3.5, 26, 1.75);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(57, 46, 3.5, 14, 1.75);
    ctx.fill();

    // Origin dot
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(70, 27, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // High-Resolution 16:9 Canvas Generator
  const generateCanvas = (targetRes: ThumbnailResolution): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    let W = 1920;
    let H = 1080;
    if (targetRes === '720p') {
      W = 1280;
      H = 720;
    } else if (targetRes === '1440p') {
      W = 2560;
      H = 1440;
    }
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const scale = W / 1920;

    // --- 1. Background Layers ---
    if (theme === 'obsidian-emerald') {
      // Obsidian Emerald Studio
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#030B09');
      bgGrad.addColorStop(0.5, '#071813');
      bgGrad.addColorStop(1, '#020705');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Radial bloom behind headline
      const radial = ctx.createRadialGradient(W * 0.35, H * 0.45, 50 * scale, W * 0.35, H * 0.45, 750 * scale);
      radial.addColorStop(0, `${accentColor}38`);
      radial.addColorStop(0.6, `${accentColor}0A`);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
    } else if (theme === 'acoustic-waveform') {
      // Acoustic Soundwave Studio
      ctx.fillStyle = '#060B12';
      ctx.fillRect(0, 0, W, H);

      const radial = ctx.createRadialGradient(W * 0.7, H * 0.5, 80 * scale, W * 0.7, H * 0.5, 900 * scale);
      radial.addColorStop(0, `${accentColor}33`);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
    } else if (theme === 'high-contrast-split') {
      // Bold Split Focus
      const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
      bgGrad.addColorStop(0, '#05120E');
      bgGrad.addColorStop(0.65, '#0A1C16');
      bgGrad.addColorStop(1, '#040807');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Angled accent streak
      ctx.fillStyle = `${accentColor}1A`;
      ctx.beginPath();
      ctx.moveTo(W * 0.6, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W * 0.85, H);
      ctx.lineTo(W * 0.45, H);
      ctx.closePath();
      ctx.fill();
    } else {
      // Midnight Neon
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, W, H);

      const radial = ctx.createRadialGradient(W * 0.5, H * 0.5, 100 * scale, W * 0.5, H * 0.5, 800 * scale);
      radial.addColorStop(0, `${accentColor}25`);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);
    }

    // Grid texture overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1 * scale;
    const gridStep = 60 * scale;
    for (let x = 0; x < W; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // --- 2. Acoustic Speech Waveform Visualizer in Background ---
    if (showWaveform) {
      const waveBarCount = 42;
      const waveWidth = 8 * scale;
      const waveGap = 10 * scale;
      const waveStartX = W - (waveBarCount * (waveWidth + waveGap)) - 100 * scale;
      const waveCenterY = H * 0.5;

      const heights = [
        30, 45, 60, 95, 140, 210, 320, 260, 180, 120, 90, 160, 280, 390, 460, 340, 220, 170, 250, 380, 420, 310, 190,
        140, 210, 290, 360, 250, 180, 130, 90, 150, 220, 290, 180, 120, 80, 50, 35, 25, 20, 15,
      ];

      ctx.save();
      heights.forEach((h, idx) => {
        const bx = waveStartX + idx * (waveWidth + waveGap);
        const bh = (h * 0.9) * scale;
        const by = waveCenterY - bh / 2;

        const isPeak = h > 250;
        ctx.fillStyle = isPeak ? `${accentColor}55` : 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(bx, by, waveWidth, bh, 4 * scale);
        ctx.fill();
      });
      ctx.restore();
    }

    // --- 3. Outer Aesthetic Glow Border ---
    ctx.strokeStyle = `${accentColor}66`;
    ctx.lineWidth = 6 * scale;
    ctx.strokeRect(3 * scale, 3 * scale, W - 6 * scale, H - 6 * scale);

    // Inner subtle hairline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(18 * scale, 18 * scale, W - 36 * scale, H - 36 * scale);

    // --- 4. Brand Logo Integration ---
    if (showLogo) {
      const logoPixelSize = 104 * scale;

      if (logoPlacement === 'top-right') {
        const logoX = W - logoPixelSize - 80 * scale;
        const logoY = 70 * scale;

        if (logoStyle === 'badge') {
          // Glassmorphic Obsidian Pill Badge
          const badgeW = 270 * scale;
          const badgeH = 82 * scale;
          const badgeX = W - badgeW - 70 * scale;
          const badgeY = 65 * scale;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 20 * scale;
          ctx.fillStyle = 'rgba(6, 18, 14, 0.88)';
          ctx.strokeStyle = `${accentColor}44`;
          ctx.lineWidth = 1.5 * scale;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 20 * scale);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          drawVectorLogo(ctx, badgeX + 16 * scale, badgeY + 11 * scale, 60 * scale, accentColor);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = `900 ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText('SPEAK IN', badgeX + 84 * scale, badgeY + 38 * scale);

          ctx.fillStyle = accentColor;
          ctx.font = `900 ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText('PROGRESS', badgeX + 84 * scale, badgeY + 62 * scale);
        } else {
          // Standalone unboxed floating logo with subtle glow
          ctx.save();
          const radialGlow = ctx.createRadialGradient(
            logoX + logoPixelSize / 2,
            logoY + logoPixelSize / 2,
            10 * scale,
            logoX + logoPixelSize / 2,
            logoY + logoPixelSize / 2,
            80 * scale
          );
          radialGlow.addColorStop(0, `${accentColor}33`);
          radialGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = radialGlow;
          ctx.beginPath();
          ctx.arc(logoX + logoPixelSize / 2, logoY + logoPixelSize / 2, 80 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          drawVectorLogo(ctx, logoX, logoY, logoPixelSize, accentColor);
        }
      } else if (logoPlacement === 'top-left') {
        const logoX = 90 * scale;
        const logoY = 70 * scale;
        drawVectorLogo(ctx, logoX, logoY, 92 * scale, accentColor);
      } else if (logoPlacement === 'bottom-left') {
        const logoX = 90 * scale;
        const logoY = H - 160 * scale;
        drawVectorLogo(ctx, logoX, logoY, 80 * scale, accentColor);
      }
    }

    // --- 5. Day & Category Badge ---
    const badgeX = logoPlacement === 'top-left' ? 210 * scale : 90 * scale;
    const badgeY = 75 * scale;
    const badgeH = 64 * scale;
    const dayStr = day < 10 ? `DAY 0${day}` : `DAY ${day}`;
    const badgeFullText = `${dayStr}  ·  ${category.toUpperCase()}`;

    // Measure text for adaptive pill width
    ctx.font = `900 ${24 * scale}px "JetBrains Mono", monospace`;
    const textWidth = ctx.measureText(badgeFullText).width;
    const badgeW = textWidth + 50 * scale;

    ctx.save();
    // High-contrast filled badge in Emerald Spark
    ctx.fillStyle = accentColor;
    ctx.shadowColor = `${accentColor}66`;
    ctx.shadowBlur = 24 * scale;
    ctx.shadowOffsetY = 4 * scale;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16 * scale);
    ctx.fill();

    ctx.fillStyle = '#04120D';
    ctx.font = `900 ${24 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(badgeFullText, badgeX + 25 * scale, badgeY + 41 * scale);
    ctx.restore();

    // --- 6. Main Headline (Multi-line + Highlight Word) ---
    const headlineStartX = 90 * scale;
    let headlineY = 320 * scale;

    ctx.save();
    ctx.font = `900 ${94 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'left';

    // Multi-layer drop shadow for maximum punchy CTR readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 28 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6 * scale;

    // Word wrapping and highlighting
    const words = headline.split(' ');
    let currentLine = '';
    const lines: string[] = [];
    words.forEach((w) => {
      const test = currentLine ? `${currentLine} ${w}` : w;
      if (test.length < 18) {
        currentLine = test;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = w;
      }
    });
    if (currentLine) lines.push(currentLine);

    lines.forEach((lineText, lIdx) => {
      const lineY = headlineY + lIdx * 115 * scale;

      // Check if highlightWord is part of this line
      if (highlightWord && lineText.toLowerCase().includes(highlightWord.toLowerCase())) {
        // Render word by word to colorize the highlighted word in Emerald Spark
        const lineWords = lineText.split(' ');
        let wordX = headlineStartX;

        lineWords.forEach((word) => {
          const isHighlight =
            word.toLowerCase().includes(highlightWord.toLowerCase()) ||
            highlightWord.toLowerCase().includes(word.toLowerCase());

          ctx.fillStyle = isHighlight ? accentColor : '#FFFFFF';
          ctx.fillText(word, wordX, lineY);
          const wMetrics = ctx.measureText(word + ' ');
          wordX += wMetrics.width;
        });
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(lineText, headlineStartX, lineY);
      }
    });
    ctx.restore();

    // --- 7. Hook Sub-title & Core Motto ---
    const hookY = headlineY + lines.length * 115 * scale + 35 * scale;

    ctx.save();
    ctx.fillStyle = accentColor;
    ctx.font = `800 ${34 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12 * scale;
    ctx.fillText(hookText, headlineStartX, hookY);
    ctx.restore();

    // --- 8. Bottom Channel Authority Bar ---
    const barY = H - 140 * scale;
    const barH = 82 * scale;
    const barW = W - 180 * scale;

    ctx.save();
    ctx.fillStyle = 'rgba(5, 15, 12, 0.88)';
    ctx.strokeStyle = `${accentColor}33`;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.roundRect(headlineStartX, barY, barW, barH, 20 * scale);
    ctx.fill();
    ctx.stroke();

    // Left: Brand Name
    const brandX = headlineStartX + 30 * scale;
    const textBaselineY = barY + 50 * scale;

    const brandFont = `900 ${28 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = brandFont;
    ctx.textAlign = 'left';
    ctx.fillText(channelLabel, brandX, textBaselineY);

    // Measure brand label width while its exact font is applied to prevent any text overlap
    const labelWidth = ctx.measureText(channelLabel).width;

    // Left Sub: Spoken English Practice with clean gap
    const sublineX = brandX + labelWidth + 24 * scale;
    ctx.fillStyle = '#94A3B8';
    ctx.font = `600 ${20 * scale}px "DM Sans", sans-serif`;
    ctx.fillText('·  Spoken English Journey', sublineX, textBaselineY);

    // Right: Format Spec (NO resolution size value shown)
    ctx.fillStyle = `${accentColor}DD`;
    ctx.font = `800 ${20 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('UNSCRIPTED RETELLINGS · DAILY PRACTICE', headlineStartX + barW - 30 * scale, textBaselineY);
    ctx.restore();

    return canvas;
  };

  // Download Handler
  const handleDownload = async (targetRes: ThumbnailResolution) => {
    setIsExporting(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const canvas = generateCanvas(targetRes);
      if (!canvas) return;

      const url = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = url;
      const resName = targetRes === '1440p' ? '2560x1440-2K' : targetRes === '1080p' ? '1920x1080-FHD' : '1280x720-HD';
      link.download = `speak-in-progress-thumbnail-day-${day}-${resName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(`Downloaded ${resName} PNG`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard Handler
  const handleCopyToClipboard = async () => {
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const canvas = generateCanvas('1080p');
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2500);
        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }
      }, 'image/png', 1.0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Studio Header Banner */}
      <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-card-elevated backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Quality Packaging</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
              16:9 YouTube Thumbnail Studio
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Design high-CTR, click-worthy video thumbnails featuring your unboxed Speak in Progress logo in Emerald Spark, bold typography, soundwave audio accents, and uncompressed export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center justify-center gap-2"
              title="Copy high-res image directly to clipboard"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload(resolution)}
              disabled={isExporting}
              className="px-5 py-2.5 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              style={{
                backgroundColor: accentColor,
                color: '#04120D',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isExporting ? 'Generating...' : `Export ${resolution.toUpperCase()} PNG`}
              </span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{downloadSuccess} ready! Upload directly into YouTube Studio.</span>
          </div>
        )}
      </section>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 space-y-3.5 shadow-card-elevated">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-Click Practice Presets</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">Instant Style</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TOPIC_PRESETS.map((p) => (
                <button
                  key={p.day}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl border border-white/10 bg-stone-950/80 hover:bg-stone-800/80 text-left transition-all text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-emerald-400">DAY {p.day < 10 ? `0${p.day}` : p.day}</span>
                    <span className="text-[9px] text-stone-400">{p.category.split(' ')[0]}</span>
                  </div>
                  <div className="font-bold text-white text-[11px] truncate group-hover:text-emerald-300">
                    {p.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Content Form */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>Typography & Content</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  Day / Session #
                </label>
                <input
                  type="number"
                  min="1"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  placeholder="SPEAKING LAB"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                Main Story Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-bold focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                placeholder="The Morning Routine Shift"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1 flex items-center justify-between">
                <span>Highlight Accent Phrase</span>
                <span className="text-[10px] text-emerald-400 font-normal">Glows in Emerald Spark</span>
              </label>
              <input
                type="text"
                value={highlightWord}
                onChange={(e) => setHighlightWord(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                placeholder="Routine Shift"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">
                Hook Subtitle / Motto
              </label>
              <input
                type="text"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                placeholder="“PROGRESS, NOT PERFECTION” · RETELLING"
              />
            </div>
          </div>

          {/* Logo Integration & Visual Settings */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Logo & Branding Controls</span>
              </span>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="rounded border-stone-700 text-emerald-500 focus:ring-emerald-400"
                />
                <span className="text-stone-300 font-semibold">Include Logo</span>
              </label>
            </div>

            {showLogo && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1.5">
                    Logo Placement
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'top-right', label: 'Top-Right (Safe)' },
                      { id: 'top-left', label: 'Top-Left' },
                      { id: 'bottom-left', label: 'Bottom-Left' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setLogoPlacement(p.id as any)}
                        className={`px-3 py-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                          logoPlacement === p.id
                            ? 'bg-stone-800 text-white border-emerald-400/60 shadow-sm'
                            : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">
                    ✓ Top-right avoids YouTube's timestamp badge in the bottom-right corner.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1.5">
                    Logo Presentation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setLogoStyle('monogram')}
                      className={`px-3 py-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        logoStyle === 'monogram'
                          ? 'bg-stone-800 text-white border-emerald-400/60 shadow-sm'
                          : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Monogram (Unboxed)
                    </button>
                    <button
                      onClick={() => setLogoStyle('badge')}
                      className={`px-3 py-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                        logoStyle === 'badge'
                          ? 'bg-stone-800 text-white border-emerald-400/60 shadow-sm'
                          : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Pill Capsule Badge
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Aesthetic Theme */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <label className="block text-[11px] font-semibold text-stone-400 uppercase">
                Aesthetic Background Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'obsidian-emerald', label: 'Obsidian Emerald' },
                  { id: 'acoustic-waveform', label: 'Acoustic Waves' },
                  { id: 'high-contrast-split', label: 'High Contrast Split' },
                  { id: 'midnight-neon', label: 'Midnight Neon' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as any)}
                    className={`px-3 py-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                      theme === th.id
                        ? 'bg-stone-800 text-white border-emerald-400/60 shadow-sm'
                        : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Waveform Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-stone-300 font-semibold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Soundwave Audio Visualizer</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWaveform}
                  onChange={(e) => setShowWaveform(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Export Quality Selection */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 space-y-3 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center justify-between">
              <span>Export Resolution</span>
              <span className="text-[10px] font-mono text-emerald-400">PNG Format</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1080p', label: '1080p Full HD', desc: '1920×1080 (Best CTR)' },
                { id: '720p', label: '720p Standard', desc: '1280×720 (Standard)' },
                { id: '1440p', label: '1440p 2K QHD', desc: '2560×1440 (Retina)' },
              ].map((res) => (
                <button
                  key={res.id}
                  onClick={() => setResolution(res.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    resolution === res.id
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{res.label.split(' ')[0]}</div>
                  <div className="text-[9px] text-stone-400 mt-0.5">{res.desc.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Live 16:9 Canvas Preview</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-800 text-emerald-300 border border-emerald-500/30">
                {resolution === '1440p' ? '2560×1440' : resolution === '1080p' ? '1920×1080' : '1280×720'}
              </span>
            </div>

            <button
              onClick={() => setShowYouTubeOverlay(!showYouTubeOverlay)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                showYouTubeOverlay
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
                  : 'bg-stone-800 text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{showYouTubeOverlay ? 'Hide YouTube UI' : 'Simulate YouTube UI'}</span>
            </button>
          </div>

          {/* 16:9 Canvas Viewport */}
          <div
            className="w-full aspect-video rounded-2xl sm:rounded-3xl border-4 relative overflow-hidden flex flex-col justify-between p-5 sm:p-8 select-none transition-all shadow-2xl group"
            style={{
              backgroundColor: '#030B09',
              borderColor: `${accentColor}88`,
              boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px ${accentColor}25`,
            }}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-12 -left-12 w-[350px] h-[350px] rounded-full blur-[100px] opacity-25 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            {/* Subtle Soundwave Visualizer in Background */}
            {showWaveform && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-20 pointer-events-none h-48">
                {[20, 35, 55, 80, 120, 90, 60, 40, 75, 110, 140, 100, 70, 50, 85, 130, 95, 60, 40, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{
                      height: `${h * 1.1}%`,
                      backgroundColor: i % 3 === 0 ? accentColor : '#FFFFFF',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Top Bar: Badge & Logo */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              {/* Day & Category Badge */}
              <div
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-mono font-black shadow-lg flex items-center gap-2"
                style={{
                  backgroundColor: accentColor,
                  color: '#04120D',
                }}
              >
                <span>DAY {day < 10 ? `0${day}` : day}</span>
                <span className="opacity-60">·</span>
                <span className="tracking-wider">{category.toUpperCase()}</span>
              </div>

              {/* Logo in Top-Right */}
              {showLogo && logoPlacement === 'top-right' && (
                <div>
                  {logoStyle === 'badge' ? (
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-stone-950/90 border border-white/10 shadow-xl backdrop-blur-md">
                      <LogoMark brand={activeBrand} size="sm" layout="icon-only" accentColor={accentColor} />
                      <div className="text-left font-brand text-[11px] leading-tight font-extrabold">
                        <div className="text-white">SPEAK IN</div>
                        <div style={{ color: accentColor }}>PROGRESS</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-1 rounded-2xl bg-stone-950/40 backdrop-blur-sm border border-white/5">
                      <LogoMark brand={activeBrand} size="md" layout="icon-only" accentColor={accentColor} isAnimated={false} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Central Headline */}
            <div className="relative z-10 space-y-2 my-auto max-w-2xl">
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08] uppercase font-brand drop-shadow-xl">
                {headline.split(' ').map((word, i) => {
                  const isHighlighted =
                    highlightWord &&
                    (word.toLowerCase().includes(highlightWord.toLowerCase()) ||
                      highlightWord.toLowerCase().includes(word.toLowerCase()));

                  return (
                    <span
                      key={i}
                      style={{
                        color: isHighlighted ? accentColor : '#FFFFFF',
                        textShadow: isHighlighted ? `0 0 25px ${accentColor}88` : undefined,
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </h3>

              <p
                className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide drop-shadow"
                style={{ color: accentColor }}
              >
                {hookText}
              </p>
            </div>

            {/* Bottom Bar Lockup */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-xs bg-stone-950/60 -mx-5 sm:-mx-8 -mb-5 sm:-mb-8 px-5 sm:px-8 py-3 rounded-b-2xl">
              <div className="flex items-center gap-2">
                {showLogo && logoPlacement === 'bottom-left' && (
                  <LogoMark brand={activeBrand} size="xs" layout="icon-only" accentColor={accentColor} />
                )}
                <span className="font-black text-white tracking-wider font-brand text-xs sm:text-sm">
                  {channelLabel}
                </span>
                <span className="text-stone-400 text-xs hidden sm:inline">· Spoken English Journey</span>
              </div>

              <div className="font-mono text-[10px] sm:text-xs text-stone-400">
                <span style={{ color: accentColor }}>AUDIO DRILL</span> · DAILY PRACTICE
              </div>
            </div>

            {/* YouTube Player Simulation Overlay */}
            {showYouTubeOverlay && (
              <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-4">
                <div className="flex items-center justify-between text-white text-[10px] sm:text-xs font-sans drop-shadow-md">
                  <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur">▶ YouTube Player Preview</span>
                  <span className="bg-red-600/90 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">LIVE FEED</span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="bg-black/80 text-[10px] px-2 py-0.5 rounded text-white font-mono">
                    Channel: @SpeakInProgress
                  </div>
                  {/* Standard YouTube Video Duration Tag in bottom right */}
                  <div className="bg-black/90 text-white font-mono font-bold text-xs px-2 py-0.5 rounded shadow-lg border border-white/10">
                    14:28
                  </div>
                </div>

                {/* Simulated Red Progress Bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800">
                  <div className="h-full bg-red-600 w-1/3" />
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/60 border border-white/[0.08] p-4 rounded-2xl">
            <div className="text-xs text-stone-300">
              Generated in <strong>{resolution === '1440p' ? '2560×1440' : resolution === '1080p' ? '1920×1080' : '1280×720'}</strong> with uncompressed PNG crispness.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSuccess ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDownload(resolution)}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-extrabold rounded-xl shadow-modern-glow transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                style={{
                  backgroundColor: accentColor,
                  color: '#04120D',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {resolution.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Standalone High-Resolution Thumbnail PNG Exporter for other views (e.g. Export Kit)
export const exportThumbnailPNG = (
  brand: BrandIdentity,
  options?: {
    day?: number;
    title?: string;
    category?: string;
    hook?: string;
    resolution?: '1080p' | '720p' | '1440p';
  }
) => {
  const day = options?.day || 1;
  const title = options?.title || 'The Morning Routine Shift';
  const category = options?.category || 'SPEAKING LAB';
  const hook = options?.hook || '“PROGRESS, NOT PERFECTION” · RETELLING';
  const targetRes = options?.resolution || '1080p';
  const accent = brand.colors.accent.hex || '#10B981';

  const canvas = document.createElement('canvas');
  let W = 1920;
  let H = 1080;
  if (targetRes === '720p') {
    W = 1280;
    H = 720;
  } else if (targetRes === '1440p') {
    W = 2560;
    H = 1440;
  }
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scale = W / 1920;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#030B09');
  bgGrad.addColorStop(0.5, '#071813');
  bgGrad.addColorStop(1, '#020705');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Radial bloom
  const radial = ctx.createRadialGradient(W * 0.35, H * 0.45, 50 * scale, W * 0.35, H * 0.45, 750 * scale);
  radial.addColorStop(0, `${accent}38`);
  radial.addColorStop(0.6, `${accent}0A`);
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, W, H);

  // Outer border with accent
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 6 * scale;
  ctx.strokeRect(3 * scale, 3 * scale, W - 6 * scale, H - 6 * scale);

  // Draw Logo in top right
  const logoPixelSize = 104 * scale;
  const logoX = W - logoPixelSize - 80 * scale;
  const logoY = 70 * scale;
  ctx.save();
  const scaleLogo = logoPixelSize / 100;
  ctx.translate(logoX, logoY);
  ctx.scale(scaleLogo, scaleLogo);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  const grad = ctx.createLinearGradient(0, 0, 100, 100);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.4, accent);
  grad.addColorStop(1, accent);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(30, 32);
  ctx.bezierCurveTo(30, 25.3726, 35.3726, 20, 42, 20);
  ctx.lineTo(56, 20);
  ctx.bezierCurveTo(62.6274, 20, 68, 25.3726, 68, 32);
  ctx.bezierCurveTo(68, 38.6274, 62.6274, 44, 56, 44);
  ctx.lineTo(42, 44);
  ctx.bezierCurveTo(35.3726, 44, 30, 49.3726, 30, 56);
  ctx.bezierCurveTo(30, 62.6274, 35.3726, 68, 42, 68);
  ctx.lineTo(56, 68);
  ctx.stroke();

  ctx.strokeStyle = grad;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(44, 44);
  ctx.lineTo(64, 44);
  ctx.bezierCurveTo(71.732, 44, 78, 50.268, 78, 58);
  ctx.bezierCurveTo(78, 65.732, 71.732, 72, 64, 72);
  ctx.lineTo(46, 72);
  ctx.stroke();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(62, 20);
  ctx.lineTo(78, 20);
  ctx.lineTo(78, 36);
  ctx.moveTo(78, 20);
  ctx.lineTo(60, 38);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(36, 48, 3.5, 10, 1.75);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(43, 44, 3.5, 18, 1.75);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(50, 40, 3.5, 26, 1.75);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(57, 46, 3.5, 14, 1.75);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(70, 27, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Day Badge
  const badgeX = 90 * scale;
  const badgeY = 75 * scale;
  const badgeH = 64 * scale;
  const dayStr = day < 10 ? `DAY 0${day}` : `DAY ${day}`;
  const badgeFullText = `${dayStr}  ·  ${category.toUpperCase()}`;
  ctx.font = `900 ${24 * scale}px "JetBrains Mono", monospace`;
  const textWidth = ctx.measureText(badgeFullText).width;
  const badgeW = textWidth + 50 * scale;

  ctx.save();
  ctx.fillStyle = accent;
  ctx.shadowColor = `${accent}66`;
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 4 * scale;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16 * scale);
  ctx.fill();

  ctx.fillStyle = '#04120D';
  ctx.fillText(badgeFullText, badgeX + 25 * scale, badgeY + 41 * scale);
  ctx.restore();

  // Headline
  ctx.save();
  ctx.font = `900 ${94 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 28 * scale;
  ctx.shadowOffsetY = 6 * scale;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title, 90 * scale, 340 * scale);
  ctx.restore();

  // Hook Motto
  ctx.save();
  ctx.fillStyle = accent;
  ctx.font = `800 ${34 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(hook, 90 * scale, 450 * scale);
  ctx.restore();

  // Bottom Channel Bar
  const barY = H - 140 * scale;
  const barH = 82 * scale;
  const barW = W - 180 * scale;
  ctx.save();
  ctx.fillStyle = 'rgba(5, 15, 12, 0.88)';
  ctx.strokeStyle = `${accent}33`;
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.roundRect(90 * scale, barY, barW, barH, 20 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${28 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('SPEAK IN PROGRESS', 120 * scale, barY + 50 * scale);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `500 ${22 * scale}px "DM Sans", sans-serif`;
  ctx.fillText('·  Spoken English Journey', 440 * scale, barY + 50 * scale);

  ctx.fillStyle = `${accent}CC`;
  ctx.font = `800 ${20 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('UNSCRIPTED RETELLINGS · 1080P', 90 * scale + barW - 30 * scale, barY + 50 * scale);
  ctx.restore();

  const url = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.href = url;
  link.download = `speak-in-progress-thumbnail-day-${day}-${targetRes}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
