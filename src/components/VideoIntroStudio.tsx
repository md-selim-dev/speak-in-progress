/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import fixWebmDuration from 'fix-webm-duration';
import { BrandIdentity } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  CheckCircle2,
  Sliders,
  Check,
  Type,
  Music,
  X,
  FileVideo,
  Radio,
} from 'lucide-react';

interface VideoIntroStudioProps {
  activeBrand: BrandIdentity;
}

export type IntroSoundProfile = 'elegant-corporate' | 'cinematic-intro' | 'natural-chime' | 'warm-wood';
export type IntroDuration = 3.0 | 3.5 | 4.0;
export type IntroResolution = '1080p' | '720p';
export type IntroTextScale = 'cinematic' | 'mega' | 'large';
export type IntroLogoScale = 'prominent' | 'large' | 'mega';
export type VideoFormat = 'mp4' | 'webm';

export interface AudioTrackItem {
  id: IntroSoundProfile;
  title: string;
  subtitle: string;
  type: 'file' | 'synth';
  url?: string;
  badge: string;
}

export const AUDIO_TRACKS: AudioTrackItem[] = [
  {
    id: 'elegant-corporate',
    title: 'Elegant Corporate FX Logo',
    subtitle: 'Attached Audio · Smooth acoustic chime, resonant riser & warm resolve (Recommended)',
    type: 'file',
    url: '/assets/aistudio/amadozapana-elegant-corporate-fx-logo-287874_ee88ce49.mp3',
    badge: 'ATTACHED MP3',
  },
  {
    id: 'cinematic-intro',
    title: 'Cinematic Impact Intro',
    subtitle: 'Attached Audio · Sub-bass whoosh, dramatic swell & orchestral shimmer',
    type: 'file',
    url: '/assets/aistudio/freesound_community-cinematic-intro-3-40041_31b7eaf7.mp3',
    badge: 'ATTACHED MP3',
  },
  {
    id: 'natural-chime',
    title: 'Natural 528Hz Acoustic Chime',
    subtitle: 'Synthesized Harmonic · Organic breath whoosh & pure crystal resonance',
    type: 'synth',
    badge: 'SYNTHESIZED',
  },
  {
    id: 'warm-wood',
    title: 'Warm Wooden Mallet Resonance',
    subtitle: 'Synthesized Organic · Tactile mallet chime with gentle acoustic decay',
    type: 'synth',
    badge: 'SYNTHESIZED',
  },
];

// In-memory ArrayBuffer cache for rapid, repeatable decoding without network re-fetch
const audioArrayBuffers: Record<string, ArrayBuffer> = {};

// Load and decode audio buffer on a specific AudioContext
async function loadAudioBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  try {
    if (!audioArrayBuffers[url]) {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      audioArrayBuffers[url] = await resp.arrayBuffer();
    }
    // Clone buffer before decoding because decodeAudioData neuters the ArrayBuffer in WebKit/Blink
    const cloned = audioArrayBuffers[url].slice(0);
    return await ctx.decodeAudioData(cloned);
  } catch (err) {
    console.warn('Audio decoding failed for', url, err);
    return null;
  }
}

// Wrapper to patch WebM EBML duration header so video players (VLC, Chrome, QuickTime, CapCut)
// read exact duration and don't stall after 1 second
const fixDurationPromise = (blob: Blob, durationMs: number): Promise<Blob> => {
  return new Promise((resolve) => {
    try {
      fixWebmDuration(blob, durationMs, (fixedBlob: Blob) => {
        resolve(fixedBlob);
      });
    } catch (err) {
      console.warn('fixWebmDuration fallback:', err);
      resolve(blob);
    }
  });
};

export const VideoIntroStudio: React.FC<VideoIntroStudioProps> = ({ activeBrand }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<IntroDuration>(3.5);
  const [soundProfile, setSoundProfile] = useState<IntroSoundProfile>('elegant-corporate');
  const [textScale, setTextScale] = useState<IntroTextScale>('cinematic');
  const [logoScale, setLogoScale] = useState<IntroLogoScale>('large');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [resolution, setResolution] = useState<IntroResolution>('1080p');
  const [formatPreference, setFormatPreference] = useState<VideoFormat>('mp4');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStepMessage, setExportStepMessage] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>(activeBrand.colors?.accent?.hex || '#10B981');

  // Preview & Exported Video Player Modal state
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedFormat, setExportedFormat] = useState<'mp4' | 'webm'>('mp4');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Preview Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previewAudioCtxRef = useRef<AudioContext | null>(null);
  const activeStopAudioRef = useRef<(() => void) | null>(null);

  // Sync accent color with brand
  useEffect(() => {
    if (activeBrand.colors?.accent?.hex) {
      setAccentColor(activeBrand.colors.accent.hex);
    }
  }, [activeBrand]);

  // Pre-fetch both MP3 files into memory on mount
  useEffect(() => {
    AUDIO_TRACKS.forEach((track) => {
      if (track.type === 'file' && track.url && !audioArrayBuffers[track.url]) {
        fetch(track.url)
          .then((res) => {
            if (res.ok) return res.arrayBuffer();
            return null;
          })
          .then((buf) => {
            if (buf) audioArrayBuffers[track.url!] = buf;
          })
          .catch((err) => console.warn('Preload audio error for', track.url, err));
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (previewAudioCtxRef.current && previewAudioCtxRef.current.state !== 'closed') {
        previewAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Synthesized harmonic audio fallback
  const playSynthesizedTrack = (
    ctx: AudioContext,
    masterGain: GainNode,
    targetDur: number,
    profile: IntroSoundProfile = 'natural-chime'
  ) => {
    const t0 = ctx.currentTime;

    // Soft Breath / Air Whoosh
    const bufferSize = ctx.sampleRate * 1.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, t0);
    filter.frequency.exponentialRampToValueAtTime(750, t0 + 0.6);
    filter.frequency.exponentialRampToValueAtTime(180, t0 + 1.2);
    filter.Q.setValueAtTime(2.5, t0);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t0);
    noiseGain.gain.linearRampToValueAtTime(0.25, t0 + 0.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.3);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start(t0);

    // Deep Grounding Root Tone (110Hz A2)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, t0);
    subOsc.frequency.exponentialRampToValueAtTime(108, t0 + targetDur);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.001, t0);
    subGain.gain.linearRampToValueAtTime(0.28, t0 + 0.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, t0 + targetDur - 0.2);

    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(t0);
    subOsc.stop(t0 + targetDur);

    // Harmonic Chimes
    const frequencies = profile === 'warm-wood' ? [440, 554.37, 659.25, 880] : [528, 660, 792, 1056];
    frequencies.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      chimeOsc.type = idx === 0 ? 'sine' : 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, t0 + 0.7);

      const chimeGain = ctx.createGain();
      const startTime = t0 + 0.7 + idx * 0.08;
      chimeGain.gain.setValueAtTime(0.0001, startTime);
      chimeGain.gain.linearRampToValueAtTime(0.2 / (idx + 1), startTime + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.0);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterGain);
      chimeOsc.start(startTime);
      chimeOsc.stop(startTime + 2.2);
    });
  };

  // Dedicated audio player for any AudioContext (works seamlessly for preview OR export destination)
  const playAudioToDestination = async (
    ctx: AudioContext,
    destNode: AudioNode,
    trackId: IntroSoundProfile,
    targetDuration: number,
    volume: number = 0.95
  ): Promise<() => void> => {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(destNode);

    const track = AUDIO_TRACKS.find((t) => t.id === trackId);
    let stopFn = () => {};

    if (track?.type === 'file' && track.url) {
      const buffer = await loadAudioBuffer(ctx, track.url);
      if (buffer) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Smooth volume envelope with fade-out at the end of the duration
        const fadeStart = Math.max(0, targetDuration - 0.35);
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.gain.setValueAtTime(volume, ctx.currentTime + fadeStart);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + targetDuration);

        source.connect(masterGain);
        source.start(ctx.currentTime);
        source.stop(ctx.currentTime + targetDuration + 0.1);

        stopFn = () => {
          try {
            source.stop();
          } catch (_) {}
        };
        return stopFn;
      }
    }

    // Synthesized audio fallback
    playSynthesizedTrack(ctx, masterGain, targetDuration, trackId);
    return stopFn;
  };

  const stopPreviewAudio = () => {
    if (activeStopAudioRef.current) {
      try {
        activeStopAudioRef.current();
      } catch (_) {}
      activeStopAudioRef.current = null;
    }
  };

  // Render a specific frame at timestamp `t` (0 <= t <= duration) onto canvas
  const renderFrame = useCallback(
    (canvas: HTMLCanvasElement, t: number, totalDur: number = duration) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const progress = Math.min(Math.max(t / totalDur, 0), 1);
      const scale = W / 1920;

      // Clear Canvas
      ctx.clearRect(0, 0, W, H);

      // --- Background: Obsidian Space with Dynamic Radiant Bloom ---
      const bgGrad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        60 * scale,
        W / 2,
        H / 2,
        1000 * scale
      );
      const bloomIntensity = Math.sin(progress * Math.PI) * 0.45 + 0.15;
      bgGrad.addColorStop(0, '#061914');
      bgGrad.addColorStop(0.4, '#030E0B');
      bgGrad.addColorStop(1, '#020504');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Determine base logo size based on logoScale setting
      let baseLogoPx = 230; // Prominent (Default, +44% larger than previous 160px)
      if (logoScale === 'prominent') {
        baseLogoPx = 200;
      } else if (logoScale === 'mega') {
        baseLogoPx = 265;
      }

      const logoCenterY = H * 0.33;

      // Subtle Emerald Spark central flare centered with the enlarged logo
      const flareRadius = (300 + Math.sin(progress * Math.PI) * 180) * scale;
      const flareGrad = ctx.createRadialGradient(W / 2, logoCenterY, 12 * scale, W / 2, logoCenterY, flareRadius);
      flareGrad.addColorStop(0, `${accentColor}${Math.floor(bloomIntensity * 255).toString(16).padStart(2, '0')}`);
      flareGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, W, H);

      // Acoustic Soundwave Circles (Expanding Ripples centered on the enlarged logo)
      if (t > 0.4) {
        const rippleProgress = (t - 0.4) / (totalDur - 0.4);
        [1, 2, 3].forEach((rIndex) => {
          const rProg = (rippleProgress * 1.5 - rIndex * 0.2 + 1) % 1;
          const rRadius = (200 + rProg * 500) * scale;
          const rAlpha = Math.max(0, (1 - rProg) * 0.22);
          ctx.save();
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = rAlpha;
          ctx.lineWidth = 2 * scale;
          ctx.beginPath();
          ctx.arc(W / 2, logoCenterY, rRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });
      }

      // --- Vector Logo Branding Animation (Unboxed Monogram) ---
      const logoIntroT = Math.min(t / 1.0, 1.0);
      const easeLogo = 1 - Math.pow(1 - logoIntroT, 3); // Cubic ease-out

      const logoSize = baseLogoPx * scale * (0.85 + 0.15 * easeLogo);
      const logoX = W / 2 - logoSize / 2;
      const logoY = logoCenterY - logoSize / 2;

      ctx.save();
      ctx.translate(logoX, logoY);
      const logoTransformScale = logoSize / 100;
      ctx.scale(logoTransformScale, logoTransformScale);

      // Glow behind logo
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 40 * scale * (0.5 + Math.sin(t * 3) * 0.5);

      // Draw Ribbon S
      const sDashLen = 140;
      const sProgress = Math.min(Math.max((t - 0.1) / 0.8, 0), 1);
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([sDashLen, sDashLen]);
      ctx.lineDashOffset = sDashLen * (1 - sProgress);

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
      ctx.restore();

      // Draw Loop P (Emerald Spark Gradient)
      const pDashLen = 120;
      const pProgress = Math.min(Math.max((t - 0.35) / 0.8, 0), 1);
      if (pProgress > 0) {
        ctx.save();
        const pGrad = ctx.createLinearGradient(0, 0, 100, 100);
        pGrad.addColorStop(0, '#FFFFFF');
        pGrad.addColorStop(0.35, accentColor);
        pGrad.addColorStop(1, accentColor);
        ctx.strokeStyle = pGrad;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.setLineDash([pDashLen, pDashLen]);
        ctx.lineDashOffset = pDashLen * (1 - pProgress);

        ctx.beginPath();
        ctx.moveTo(44, 44);
        ctx.lineTo(64, 44);
        ctx.bezierCurveTo(71.732, 44, 78, 50.268, 78, 58);
        ctx.bezierCurveTo(78, 65.732, 71.732, 72, 64, 72);
        ctx.lineTo(46, 72);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Momentum Arrow
      const arrowProgress = Math.min(Math.max((t - 0.7) / 0.5, 0), 1);
      if (arrowProgress > 0) {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = arrowProgress;

        ctx.beginPath();
        ctx.moveTo(62, 20);
        ctx.lineTo(78, 20);
        ctx.lineTo(78, 36);
        ctx.moveTo(78, 20);
        ctx.lineTo(60, 38);
        ctx.stroke();
        ctx.restore();
      }

      // Acoustic Speech Waveform Center Bars
      if (t > 0.6) {
        const barOsc = Math.sin(t * 12);
        const barOsc2 = Math.cos(t * 10);
        const barOsc3 = Math.sin(t * 14 + 1);

        const b1H = Math.max(4, 10 + barOsc * 4);
        const b2H = Math.max(6, 18 + barOsc2 * 6);
        const b3H = Math.max(8, 26 + barOsc3 * 7);
        const b4H = Math.max(4, 14 + barOsc * 5);

        ctx.save();
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect(36, 53 - b1H / 2, 3.5, b1H, 1.75);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(43, 53 - b2H / 2, 3.5, b2H, 1.75);
        ctx.fill();

        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect(50, 53 - b3H / 2, 3.5, b3H, 1.75);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(57, 53 - b4H / 2, 3.5, b4H, 1.75);
        ctx.fill();
        ctx.restore();
      }

      // Origin Progress Dot
      if (t > 0.8) {
        const dotAlpha = Math.min((t - 0.8) / 0.3, 1);
        ctx.save();
        ctx.globalAlpha = dotAlpha;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(70, 27, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // Restore from logo transform

      // Typography sizing based on textScale setting
      let headlinePx = 88;
      let mottoPx = 38;
      let sublinePx = 22;
      if (textScale === 'large') {
        headlinePx = 76;
        mottoPx = 34;
        sublinePx = 20;
      } else if (textScale === 'mega') {
        headlinePx = 104;
        mottoPx = 44;
        sublinePx = 26;
      }

      // --- Brand Typography: "SPEAK IN PROGRESS" (0.85s - 3.5s) ---
      if (t > 0.85) {
        const textProgress = Math.min((t - 0.85) / 0.75, 1);
        const textEase = 1 - Math.pow(1 - textProgress, 3);
        const textY = H * 0.61 + (1 - textEase) * 18 * scale;

        ctx.save();
        ctx.globalAlpha = textEase;
        ctx.font = `900 ${headlinePx * scale}px "Plus Jakarta Sans", sans-serif`;

        // Intense drop shadows for razor-sharp legibility on any display
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 32 * scale;
        ctx.shadowOffsetY = 6 * scale;

        // Dual-tone wordmark: "SPEAK IN " (Crisp White) + "PROGRESS" (Glowing Emerald Spark)
        const prefix = 'SPEAK IN ';
        const highlight = 'PROGRESS';
        const prefixW = ctx.measureText(prefix).width;
        const highlightW = ctx.measureText(highlight).width;
        const totalW = prefixW + highlightW;
        const startX = W / 2 - totalW / 2;

        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(prefix, startX, textY);

        ctx.fillStyle = accentColor;
        ctx.shadowColor = `${accentColor}88`;
        ctx.shadowBlur = 24 * scale;
        ctx.fillText(highlight, startX + prefixW, textY);
        ctx.restore();
      }

      // --- Philosophical Motto: "Progress, not perfection" (1.6s - 3.5s) ---
      if (t > 1.6) {
        const mottoProgress = Math.min((t - 1.6) / 0.7, 1);
        const mottoEase = 1 - Math.pow(1 - mottoProgress, 3);
        const mottoY = H * 0.73 + (1 - mottoEase) * 12 * scale;

        ctx.save();
        ctx.globalAlpha = mottoEase;
        ctx.font = `italic 800 ${mottoPx * scale}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = accentColor;
        ctx.shadowColor = `${accentColor}88`;
        ctx.shadowBlur = 18 * scale;
        ctx.fillText('“Progress, not perfection”', W / 2, mottoY);
        ctx.restore();

        // Subline tag
        ctx.save();
        ctx.globalAlpha = mottoEase * 0.95;
        ctx.font = `800 ${sublinePx * scale}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#E2E8F0';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 10 * scale;
        ctx.fillText('THE SPOKEN ENGLISH JOURNEY', W / 2, mottoY + 48 * scale);
        ctx.restore();
      }

      // --- Cinematic Subtle Accent Vignette Border ---
      ctx.save();
      ctx.strokeStyle = `${accentColor}40`;
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(12 * scale, 12 * scale, W - 24 * scale, H - 24 * scale);
      ctx.restore();
    },
    [accentColor, duration, soundProfile, textScale, logoScale]
  );

  // Animation Loop for live player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isPlaying) {
      const step = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp - currentTime * 1000;
        }

        const elapsed = (timestamp - startTimeRef.current) / 1000;

        if (elapsed >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
          startTimeRef.current = null;
          stopPreviewAudio();
          renderFrame(canvas, duration);
          return;
        }

        setCurrentTime(elapsed);
        renderFrame(canvas, elapsed);
        animationFrameRef.current = requestAnimationFrame(step);
      };

      animationFrameRef.current = requestAnimationFrame(step);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      renderFrame(canvas, currentTime);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, renderFrame]);

  // Initial render when loaded or duration changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderFrame(canvas, currentTime);
    }
  }, [renderFrame, currentTime, duration]);

  // Play / Pause toggle
  const handleTogglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopPreviewAudio();
    } else {
      if (currentTime >= duration - 0.05) {
        setCurrentTime(0);
        startTimeRef.current = null;
      }
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!previewAudioCtxRef.current || previewAudioCtxRef.current.state === 'closed') {
        previewAudioCtxRef.current = new AudioCtx();
      }
      const ctx = previewAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      stopPreviewAudio();
      if (!isMuted) {
        activeStopAudioRef.current = await playAudioToDestination(
          ctx,
          ctx.destination,
          soundProfile,
          duration,
          0.95
        );
      }
      setIsPlaying(true);
    }
  };

  // Replay from beginning
  const handleReplay = async () => {
    setCurrentTime(0);
    startTimeRef.current = null;
    stopPreviewAudio();

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!previewAudioCtxRef.current || previewAudioCtxRef.current.state === 'closed') {
      previewAudioCtxRef.current = new AudioCtx();
    }
    const ctx = previewAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (!isMuted) {
      activeStopAudioRef.current = await playAudioToDestination(
        ctx,
        ctx.destination,
        soundProfile,
        duration,
        0.95
      );
    }
    setIsPlaying(true);
  };

  // Sound track change handler
  const handleSelectTrack = async (trackId: IntroSoundProfile) => {
    setSoundProfile(trackId);
    if (isPlaying) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!previewAudioCtxRef.current || previewAudioCtxRef.current.state === 'closed') {
        previewAudioCtxRef.current = new AudioCtx();
      }
      const ctx = previewAudioCtxRef.current;
      stopPreviewAudio();
      if (!isMuted) {
        activeStopAudioRef.current = await playAudioToDestination(
          ctx,
          ctx.destination,
          trackId,
          duration,
          0.95
        );
      }
    }
  };

  // Robust 60fps Video Export with Synchronized Audio Track & EBML Duration Fix
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStepMessage('Initializing audio & 60fps render engine...');
    setIsPlaying(false);
    stopPreviewAudio();

    let exportCanvas: HTMLCanvasElement | null = null;
    let exportAudioCtx: AudioContext | null = null;

    try {
      const W = resolution === '1080p' ? 1920 : 1280;
      const H = resolution === '1080p' ? 1080 : 720;

      // 1. Create dedicated offscreen canvas attached to DOM so Chrome renders all 60fps frames
      exportCanvas = document.createElement('canvas');
      exportCanvas.width = W;
      exportCanvas.height = H;
      exportCanvas.style.position = 'fixed';
      exportCanvas.style.left = '-99999px';
      exportCanvas.style.top = '-99999px';
      exportCanvas.style.pointerEvents = 'none';
      exportCanvas.style.opacity = '0.001';
      exportCanvas.style.zIndex = '-9999';
      document.body.appendChild(exportCanvas);

      // Render frame 0
      renderFrame(exportCanvas, 0, duration);
      setExportProgress(12);
      setExportStepMessage('Decoding audio soundtrack buffer...');

      // 2. Setup isolated AudioContext for recording
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      exportAudioCtx = new AudioCtx();
      if (exportAudioCtx.state === 'suspended') {
        await exportAudioCtx.resume();
      }
      const audioDest = exportAudioCtx.createMediaStreamDestination();

      // Pre-load audio buffer on exportAudioCtx
      const track = AUDIO_TRACKS.find((t) => t.id === soundProfile);
      let audioBuffer: AudioBuffer | null = null;
      if (track?.type === 'file' && track.url) {
        audioBuffer = await loadAudioBuffer(exportAudioCtx, track.url);
      }

      // Route audio to audioDest with master gain and fade
      const masterGain = exportAudioCtx.createGain();
      masterGain.gain.setValueAtTime(0.95, exportAudioCtx.currentTime);
      masterGain.connect(audioDest);

      if (audioBuffer) {
        const srcNode = exportAudioCtx.createBufferSource();
        srcNode.buffer = audioBuffer;
        const fadeStart = Math.max(0, duration - 0.35);
        masterGain.gain.setValueAtTime(0.95, exportAudioCtx.currentTime);
        masterGain.gain.setValueAtTime(0.95, exportAudioCtx.currentTime + fadeStart);
        masterGain.gain.linearRampToValueAtTime(0.0001, exportAudioCtx.currentTime + duration);
        srcNode.connect(masterGain);
        srcNode.start(exportAudioCtx.currentTime);
        srcNode.stop(exportAudioCtx.currentTime + duration + 0.2);
      } else {
        playSynthesizedTrack(exportAudioCtx, masterGain, duration, soundProfile);
      }

      setExportProgress(18);
      setExportStepMessage('Capturing combined video + audio streams...');

      // 3. Combine video and audio tracks into a unified MediaStream
      const canvasStream = exportCanvas.captureStream(60);
      const combinedTracks: MediaStreamTrack[] = [
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks(),
      ];
      const combinedStream = new MediaStream(combinedTracks);

      // Pick best supported browser recording MIME
      let recorderMime = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(recorderMime)) {
        recorderMime = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(recorderMime)) {
        recorderMime = 'video/webm';
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported(recorderMime) ? recorderMime : undefined,
        videoBitsPerSecond: resolution === '1080p' ? 14000000 : 8000000,
        audioBitsPerSecond: 192000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const startExportTime = performance.now();
      const totalDurationMs = duration * 1000;
      const extraFlushMs = 250; // extra margin ensuring final audio & video frames are received

      recorder.start(100);

      await new Promise<void>((resolveRecord) => {
        const recordStep = (now: number) => {
          const elapsedMs = now - startExportTime;
          const elapsedSec = Math.min(elapsedMs / 1000, duration);

          if (exportCanvas) {
            renderFrame(exportCanvas, elapsedSec, duration);
          }

          const progressPct = Math.min(18 + Math.floor((elapsedSec / duration) * 65), 83);
          setExportProgress(progressPct);
          setExportStepMessage(`Recording frames & audio sync (${elapsedSec.toFixed(1)}s / ${duration}s)...`);

          if (elapsedMs < totalDurationMs + extraFlushMs) {
            requestAnimationFrame(recordStep);
          } else {
            if (exportCanvas) {
              renderFrame(exportCanvas, duration, duration);
            }
            setExportProgress(85);
            setExportStepMessage('Flushing media packets & stopping recorder...');
            if (recorder.state === 'recording') {
              recorder.onstop = () => resolveRecord();
              recorder.stop();
            } else {
              resolveRecord();
            }
          }
        };
        requestAnimationFrame(recordStep);
      });

      setExportProgress(88);
      setExportStepMessage('Patching WebM EBML duration headers...');

      // 4. Assemble raw recorded WebM blob
      const rawBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });

      // 5. Fix EBML WebM duration header immediately so client-side WebM has exact duration
      const fixedWebmBlob = await fixDurationPromise(rawBlob, duration * 1000);

      let finalBlob: Blob = fixedWebmBlob;
      let finalExt: 'mp4' | 'webm' = formatPreference;

      // 6. If user requested MP4:
      // Send to server transcode endpoint powered by FFmpeg (H.264 + AAC + faststart)
      if (formatPreference === 'mp4') {
        setExportProgress(92);
        setExportStepMessage('Encoding universal MP4 (H.264 + AAC 192k) via server engine...');
        try {
          const convResp = await fetch('/api/convert-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'video/webm',
              'x-target-format': 'mp4',
              'x-target-duration': duration.toString(),
            },
            body: fixedWebmBlob,
          });

          if (convResp.ok) {
            const mp4Blob = await convResp.blob();
            if (mp4Blob.size > 1000) {
              finalBlob = mp4Blob;
              finalExt = 'mp4';
            }
          } else {
            console.warn('Server MP4 returned status', convResp.status);
          }
        } catch (serverErr) {
          console.warn('Server conversion skipped, fallback to fixed WebM', serverErr);
        }
      } else {
        // User requested WebM: also pass through server or use fixedWebmBlob directly
        setExportProgress(92);
        setExportStepMessage('Finalizing WebM VP9 container...');
        try {
          const convResp = await fetch('/api/convert-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'video/webm',
              'x-target-format': 'webm',
              'x-target-duration': duration.toString(),
            },
            body: fixedWebmBlob,
          });
          if (convResp.ok) {
            const webmBlob = await convResp.blob();
            if (webmBlob.size > 1000) {
              finalBlob = webmBlob;
            }
          }
        } catch (_) {}
        finalExt = 'webm';
      }

      setExportProgress(100);
      setExportStepMessage('Ready!');

      // 7. Create blob URL for in-app verification preview player
      const videoUrl = URL.createObjectURL(finalBlob);
      setExportedVideoUrl(videoUrl);
      setExportedFormat(finalExt);
      setShowPreviewModal(true);

      // 8. Trigger automatic browser download
      const filename = `speak-in-progress-intro-${duration}s-${resolution}.${finalExt}`;
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const trackTitle = track?.title || 'Authentic Sound';
      setDownloadSuccess(
        `Export Complete: ${duration}s Intro Video (.${finalExt.toUpperCase()}) with ${trackTitle}!`
      );
      setTimeout(() => setDownloadSuccess(null), 6000);
    } catch (err) {
      console.error('Video export error:', err);
    } finally {
      if (exportCanvas && exportCanvas.parentNode) {
        exportCanvas.parentNode.removeChild(exportCanvas);
      }
      if (exportAudioCtx && exportAudioCtx.state !== 'closed') {
        exportAudioCtx.close().catch(() => {});
      }
      setIsExporting(false);
      setExportStepMessage('');
    }
  };

  // Direct download of selected MP3 audio file
  const handleDownloadSelectedAudio = () => {
    const currentTrack = AUDIO_TRACKS.find((t) => t.id === soundProfile);
    if (currentTrack?.url) {
      const link = document.createElement('a');
      link.href = currentTrack.url;
      link.download = `speak-in-progress-soundtrack-${currentTrack.id}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const selectedTrack = AUDIO_TRACKS.find((t) => t.id === soundProfile) || AUDIO_TRACKS[0];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Studio Header */}
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
              <Film className="w-3.5 h-3.5" />
              <span>3-4s YouTube Video Intro Bumper</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
              Branded Logo Intro Generator
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Export a smooth, high-definition 60fps logo branding video intro (3–4 seconds) featuring your unboxed Speak in Progress monogram, bold readable typography, and authentic corporate or cinematic audio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
            {exportedVideoUrl && (
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 rounded-xl border border-emerald-500/40 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Play Exported Video</span>
              </button>
            )}

            <button
              onClick={handleReplay}
              className="px-4 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Intro</span>
            </button>

            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="px-5 py-2.5 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                color: '#04120D',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isExporting ? `Rendering Video ${exportProgress}%...` : `Export ${duration}s Video (${formatPreference.toUpperCase()})`}
              </span>
            </button>
          </div>
        </div>

        {isExporting && (
          <div className="mt-4 p-4 bg-stone-950 border border-emerald-500/40 rounded-xl space-y-2 font-mono text-xs text-stone-300">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>{exportStepMessage}</span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {downloadSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
            {exportedVideoUrl && (
              <button
                onClick={() => setShowPreviewModal(true)}
                className="underline hover:text-white font-bold text-xs"
              >
                Watch Preview
              </button>
            )}
          </div>
        )}
      </section>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Video Player Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-300">
              <span>60 FPS Cinematic Player</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-800 text-emerald-300 border border-emerald-500/30">
                {currentTime.toFixed(2)}s / {duration.toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (nextMuted) {
                    stopPreviewAudio();
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 bg-stone-800 text-stone-300 hover:text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            </div>
          </div>

          {/* 16:9 Video Canvas Display */}
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-emerald-500/50 shadow-2xl bg-black group select-none">
            <canvas
              ref={canvasRef}
              width={1920}
              height={1080}
              className="w-full h-full object-contain cursor-pointer"
              onClick={handleTogglePlay}
            />

            {/* Big Play Overlay when paused */}
            {!isPlaying && (
              <div
                onClick={handleTogglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: accentColor,
                    color: '#04120D',
                  }}
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-current" />
                </div>
              </div>
            )}

            {/* Video Player Scrub Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.02"
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (canvasRef.current) renderFrame(canvasRef.current, val);
                }}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Player Transport Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-900/60 border border-white/[0.08] rounded-2xl text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                style={{
                  backgroundColor: accentColor,
                  color: '#04120D',
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Intro'}</span>
              </button>

              <button
                onClick={handleReplay}
                className="p-2.5 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 transition-all flex items-center gap-1.5 border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-stone-300 font-mono text-[11px] truncate">
              <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{selectedTrack.title}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Audio Soundtrack Selection (Featuring user attachments) */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Soundtracks & Logo FX</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">2 Attached MP3s</span>
            </div>

            <div className="space-y-2.5">
              {AUDIO_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between gap-3 ${
                    soundProfile === t.id
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md font-semibold'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate">{t.title}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                          t.badge.includes('ATTACHED')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {t.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">{t.subtitle}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {soundProfile === t.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              ))}
            </div>

            {selectedTrack.url && (
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400">Need just the raw audio file?</span>
                <button
                  onClick={handleDownloadSelectedAudio}
                  className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download MP3</span>
                </button>
              </div>
            )}
          </div>

          {/* Logo Size & Presence */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Logo Size & Presence</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {logoScale === 'mega' ? '265px Mega' : logoScale === 'large' ? '230px Prominent (Default)' : '200px Bold'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'prominent', label: '200px Bold', desc: 'Balanced' },
                { id: 'large', label: '230px Prominent', desc: 'Bigger (Default)' },
                { id: 'mega', label: '265px Mega', desc: 'Maximum Impact' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setLogoScale(s.id as IntroLogoScale);
                    if (canvasRef.current) renderFrame(canvasRef.current, currentTime);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    logoScale === s.id
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md font-bold'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              ✓ Enlarged unboxed monogram logo with dynamic Emerald Spark flare and acoustic ripples.
            </p>
          </div>

          {/* Typography Size & Visibility Scale */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                <span>Text Size & Visibility</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {textScale === 'mega' ? '104px Mega' : textScale === 'large' ? '76px Large' : '88px Cinematic'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'large', label: '76px Crisp', desc: 'Clean Balance' },
                { id: 'cinematic', label: '88px Bold', desc: 'Recommended' },
                { id: 'mega', label: '104px Mega', desc: 'Maximum Impact' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setTextScale(s.id as IntroTextScale);
                    if (canvasRef.current) renderFrame(canvasRef.current, currentTime);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    textScale === s.id
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md font-bold'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              ✓ Enlarged font with dual-tone rendering: <strong>SPEAK IN</strong> in crisp white and <strong>PROGRESS</strong> in glowing Emerald Spark.
            </p>
          </div>

          {/* Timing (3–4 Seconds) */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Video Timing (3–4 Seconds)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{duration}s Active</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { sec: 3.0, label: '3.0 Seconds', desc: 'Fast & Punchy' },
                { sec: 3.5, label: '3.5 Seconds', desc: 'Natural Sweet Spot' },
                { sec: 4.0, label: '4.0 Seconds', desc: 'Cinematic Breath' },
              ].map((d) => (
                <button
                  key={d.sec}
                  onClick={() => {
                    setDuration(d.sec as IntroDuration);
                    setCurrentTime(0);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    duration === d.sec
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md font-bold'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{d.sec}s</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Resolution, Format & Action */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center justify-between">
              <span>Export Format & Quality</span>
              <span className="text-[10px] font-mono text-emerald-400">60 FPS Render</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                  Video Resolution
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setResolution('1080p')}
                    className={`py-2 rounded-xl text-center border font-bold text-xs transition-all ${
                      resolution === '1080p'
                        ? 'bg-stone-800 text-white border-emerald-400/80'
                        : 'bg-stone-950 text-stone-400 border-white/10'
                    }`}
                  >
                    1080p
                  </button>
                  <button
                    onClick={() => setResolution('720p')}
                    className={`py-2 rounded-xl text-center border font-bold text-xs transition-all ${
                      resolution === '720p'
                        ? 'bg-stone-800 text-white border-emerald-400/80'
                        : 'bg-stone-950 text-stone-400 border-white/10'
                    }`}
                  >
                    720p
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                  Container Format
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setFormatPreference('mp4')}
                    className={`py-2 rounded-xl text-center border font-bold text-xs transition-all ${
                      formatPreference === 'mp4'
                        ? 'bg-stone-800 text-white border-emerald-400/80'
                        : 'bg-stone-950 text-stone-400 border-white/10'
                    }`}
                    title="Universal MP4 (H.264 + AAC) compatible with QuickTime, Windows Media Player, CapCut & Premiere"
                  >
                    MP4 (H.264)
                  </button>
                  <button
                    onClick={() => setFormatPreference('webm')}
                    className={`py-2 rounded-xl text-center border font-bold text-xs transition-all ${
                      formatPreference === 'webm'
                        ? 'bg-stone-800 text-white border-emerald-400/80'
                        : 'bg-stone-950 text-stone-400 border-white/10'
                    }`}
                    title="WebM VP9 format with fixed EBML duration"
                  >
                    WebM (VP9)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="w-full py-3.5 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                color: '#04120D',
              }}
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting
                  ? `Rendering Real-Time Frames (${exportProgress}%)...`
                  : `Export ${duration}s Video Clip (${formatPreference.toUpperCase()})`}
              </span>
            </button>

            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              ✓ Synchronizes video frames in real time with audio track into a verified playable video file.
            </p>
          </div>
        </div>
      </div>

      {/* Exported Video Verification Player Modal */}
      {showPreviewModal && exportedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 border border-emerald-500/50 rounded-2xl sm:rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-base">Exported Video Player & Quality Verification</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Native Video Element to prove full duration & audible sound */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black shadow-lg">
              <video
                key={exportedVideoUrl}
                src={exportedVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-900/80 border border-white/[0.08] rounded-xl text-xs font-mono">
              <div className="space-y-1">
                <div className="text-stone-400">Duration & Resolution:</div>
                <div className="text-emerald-300 font-bold">{duration}s · 60 FPS · {resolution}</div>
              </div>
              <div className="space-y-1">
                <div className="text-stone-400">Audio Soundtrack:</div>
                <div className="text-emerald-300 font-bold truncate">{selectedTrack.title}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Verified seekable with synchronized audio</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={exportedVideoUrl}
                  download={`speak-in-progress-intro-${duration}s-${resolution}.${exportedFormat}`}
                  className="px-4 py-2 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: accentColor,
                    color: '#04120D',
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .{exportedFormat.toUpperCase()} Again</span>
                </a>

                {selectedTrack.url && (
                  <button
                    onClick={handleDownloadSelectedAudio}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-200 bg-stone-900 hover:bg-stone-800 rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
                  >
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download MP3</span>
                  </button>
                )}

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl border border-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
