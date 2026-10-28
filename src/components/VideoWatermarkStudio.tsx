/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { BrandIdentity } from '../types';
import {
  Download,
  Copy,
  Check,
  Eye,
  Sliders,
  Tv,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Play,
  RotateCcw,
} from 'lucide-react';

interface VideoWatermarkStudioProps {
  activeBrand: BrandIdentity;
}

export type WatermarkStyle = 'transparent-monogram' | 'subscribe-action' | 'obsidian-badge' | 'soundwave-progress';
export type BackgroundMode = 'transparent' | 'obsidian' | 'charcoal' | 'white';

export const VideoWatermarkStudio: React.FC<VideoWatermarkStudioProps> = ({ activeBrand }) => {
  const [selectedStyle, setSelectedStyle] = useState<WatermarkStyle>('transparent-monogram');
  const [bgMode, setBgMode] = useState<BackgroundMode>('transparent');
  const [accentColor, setAccentColor] = useState<string>(activeBrand.colors.accent.hex);
  const [badgeShape, setBadgeShape] = useState<'rounded' | 'circle' | 'square'>('rounded');
  const [calloutText, setCalloutText] = useState<string>('SUBSCRIBE');
  const [showGlow, setShowGlow] = useState<boolean>(true);
  const [isHoveredInPlayer, setIsHoveredInPlayer] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync accent color with brand change
  useEffect(() => {
    setAccentColor(activeBrand.colors.accent.hex);
  }, [activeBrand]);

  // Canvas renderer helper for 150x150 or 300x300
  const renderWatermarkOnCanvas = (canvas: HTMLCanvasElement, size: number = 150) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const scale = size / 150;

    // Background rendering
    if (bgMode !== 'transparent') {
      const radius = badgeShape === 'circle' ? size / 2 : badgeShape === 'rounded' ? 24 * scale : 0;
      ctx.save();
      ctx.beginPath();
      if (badgeShape === 'circle') {
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      } else if (badgeShape === 'rounded') {
        ctx.roundRect(2, 2, size - 4, size - 4, radius);
      } else {
        ctx.rect(2, 2, size - 4, size - 4);
      }

      if (bgMode === 'obsidian') {
        ctx.fillStyle = '#061411';
      } else if (bgMode === 'charcoal') {
        ctx.fillStyle = '#18181B';
      } else if (bgMode === 'white') {
        ctx.fillStyle = '#FFFFFF';
      }
      ctx.fill();

      // Glowing outer rim if enabled
      if (showGlow) {
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5 * scale;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Now render according to selected style
    if (selectedStyle === 'transparent-monogram') {
      // 1. Transparent Monogram: Interlocking S-P with Ascending Momentum
      ctx.save();
      ctx.translate(size / 2, size / 2);

      // Subtle drop shadow for readability on transparent background
      if (bgMode === 'transparent') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 6 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2 * scale;
      }

      // S progress curve (white)
      ctx.strokeStyle = bgMode === 'white' ? '#061411' : '#FFFFFF';
      ctx.lineWidth = 10 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(-24 * scale, -28 * scale);
      ctx.bezierCurveTo(-24 * scale, -42 * scale, -8 * scale, -48 * scale, 8 * scale, -48 * scale);
      ctx.bezierCurveTo(24 * scale, -48 * scale, 30 * scale, -40 * scale, 30 * scale, -28 * scale);
      ctx.bezierCurveTo(30 * scale, -16 * scale, 18 * scale, -10 * scale, 2 * scale, -8 * scale);
      ctx.bezierCurveTo(-18 * scale, -6 * scale, -28 * scale, 2 * scale, -28 * scale, 18 * scale);
      ctx.bezierCurveTo(-28 * scale, 34 * scale, -14 * scale, 44 * scale, 8 * scale, 44 * scale);
      ctx.lineTo(26 * scale, 44 * scale);
      ctx.stroke();

      // P forward progress loop (accent)
      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(8 * scale, -10 * scale);
      ctx.lineTo(26 * scale, -10 * scale);
      ctx.bezierCurveTo(42 * scale, -10 * scale, 48 * scale, 0, 48 * scale, 16 * scale);
      ctx.bezierCurveTo(48 * scale, 32 * scale, 42 * scale, 44 * scale, 26 * scale, 44 * scale);
      ctx.lineTo(-4 * scale, 44 * scale);
      ctx.stroke();

      // Ascending Momentum Arrow top-right
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6 * scale;
      ctx.beginPath();
      ctx.moveTo(22 * scale, -38 * scale);
      ctx.lineTo(46 * scale, -38 * scale);
      ctx.lineTo(46 * scale, -14 * scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(46 * scale, -38 * scale);
      ctx.lineTo(20 * scale, -12 * scale);
      ctx.stroke();

      // Small equalizer bars in bottom center
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(-22 * scale, 24 * scale, 4 * scale, 12 * scale, 2 * scale);
      ctx.roundRect(-14 * scale, 18 * scale, 4 * scale, 18 * scale, 2 * scale);
      ctx.roundRect(-6 * scale, 12 * scale, 4 * scale, 24 * scale, 2 * scale);
      ctx.roundRect(2 * scale, 20 * scale, 4 * scale, 16 * scale, 2 * scale);
      ctx.fill();

      ctx.restore();
    } else if (selectedStyle === 'subscribe-action') {
      // 2. High-Conversion "SUBSCRIBE" Action Watermark
      ctx.save();

      // Top Play Icon & Soundwaves
      const centerX = size / 2;
      const topY = 48 * scale;

      // Play button circular badge
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(centerX, topY, 26 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Play triangle in dark obsidian
      ctx.fillStyle = '#061411';
      ctx.beginPath();
      ctx.moveTo(centerX - 6 * scale, topY - 10 * scale);
      ctx.lineTo(centerX + 12 * scale, topY);
      ctx.lineTo(centerX - 6 * scale, topY + 10 * scale);
      ctx.closePath();
      ctx.fill();

      // Pulsing wave dots on sides
      ctx.fillStyle = bgMode === 'white' ? '#061411' : accentColor;
      ctx.beginPath();
      ctx.arc(centerX - 38 * scale, topY, 3 * scale, 0, Math.PI * 2);
      ctx.arc(centerX - 48 * scale, topY, 2 * scale, 0, Math.PI * 2);
      ctx.arc(centerX + 38 * scale, topY, 3 * scale, 0, Math.PI * 2);
      ctx.arc(centerX + 48 * scale, topY, 2 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Red or Mint SUBSCRIBE pill block
      const btnY = 94 * scale;
      const btnHeight = 36 * scale;
      const btnWidth = 132 * scale;

      // Pill container
      ctx.fillStyle = '#E11D48'; // High-visibility YouTube red for SUBSCRIBE
      ctx.beginPath();
      ctx.roundRect(size / 2 - btnWidth / 2, btnY, btnWidth, btnHeight, 8 * scale);
      ctx.fill();

      // "SUBSCRIBE" text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(calloutText || 'SUBSCRIBE', centerX, btnY + btnHeight / 2);

      // Bottom subline "SPEAK IN PROGRESS"
      ctx.fillStyle = bgMode === 'white' ? '#52525B' : '#A1A1AA';
      ctx.font = `700 ${8 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('SPEAK IN PROGRESS', centerX, 140 * scale);

      ctx.restore();
    } else if (selectedStyle === 'obsidian-badge') {
      // 3. Obsidian Modern Badge
      ctx.save();
      const centerX = size / 2;

      // Equalizer arch header
      ctx.fillStyle = accentColor;
      const bars = [10, 18, 26, 32, 26, 18, 10];
      bars.forEach((h, i) => {
        const bx = centerX - 42 * scale + i * 12 * scale;
        const by = 48 * scale - (h * scale) / 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, 5 * scale, h * scale, 2.5 * scale);
        ctx.fill();
      });

      // Big Bold Wordmark: "SPEAK"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${22 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SPEAK', centerX, 88 * scale);

      // Mint sub-pill: "IN PROGRESS"
      const pillWidth = 114 * scale;
      const pillHeight = 22 * scale;
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(centerX - pillWidth / 2, 102 * scale, pillWidth, pillHeight, 6 * scale);
      ctx.fill();

      ctx.fillStyle = '#061411';
      ctx.font = `800 ${10 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('IN PROGRESS', centerX, 117 * scale);

      ctx.restore();
    } else if (selectedStyle === 'soundwave-progress') {
      // 4. Voice Waveform Transformation Watermark
      ctx.save();
      const centerX = size / 2;

      // Waveform bars
      const barHeights = [14, 28, 48, 64, 80, 52, 34, 18];
      const totalWidth = barHeights.length * 10 * scale;
      const startX = centerX - totalWidth / 2;

      barHeights.forEach((bh, i) => {
        const bx = startX + i * 11 * scale;
        const by = 60 * scale - (bh * scale) / 2;

        ctx.fillStyle = i >= 3 && i <= 5 ? accentColor : '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(bx, by, 5 * scale, bh * scale, 2.5 * scale);
        ctx.fill();
      });

      // Bottom Callout
      ctx.fillStyle = accentColor;
      ctx.font = `900 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SPEAK IN PROGRESS', centerX, 118 * scale);

      // Micro tagline
      ctx.fillStyle = bgMode === 'white' ? '#71717A' : '#94A3B8';
      ctx.font = `600 ${8.5 * scale}px "DM Sans", sans-serif`;
      ctx.fillText('PROGRESS, NOT PERFECTION', centerX, 134 * scale);

      ctx.restore();
    }
  };

  // Trigger export of 150x150 or 300x300 PNG
  const handleDownloadPNG = (size: number, label: string) => {
    const canvas = document.createElement('canvas');
    renderWatermarkOnCanvas(canvas, size);

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-watermark-${size}x${size}-${selectedStyle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Download SVG Vector
  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('watermark-svg-preview');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-watermark-150x150.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Vector SVG (150×150)');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Studio Header */}
      <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-9 shadow-card-elevated backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}35`,
              }}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Official YouTube Video Watermark · 150px × 150px</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand flex items-center gap-3">
              <span>Video Watermark Generator</span>
              <span
                className="text-xs px-2.5 py-1 rounded-lg border font-mono font-bold"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}18`,
                  borderColor: `${accentColor}35`,
                }}
              >
                150 × 150 px
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Create and export YouTube's official corner video watermark. Viewers can click this watermark at any point during your videos to immediately subscribe to <strong>Speak in Progress</strong>.
            </p>
          </div>

          {/* Primary Quick Download Button */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              onClick={() => handleDownloadPNG(150, '150×150 PNG')}
              className="px-5 py-3 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-2"
              style={{
                backgroundColor: accentColor,
                color: '#061210',
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download 150×150 PNG</span>
            </button>

            <button
              onClick={() => handleDownloadPNG(300, '300×300 Hi-Res 2x')}
              className="px-4 py-3 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center gap-2"
              title="Download 2x Resolution for high-DPI displays"
            >
              <Layers className="w-4 h-4 text-stone-400" />
              <span>300×300 (2x)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Successfully exported <strong>{downloadSuccess}</strong> ready for YouTube Studio!</span>
          </div>
        )}
      </section>

      {/* Main Studio Grid: Controls & Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Watermark Design Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-6 shadow-card-elevated backdrop-blur-md">
            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center justify-between">
                <span>1. Watermark Concept Style</span>
                <span className="font-mono text-[11px] text-stone-500">4 Pro Variants</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'transparent-monogram',
                    title: 'Transparent Monogram',
                    subtitle: 'Clean Alpha · YouTube #1 Pick',
                  },
                  {
                    id: 'subscribe-action',
                    title: 'Subscribe Action Call',
                    subtitle: 'Highest conversion button',
                  },
                  {
                    id: 'obsidian-badge',
                    title: 'Obsidian Studio Badge',
                    subtitle: 'Solid contrast & audio bars',
                  },
                  {
                    id: 'soundwave-progress',
                    title: 'Voice Waveform',
                    subtitle: 'Audio journey frequency',
                  },
                ].map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id as WatermarkStyle)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'font-bold shadow-md'
                          : 'bg-stone-950/70 text-stone-400 border-white/[0.06] hover:text-white hover:border-white/20'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `${accentColor}18`,
                              borderColor: accentColor,
                              color: '#FFFFFF',
                            }
                          : undefined
                      }
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{style.title}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">
                        {style.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Alpha / Fill Mode */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center justify-between">
                <span>2. Canvas Ground (Alpha / Fill)</span>
                <span className="font-mono text-[11px] text-stone-400">
                  {bgMode === 'transparent' ? 'Alpha PNG (No background)' : bgMode}
                </span>
              </label>

              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'transparent', label: 'Transparent' },
                  { id: 'obsidian', label: 'Obsidian' },
                  { id: 'charcoal', label: 'Charcoal' },
                  { id: 'white', label: 'White' },
                ].map((bg) => {
                  const isSelected = bgMode === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setBgMode(bg.id as BackgroundMode)}
                      className={`py-2 px-1 text-[11px] font-semibold rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'shadow-sm font-bold'
                          : 'bg-stone-950 text-stone-400 border-white/[0.06] hover:text-white'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: accentColor,
                              color: '#061210',
                              borderColor: accentColor,
                            }
                          : undefined
                      }
                    >
                      {bg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Hue Tuner */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300 uppercase tracking-wider">
                <span>3. Accent Energy</span>
                <span className="font-mono" style={{ color: accentColor }}>{accentColor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { name: 'Emerald Spark (Flagship)', hex: '#10B981' },
                  { name: 'Electric Neo Mint', hex: '#00F5A0' },
                  { name: 'Electric Cobalt', hex: '#3B82F6' },
                  { name: 'Sunrise Amber', hex: '#F59E0B' },
                  { name: 'Cyan Horizon', hex: '#06B6D4' },
                  { name: 'Pure White', hex: '#FFFFFF' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                      accentColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Corner Badge Shape & Options */}
            {bgMode !== 'transparent' && (
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  4. Badge Boundary Shape
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'rounded', label: 'Rounded 24px' },
                    { id: 'circle', label: 'Full Circle' },
                    { id: 'square', label: 'Square' },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setBadgeShape(shape.id as any)}
                      className={`py-2 text-[11px] font-semibold rounded-xl border transition-all text-center ${
                        badgeShape === shape.id
                          ? 'bg-stone-800 text-white border-white/30 font-bold'
                          : 'bg-stone-950 text-stone-400 border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Callout Text (if Subscribe style selected) */}
            {selectedStyle === 'subscribe-action' && (
              <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                <label className="block text-xs font-semibold text-stone-300 uppercase">
                  Custom Button Action Text
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={calloutText}
                  onChange={(e) => setCalloutText(e.target.value.toUpperCase())}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 font-mono tracking-wider shadow-badge-inset"
                  placeholder="SUBSCRIBE"
                />
              </div>
            )}

            {/* Glow toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <div>
                <span className="text-xs font-semibold text-white block">Radiant Rim Glow</span>
                <span className="text-[11px] text-stone-400">Enhance edge visibility over high-key video</span>
              </div>
              <button
                onClick={() => setShowGlow(!showGlow)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  showGlow ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showGlow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Specifications Callout */}
          <div className="bg-stone-900/40 border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-sm text-xs text-stone-300">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-stone-200">
              <Info className="w-4 h-4" style={{ color: accentColor }} />
              <span>YouTube Official Guidelines</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-stone-400 leading-relaxed">
              <li><strong>Dimensions:</strong> Minimum 150 × 150 px (1:1 square aspect ratio).</li>
              <li><strong>File Type:</strong> PNG or GIF (PNG is strongly recommended).</li>
              <li><strong>Max Size:</strong> 1MB (our exports are lightweight ~8-24 KB).</li>
              <li><strong>Location:</strong> Bottom-right corner of the video player window.</li>
              <li><strong>Click Action:</strong> Clicking it opens your channel subscribe modal.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Previews & Live Video Player Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: 150x150 Live Master & Vector Preview */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-card-elevated backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                  Production Canvas
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-brand">
                  150 × 150 px Actual Size Preview
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSVG}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg border border-white/10 flex items-center gap-1.5 transition-all"
                  title="Download scalable SVG file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SVG</span>
                </button>
                <button
                  onClick={() => handleDownloadPNG(150, '150×150 PNG')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  style={{
                    backgroundColor: accentColor,
                    color: '#061210',
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>150×150 PNG</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side: Actual 150px and Magnified 300px */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Actual 150x150 px Container */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-[150px] h-[150px] relative overflow-hidden transition-all flex items-center justify-center ${
                    badgeShape === 'circle' ? 'rounded-full' : badgeShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
                  } ${
                    bgMode === 'transparent'
                      ? 'bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] border border-white/15'
                      : bgMode === 'obsidian'
                      ? 'bg-[#061210] border'
                      : bgMode === 'charcoal'
                      ? 'bg-[#18181B] border'
                      : 'bg-white border'
                  }`}
                  style={{
                    borderColor: bgMode !== 'transparent' && showGlow ? accentColor : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: showGlow ? `0 0 25px ${accentColor}25` : undefined,
                  }}
                >
                  {/* SVG Watermark Render */}
                  <svg
                    id="watermark-svg-preview"
                    viewBox="0 0 150 150"
                    width="150"
                    height="150"
                    className="w-full h-full select-none"
                  >
                    {/* Style 1: Transparent Monogram */}
                    {selectedStyle === 'transparent-monogram' && (
                      <g transform="translate(75, 75)">
                        {/* S ribbon */}
                        <path
                          d="M -24 -28 C -24 -42, -8 -48, 8 -48 C 24 -48, 30 -40, 30 -28 C 30 -16, 18 -10, 2 -8 C -18 -6, -28 2, -28 18 C -28 34, -14 44, 8 44 L 26 44"
                          fill="none"
                          stroke={bgMode === 'white' ? '#061210' : '#FFFFFF'}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* P loop */}
                        <path
                          d="M 8 -10 L 26 -10 C 42 -10, 48 0, 48 16 C 48 32, 42 44, 26 44 L -4 44"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Arrow top-right */}
                        <path
                          d="M 22 -38 L 46 -38 L 46 -14 M 46 -38 L 20 -12"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Soundwave bars bottom */}
                        <rect x="-22" y="24" width="4" height="12" rx="2" fill={accentColor} />
                        <rect x="-14" y="18" width="4" height="18" rx="2" fill={accentColor} />
                        <rect x="-6" y="12" width="4" height="24" rx="2" fill={accentColor} />
                        <rect x="2" y="20" width="4" height="16" rx="2" fill={accentColor} />
                      </g>
                    )}

                    {/* Style 2: Subscribe Action */}
                    {selectedStyle === 'subscribe-action' && (
                      <g>
                        <circle cx="75" cy="48" r="26" fill={accentColor} />
                        <polygon points="69,38 87,48 69,58" fill="#061210" />
                        <circle cx="37" cy="48" r="3" fill={bgMode === 'white' ? '#061210' : accentColor} />
                        <circle cx="27" cy="48" r="2" fill={bgMode === 'white' ? '#061210' : accentColor} />
                        <circle cx="113" cy="48" r="3" fill={bgMode === 'white' ? '#061210' : accentColor} />
                        <circle cx="123" cy="48" r="2" fill={bgMode === 'white' ? '#061210' : accentColor} />

                        {/* Subscribe Button */}
                        <rect x="9" y="94" width="132" height="36" rx="8" fill="#E11D48" />
                        <text
                          x="75"
                          y="117"
                          fill="#FFFFFF"
                          fontSize="14"
                          fontWeight="900"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          textAnchor="middle"
                        >
                          {calloutText || 'SUBSCRIBE'}
                        </text>
                        <text
                          x="75"
                          y="142"
                          fill={bgMode === 'white' ? '#52525B' : '#A1A1AA'}
                          fontSize="8"
                          fontWeight="700"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          textAnchor="middle"
                        >
                          SPEAK IN PROGRESS
                        </text>
                      </g>
                    )}

                    {/* Style 3: Obsidian Badge */}
                    {selectedStyle === 'obsidian-badge' && (
                      <g>
                        {/* Audio arches */}
                        {[10, 18, 26, 32, 26, 18, 10].map((h, i) => (
                          <rect
                            key={i}
                            x={33 + i * 12}
                            y={48 - h / 2}
                            width="5"
                            height={h}
                            rx="2.5"
                            fill={accentColor}
                          />
                        ))}
                        <text
                          x="75"
                          y="88"
                          fill="#FFFFFF"
                          fontSize="22"
                          fontWeight="900"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          textAnchor="middle"
                        >
                          SPEAK
                        </text>
                        <rect x="18" y="102" width="114" height="22" rx="6" fill={accentColor} />
                        <text
                          x="75"
                          y="117"
                          fill="#061210"
                          fontSize="10"
                          fontWeight="800"
                          fontFamily="JetBrains Mono, monospace"
                          textAnchor="middle"
                        >
                          IN PROGRESS
                        </text>
                      </g>
                    )}

                    {/* Style 4: Soundwave Progress */}
                    {selectedStyle === 'soundwave-progress' && (
                      <g>
                        {[14, 28, 48, 64, 80, 52, 34, 18].map((h, i) => (
                          <rect
                            key={i}
                            x={31 + i * 11}
                            y={60 - h / 2}
                            width="5"
                            height={h}
                            rx="2.5"
                            fill={i >= 3 && i <= 5 ? accentColor : '#FFFFFF'}
                          />
                        ))}
                        <text
                          x="75"
                          y="118"
                          fill={accentColor}
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          textAnchor="middle"
                        >
                          SPEAK IN PROGRESS
                        </text>
                        <text
                          x="75"
                          y="134"
                          fill={bgMode === 'white' ? '#71717A' : '#94A3B8'}
                          fontSize="8.5"
                          fontWeight="600"
                          fontFamily="DM Sans, sans-serif"
                          textAnchor="middle"
                        >
                          PROGRESS, NOT PERFECTION
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-stone-400">1:1 Actual Scale (150px)</span>
              </div>

              {/* Magnified Retina Specifier */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-[220px] h-[220px] relative overflow-hidden flex items-center justify-center p-3 rounded-2xl bg-stone-950/80 border border-white/10 shadow-badge-inset"
                >
                  <div
                    className={`w-[190px] h-[190px] relative flex items-center justify-center ${
                      badgeShape === 'circle' ? 'rounded-full' : badgeShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
                    } ${
                      bgMode === 'transparent'
                        ? 'bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:12px_12px]'
                        : bgMode === 'obsidian'
                        ? 'bg-[#061210]'
                        : bgMode === 'charcoal'
                        ? 'bg-[#18181B]'
                        : 'bg-white'
                    }`}
                  >
                    <svg viewBox="0 0 150 150" width="190" height="190" className="w-full h-full">
                      <use href="#watermark-svg-preview" />
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-400">Zoomed Detail Inspection</span>
              </div>
            </div>
          </div>

          {/* Card 2: Live YouTube Video Player Simulation */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 shadow-card-elevated backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                  Real-World Verification
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-brand">
                  Live YouTube Player Simulation
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">Bottom-Right Corner</span>
            </div>

            {/* 16:9 Video Player Screen */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 border border-white/10 shadow-2xl group select-none">
              {/* Simulated PC Screen Recording Footage in background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#061210] via-stone-900 to-[#0A1F1A] p-6 flex flex-col justify-between">
                {/* Simulated Teleprompter text in background */}
                <div className="space-y-2 opacity-35 max-w-lg">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase">
                    <span>Day 01</span>
                    <span>·</span>
                    <span>Speak in Progress</span>
                  </div>
                  <div className="text-base sm:text-xl font-bold text-white">
                    "Welcome back to Speak in Progress. Today I'm practicing unscripted retelling..."
                  </div>
                  <div className="text-xs text-stone-300 leading-relaxed hidden sm:block">
                    The key to spoken fluency is progress, not perfection. When you practice out loud daily, your mouth muscles adapt to English rhythm.
                  </div>
                </div>

                {/* Simulated audio waveform animation */}
                <div className="flex items-end gap-1.5 h-8 opacity-40">
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-wave-bar-1" />
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-2" />
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-wave-bar-3" />
                  <div className="w-1.5 bg-white rounded-full animate-wave-bar-4" />
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-wave-bar-5" />
                </div>
              </div>

              {/* YouTube Player Controls Bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between px-3 sm:px-4 z-10">
                <div className="flex items-center gap-3 text-white text-xs">
                  <Play className="w-4 h-4 fill-white" />
                  <div className="w-24 sm:w-48 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-red-600 rounded-full" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono text-stone-300">02:45 / 06:15</span>
                </div>

                <div className="flex items-center gap-2 text-stone-300 text-xs font-mono">
                  <span className="hidden sm:inline text-[11px]">HD 1080p</span>
                </div>
              </div>

              {/* The Actual Watermark Positioned in Bottom-Right Corner (Exact YouTube placement) */}
              <div
                className="absolute bottom-11 sm:bottom-14 right-3 sm:right-5 z-20 cursor-pointer transition-transform duration-200 hover:scale-105"
                onMouseEnter={() => setIsHoveredInPlayer(true)}
                onMouseLeave={() => setIsHoveredInPlayer(false)}
              >
                {/* 150x150 Watermark rendered proportionally (scaled to match player ratio ~48px-64px on preview) */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center ${
                    badgeShape === 'circle' ? 'rounded-full' : badgeShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
                  } ${
                    bgMode === 'transparent'
                      ? ''
                      : bgMode === 'obsidian'
                      ? 'bg-[#061210] border border-emerald-500/40 shadow-lg'
                      : bgMode === 'charcoal'
                      ? 'bg-[#18181B] border border-white/20 shadow-lg'
                      : 'bg-white border border-stone-300 shadow-lg'
                  }`}
                  style={{
                    boxShadow: showGlow ? `0 0 15px ${accentColor}40` : undefined,
                  }}
                >
                  <svg viewBox="0 0 150 150" className="w-full h-full">
                    <use href="#watermark-svg-preview" />
                  </svg>
                </div>

                {/* Simulated YouTube Subscribe Hover Card */}
                {isHoveredInPlayer && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-stone-900/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in text-xs space-y-2 pointer-events-none z-30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-400 text-stone-950 font-black flex items-center justify-center text-xs">
                        SP
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">Speak in Progress</div>
                        <div className="text-[10px] text-stone-400">@SpeakInProgress</div>
                      </div>
                    </div>
                    <div className="bg-red-600 text-white font-bold text-center py-1.5 rounded-lg text-xs shadow-sm">
                      SUBSCRIBE
                    </div>
                    <div className="text-[9px] text-stone-400 text-center">
                      YouTube 1-click subscription active
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Hover over the watermark in the bottom-right corner to see how YouTube displays your channel's subscribe tooltip card!
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step YouTube Upload Walkthrough */}
      <section className="bg-stone-900/50 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: accentColor }}>
              YouTube Studio Deployment Guide
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-brand">
              How to Upload Your Watermark to YouTube Studio in 60 Seconds
            </h3>
          </div>

          <a
            href="https://studio.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 bg-stone-800/80 px-3.5 py-1.5 rounded-xl border border-white/10 w-fit"
          >
            <span>Open YouTube Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
            <span className="font-mono text-[10px] text-stone-500 uppercase">Step 01</span>
            <div className="text-white font-bold">Open Customization</div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Log into <strong>studio.youtube.com</strong>, click <strong>Customization</strong> on the left menu, then select the <strong>Branding</strong> tab.
            </p>
          </div>

          <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
            <span className="font-mono text-[10px] text-stone-500 uppercase">Step 02</span>
            <div className="text-white font-bold">Scroll to Video Watermark</div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Find the <strong>Video watermark</strong> section at the bottom of the Branding page.
            </p>
          </div>

          <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
            <span className="font-mono text-[10px] text-stone-500 uppercase">Step 03</span>
            <div className="text-white font-bold">Upload 150×150 PNG</div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Click <strong>Upload</strong> and pick the downloaded <code>speak-in-progress-watermark-150x150.png</code>.
            </p>
          </div>

          <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
            <span className="font-mono text-[10px] text-stone-500 uppercase">Step 04</span>
            <div className="text-white font-bold">Set "Entire video"</div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Select <strong>Entire video</strong> so your branding and subscribe button remain active throughout your speaking sessions. Click <strong>Publish</strong>!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
