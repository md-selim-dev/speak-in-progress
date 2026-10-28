/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrandIdentity } from '../types';
import { LogoMark } from './LogoMark';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Film,
  CheckCircle2,
  Layers,
  Sliders,
  Tv,
  Check,
  Share2,
  Type,
} from 'lucide-react';

interface VideoIntroStudioProps {
  activeBrand: BrandIdentity;
}

export type IntroSoundProfile = 'natural-chime' | 'warm-wood' | 'zen-harmonic' | 'subtle-breath';
export type IntroDuration = 3.0 | 3.5 | 4.0;
export type IntroResolution = '1080p' | '720p';
export type IntroTextScale = 'cinematic' | 'mega' | 'large';

export const VideoIntroStudio: React.FC<VideoIntroStudioProps> = ({ activeBrand }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<IntroDuration>(3.5);
  const [soundProfile, setSoundProfile] = useState<IntroSoundProfile>('natural-chime');
  const [textScale, setTextScale] = useState<IntroTextScale>('cinematic');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [resolution, setResolution] = useState<IntroResolution>('1080p');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>(activeBrand.colors.accent.hex || '#10B981');

  // Preview Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sync accent color with brand
  useEffect(() => {
    if (activeBrand.colors?.accent?.hex) {
      setAccentColor(activeBrand.colors.accent.hex);
    }
  }, [activeBrand]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio API: Generate Natural, Organic Sound Design for the 3-4s Intro
  const playSoundtrack = (dest?: AudioNode, customDuration: number = duration) => {
    if (isMuted && !dest) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted && !dest ? 0 : 0.75, ctx.currentTime);

      if (dest) {
        masterGain.connect(dest);
      } else {
        masterGain.connect(ctx.destination);
      }

      const t0 = ctx.currentTime;

      // --- 1. Soft Natural Breath / Air Whoosh (0.0s - 1.2s) ---
      // Filtered white noise with low-pass sweep
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
      noiseGain.gain.linearRampToValueAtTime(0.22, t0 + 0.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.3);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start(t0);

      // --- 2. Deep Grounding Root Tone (Organic Warmth, 110Hz A2) ---
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, t0);
      subOsc.frequency.exponentialRampToValueAtTime(108, t0 + customDuration);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.001, t0);
      subGain.gain.linearRampToValueAtTime(0.25, t0 + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, t0 + customDuration - 0.2);

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(t0);
      subOsc.stop(t0 + customDuration);

      // --- 3. Organic Harmonic Chime (Resolves at 1.0s - 2.8s) ---
      // Harmonic chords based on profile
      let frequencies = [528, 660, 792, 1056]; // 528Hz Solfeggio / Natural Emerald Resonance
      if (soundProfile === 'warm-wood') {
        frequencies = [440, 554.37, 659.25, 880]; // A major warmth
      } else if (soundProfile === 'zen-harmonic') {
        frequencies = [396, 528, 639, 852]; // Ambient harmonic
      } else if (soundProfile === 'subtle-breath') {
        frequencies = [528, 792]; // Minimalist
      }

      frequencies.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        chimeOsc.type = idx === 0 ? 'sine' : 'triangle';
        chimeOsc.frequency.setValueAtTime(freq, t0 + 0.7);

        const chimeGain = ctx.createGain();
        const startTime = t0 + 0.7 + idx * 0.08;
        chimeGain.gain.setValueAtTime(0.0001, startTime);
        chimeGain.gain.linearRampToValueAtTime(0.18 / (idx + 1), startTime + 0.05);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.0);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);
        chimeOsc.start(startTime);
        chimeOsc.stop(startTime + 2.2);
      });

      // --- 4. Acoustic Settle / Wooden Click at 2.2s (Tagline Lock) ---
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(320, t0 + 2.15);
      clickOsc.frequency.exponentialRampToValueAtTime(80, t0 + 2.3);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.0001, t0 + 2.15);
      clickGain.gain.linearRampToValueAtTime(0.12, t0 + 2.17);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);

      clickOsc.connect(clickGain);
      clickGain.connect(masterGain);
      clickOsc.start(t0 + 2.15);
      clickOsc.stop(t0 + 2.45);
    } catch (e) {
      console.warn('Audio playback not supported or blocked:', e);
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
      // Ambient bloom expands and breathes
      const bloomIntensity = Math.sin(progress * Math.PI) * 0.4 + 0.15;
      bgGrad.addColorStop(0, '#061914');
      bgGrad.addColorStop(0.4, '#030E0B');
      bgGrad.addColorStop(1, '#020504');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle Emerald Spark central flare
      const flareRadius = (220 + Math.sin(progress * Math.PI) * 160) * scale;
      const flareGrad = ctx.createRadialGradient(W / 2, H * 0.35, 10 * scale, W / 2, H * 0.35, flareRadius);
      flareGrad.addColorStop(0, `${accentColor}${Math.floor(bloomIntensity * 255).toString(16).padStart(2, '0')}`);
      flareGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, W, H);

      // Acoustic Soundwave Circles (Expanding Ripples)
      if (t > 0.4) {
        const rippleProgress = (t - 0.4) / (totalDur - 0.4);
        [1, 2, 3].forEach((rIndex) => {
          const rProg = (rippleProgress * 1.5 - rIndex * 0.2 + 1) % 1;
          const rRadius = (170 + rProg * 480) * scale;
          const rAlpha = Math.max(0, (1 - rProg) * 0.2);
          ctx.save();
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = rAlpha;
          ctx.lineWidth = 1.5 * scale;
          ctx.beginPath();
          ctx.arc(W / 2, H * 0.35, rRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });
      }

      // --- Vector Logo Branding Animation (0.0s - 3.5s) ---
      // Logo Animation Easing:
      // 0.0 - 1.2s: S-P Ribbon flows & scales in with spring ease
      // 1.2 - 2.2s: Acoustic Bars vibrate & pulse
      // 2.2 - 3.5s: Settles smoothly with glowing halo
      const logoIntroT = Math.min(t / 1.0, 1.0);
      const easeLogo = 1 - Math.pow(1 - logoIntroT, 3); // Cubic ease-out

      const logoSize = 160 * scale * (0.85 + 0.15 * easeLogo);
      const logoX = W / 2 - logoSize / 2;
      const logoY = H * 0.35 - logoSize / 2;

      ctx.save();
      ctx.translate(logoX, logoY);
      const logoScale = logoSize / 100;
      ctx.scale(logoScale, logoScale);

      // Glow behind logo
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 30 * scale * (0.5 + Math.sin(t * 3) * 0.5);

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
      // Oscillate with vocal vitality from 0.8s onward
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

      // --- Cinematic Vignette & Border ---
      ctx.save();
      ctx.strokeStyle = `${accentColor}40`;
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(12 * scale, 12 * scale, W - 24 * scale, H - 24 * scale);
      ctx.restore();
    },
    [accentColor, duration, soundProfile, textScale]
  );

  // Animation Loop for live playback
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
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentTime >= duration - 0.05) {
        setCurrentTime(0);
        startTimeRef.current = null;
      }
      playSoundtrack(undefined, duration);
      setIsPlaying(true);
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    setCurrentTime(0);
    startTimeRef.current = null;
    playSoundtrack(undefined, duration);
    setIsPlaying(true);
  };

  // Export 1080p WebM / MP4 Video with synchronized Audio
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsPlaying(false);

    try {
      const exportCanvas = document.createElement('canvas');
      const W = resolution === '1080p' ? 1920 : 1280;
      const H = resolution === '1080p' ? 1080 : 720;
      exportCanvas.width = W;
      exportCanvas.height = H;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const dest = audioCtx.createMediaStreamDestination();

      // Trigger synchronized audio
      playSoundtrack(dest, duration);

      // Create combined media stream (60fps canvas + web audio)
      const canvasStream = exportCanvas.captureStream(60);
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ];
      const combinedStream = new MediaStream(combinedTracks);

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType, videoBitsPerSecond: 10000000 } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const totalFrames = Math.floor(duration * 60);
      let currentFrame = 0;

      recorder.start();

      const recordInterval = setInterval(() => {
        currentFrame++;
        const frameTime = (currentFrame / totalFrames) * duration;
        renderFrame(exportCanvas, frameTime, duration);
        setExportProgress(Math.floor((currentFrame / totalFrames) * 100));

        if (currentFrame >= totalFrames) {
          clearInterval(recordInterval);
          setTimeout(() => {
            recorder.stop();
          }, 200);
        }
      }, 1000 / 60);

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `speak-in-progress-intro-${duration}s-${resolution}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        audioCtx.close().catch(() => {});
        setIsExporting(false);
        setDownloadSuccess(`Exported ${duration}s Intro Video (${resolution})`);
        setTimeout(() => setDownloadSuccess(null), 4000);
      };
    } catch (err) {
      console.error('Video export error:', err);
      setIsExporting(false);
    }
  };

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
              Smooth, high-definition 60fps logo branding video intro (3–4 seconds) featuring your unboxed Speak in Progress monogram, animated acoustic soundwaves, and natural organic harmonic sound design.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
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
              className="px-5 py-2.5 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              style={{
                backgroundColor: accentColor,
                color: '#04120D',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isExporting ? `Rendering Video ${exportProgress}%...` : `Download Video (${duration}s ${resolution})`}
              </span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{downloadSuccess}! Drop this clip directly into your video editor before each speaking session.</span>
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

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 bg-stone-800 text-stone-300 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isMuted ? 'Muted' : 'Natural Audio On'}</span>
            </button>
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
          <div className="flex items-center justify-between p-4 bg-stone-900/60 border border-white/[0.08] rounded-2xl text-xs">
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

            <div className="text-stone-400 font-mono text-[11px]">
              60 FPS · 1080P MASTER · NATURAL 528HZ CHIME
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Duration Selector (3.0s, 3.5s, 4.0s) */}
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

            <p className="text-[11px] text-stone-400 leading-relaxed">
              💡 <strong>YouTube Retention Pro Tip:</strong> 3.5 seconds is the industry gold standard for intro bumpers—long enough to anchor your identity, short enough to maintain 98%+ viewer retention!
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
              ✓ Enlarged font size with high-contrast dual-tone rendering: <strong>SPEAK IN</strong> in crisp white and <strong>PROGRESS</strong> in glowing Emerald Spark.
            </p>
          </div>

          {/* Natural Sound Design Profile */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Natural Sound Profiles</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Organic Synthesis</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'natural-chime',
                  title: 'Natural 528Hz Acoustic Chime',
                  desc: 'Gentle organic chime with breath whoosh & low room warmth (Recommended)',
                },
                {
                  id: 'warm-wood',
                  title: 'Warm Wooden Mallet Resonance',
                  desc: 'Organic wood acoustic chime with physical tactile settle',
                },
                {
                  id: 'zen-harmonic',
                  title: 'Zen Ambient Sound Bowl',
                  desc: 'Soft sustained harmonic chord with spacious acoustic decay',
                },
                {
                  id: 'subtle-breath',
                  title: 'Minimalist Air & Settle',
                  desc: 'Soft air glide and gentle acoustic lock with zero loud distraction',
                },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSoundProfile(s.id as IntroSoundProfile);
                    playSoundtrack(undefined, duration);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                    soundProfile === s.id
                      ? 'bg-stone-800 text-white border-emerald-400/80 shadow-md font-semibold'
                      : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-[11px]">{s.title}</div>
                    <div className="text-[10px] text-stone-400">{s.desc}</div>
                  </div>
                  {soundProfile === s.id && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Export Resolution & Quick Actions */}
          <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 space-y-4 shadow-card-elevated">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center justify-between">
              <span>Export Specifications</span>
              <span className="text-[10px] font-mono text-emerald-400">WebM / MP4 Ready</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setResolution('1080p')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  resolution === '1080p'
                    ? 'bg-stone-800 text-white border-emerald-400/80 font-bold shadow-md'
                    : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                }`}
              >
                <div className="font-bold">1080p Full HD</div>
                <div className="text-[10px] text-stone-400 mt-0.5">1920×1080 · 60 FPS</div>
              </button>

              <button
                onClick={() => setResolution('720p')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  resolution === '720p'
                    ? 'bg-stone-800 text-white border-emerald-400/80 font-bold shadow-md'
                    : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                }`}
              >
                <div className="font-bold">720p HD</div>
                <div className="text-[10px] text-stone-400 mt-0.5">1280×720 · Lightweight</div>
              </button>
            </div>

            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="w-full py-3 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              style={{
                backgroundColor: accentColor,
                color: '#04120D',
              }}
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting ? `Rendering Video ${exportProgress}%...` : `Export ${duration}s Video Clip (with Natural Sound)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
