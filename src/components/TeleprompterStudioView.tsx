/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrandIdentity, PracticeStory, ReflectionEntry } from '../types';
import { SAMPLE_STORIES } from '../data/sampleStories';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Mic,
  Square,
  Volume2,
  CheckCircle,
  EyeOff,
  Eye,
  Type,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  HelpCircle,
  Keyboard,
  Download,
  BookOpen,
  Monitor,
  CheckSquare,
  Sliders,
  Sparkles,
  RefreshCw,
  X,
  Clock,
  Radio,
  Info,
} from 'lucide-react';

interface TeleprompterStudioViewProps {
  activeBrand: BrandIdentity;
}

export const TeleprompterStudioView: React.FC<TeleprompterStudioViewProps> = ({ activeBrand }) => {
  // --- Stories State (Sample + Custom User Stories) ---
  const [customStories, setCustomStories] = useState<PracticeStory[]>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_custom_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allStories = useMemo(() => {
    return [...SAMPLE_STORIES, ...customStories];
  }, [customStories]);

  const [selectedStory, setSelectedStory] = useState<PracticeStory>(allStories[0]);

  // Stage Navigation
  const [currentStage, setCurrentStage] = useState<'intro' | 'story' | 'expressions' | 'retelling' | 'log'>('story');

  // Prompter Mode: 'focus' (Paragraph-by-Paragraph) vs 'scroll' (Smooth Continuous Auto-Scroll)
  const [prompterMode, setPrompterMode] = useState<'focus' | 'scroll'>('focus');
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);

  // Reading Settings
  const [fontSize, setFontSize] = useState<number>(22);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(32); // pixels per sec
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);
  const [showReadingBeam, setShowReadingBeam] = useState<boolean>(true);

  // Stopwatch Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Retelling Interactive Mode
  const [revealStoryInRetelling, setRevealStoryInRetelling] = useState<boolean>(false);
  const [peekCountdown, setPeekCountdown] = useState<number | null>(null);
  const [checkedAnchors, setCheckedAnchors] = useState<Record<number, boolean>>({});
  const [retellingTargetSeconds, setRetellingTargetSeconds] = useState<number>(90);

  // Microphone Audio Practice Recorder
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioTimerRef = useRef<any>(null);
  const teleprompterContainerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Modals & Panels
  const [showHowToUseModal, setShowHowToUseModal] = useState<boolean>(false);
  const [howToUseTab, setHowToUseTab] = useState<'workflow' | 'obs' | 'speaking' | 'shortcuts'>('workflow');
  const [showAddStoryModal, setShowAddStoryModal] = useState<boolean>(false);
  const [addStoryError, setAddStoryError] = useState<string | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [showShortcutsBar, setShowShortcutsBar] = useState<boolean>(false);

  // Custom Story Creator Form State
  const [newDayNum, setNewDayNum] = useState<number>(allStories.length + 1);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newFocusSkill, setNewFocusSkill] = useState<string>('Natural linking & past tense flow');
  const [newStoryRawText, setNewStoryRawText] = useState<string>('');
  const [newPhrases, setNewPhrases] = useState([
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
  ]);
  const [newAnchorsRaw, setNewAnchorsRaw] = useState<string>('');

  // Private Reflection Log State
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_reflections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentRating, setCurrentRating] = useState<number>(3);
  const [stumbleNotes, setStumbleNotes] = useState<string>('');
  const [winNotes, setWinNotes] = useState<string>('');
  const [nextFocusNotes, setNextFocusNotes] = useState<string>('');
  const [savedLogSuccess, setSavedLogSuccess] = useState<boolean>(false);

  // Auto-scroll loop for Continuous Scroll mode
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const scrollStep = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (teleprompterContainerRef.current && isAutoScrolling && prompterMode === 'scroll') {
        teleprompterContainerRef.current.scrollTop += scrollSpeed * delta;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    if (isAutoScrolling && prompterMode === 'scroll') {
      animationFrameId = requestAnimationFrame(scrollStep);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling, scrollSpeed, prompterMode]);

  // Stopwatch timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Peek Countdown Timer (auto-hides after 5s to encourage speaking from memory)
  useEffect(() => {
    let timer: any = null;
    if (peekCountdown !== null && peekCountdown > 0) {
      timer = setTimeout(() => {
        setPeekCountdown((prev) => (prev ? prev - 1 : null));
      }, 1000);
    } else if (peekCountdown === 0) {
      setRevealStoryInRetelling(false);
      setPeekCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [peekCountdown]);

  // Clean teardown of microphone media stream and timers on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
      }
    };
  }, []);

  // Smooth scroll into view when changing active paragraph in Focus mode
  useEffect(() => {
    if (prompterMode === 'focus' && paragraphRefs.current[activeParagraphIndex]) {
      paragraphRefs.current[activeParagraphIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeParagraphIndex, prompterMode]);

  // Keyboard Navigation Handler (Global Hotkeys for Recording with OBS)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in form inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (currentStage === 'story') {
          if (prompterMode === 'scroll') {
            setIsAutoScrolling((prev) => !prev);
          } else {
            // Next paragraph in focus mode
            setActiveParagraphIndex((prev) =>
              prev < selectedStory.storyParagraphs.length - 1 ? prev + 1 : 0
            );
          }
        } else {
          // Toggle timer in other stages
          setIsTimerRunning((prev) => !prev);
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyJ') {
        if (currentStage === 'story') {
          if (prompterMode === 'focus') {
            e.preventDefault();
            setActiveParagraphIndex((prev) =>
              Math.min(selectedStory.storyParagraphs.length - 1, prev + 1)
            );
          } else {
            // increase scroll speed slightly
            setScrollSpeed((s) => Math.min(80, s + 5));
          }
        }
      } else if (e.code === 'ArrowUp' || e.code === 'KeyK') {
        if (currentStage === 'story') {
          if (prompterMode === 'focus') {
            e.preventDefault();
            setActiveParagraphIndex((prev) => Math.max(0, prev - 1));
          } else {
            // decrease scroll speed
            setScrollSpeed((s) => Math.max(15, s - 5));
          }
        }
      } else if (e.code === 'KeyF') {
        // Toggle OBS Clean Mode
        e.preventDefault();
        setIsCleanMode((prev) => !prev);
      } else if (e.code === 'KeyR') {
        // Reset timer
        e.preventDefault();
        setTimerSeconds(0);
        setIsTimerRunning(false);
      } else if (e.code === 'BracketRight') {
        // Next stage
        e.preventDefault();
        advanceStage(1);
      } else if (e.code === 'BracketLeft') {
        // Prev stage
        e.preventDefault();
        advanceStage(-1);
      } else if (e.code === 'Slash' && e.shiftKey) {
        // '?' key
        e.preventDefault();
        setShowHowToUseModal(true);
        setHowToUseTab('shortcuts');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, prompterMode, selectedStory.storyParagraphs.length]);

  const stagesList = ['intro', 'story', 'expressions', 'retelling', 'log'] as const;

  const advanceStage = (dir: 1 | -1) => {
    const curIdx = stagesList.indexOf(currentStage);
    const nextIdx = Math.max(0, Math.min(stagesList.length - 1, curIdx + dir));
    setCurrentStage(stagesList[nextIdx]);
    if (stagesList[nextIdx] === 'story') {
      setActiveParagraphIndex(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Word count and estimated WPM
  const storyWordCount = useMemo(() => {
    return selectedStory.storyParagraphs.join(' ').split(/\s+/).filter(Boolean).length;
  }, [selectedStory]);

  // Audio Practice Recorder
  const startAudioRecording = async () => {
    setMicNotice(null);
    try {
      if (!navigator?.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        setMicNotice('In-browser mic recording is not supported in this environment. OBS Studio will record your voice directly!');
        return;
      }

      // Check available devices if enumerateDevices is supported
      if (typeof navigator.mediaDevices.enumerateDevices === 'function') {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioInputs = devices.filter((d) => d.kind === 'audioinput');
          if (devices.length > 0 && audioInputs.length === 0) {
            setMicNotice('No microphone found on this device. (OBS Studio captures your USB/headset mic directly for YouTube!)');
            return;
          }
        } catch {
          // If enumerateDevices fails or is restricted, proceed to getUserMedia
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setAudioDuration(0);
      audioTimerRef.current = setInterval(() => {
        setAudioDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      // Gracefully handle device missing or permission denial without console.error or window.alert
      const errName = err?.name || '';
      const errMsg = (err?.message || '').toLowerCase();
      if (errName === 'NotFoundError' || errMsg.includes('device not found') || errMsg.includes('requested device')) {
        setMicNotice('No microphone detected in browser. (Tip: OBS Studio records your microphone independently, so browser mic is not required!)');
      } else if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setMicNotice('Microphone permission was denied. (You can still record your screen with OBS Studio!)');
      } else {
        setMicNotice('Microphone rehearsal is unavailable. OBS Studio captures your external mic directly during video recording.');
      }
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecordingAudio(false);
      clearInterval(audioTimerRef.current);
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const downloadAudioRecording = () => {
    if (!audioBlob) return;
    const a = document.createElement('a');
    const blobUrl = URL.createObjectURL(audioBlob);
    a.href = blobUrl;
    a.download = `SpeakInProgress-Session-${selectedStory.day}-Practice.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  const triggerPeek = () => {
    setRevealStoryInRetelling(true);
    setPeekCountdown(5);
  };

  const toggleAnchorCheck = (idx: number) => {
    setCheckedAnchors((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSaveCustomStory = () => {
    setAddStoryError(null);
    if (!newTitle.trim() || !newStoryRawText.trim()) {
      setAddStoryError('Please enter at least a Story Title and Story Text to save.');
      return;
    }

    const paras = newStoryRawText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const anchorList = newAnchorsRaw.trim()
      ? newAnchorsRaw
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean)
      : paras.map((p, i) => `Point ${i + 1}: ${p.slice(0, 50)}...`);

    const validPhrases = newPhrases.filter((p) => p.phrase.trim().length > 0);
    const finalPhrases =
      validPhrases.length > 0
        ? validPhrases
        : [
            {
              phrase: 'take for granted',
              meaning: 'To fail to appreciate something because one is overly familiar with it.',
              example: 'I used to take quiet morning hours for granted.',
              speakingTip: 'Link "take" and "for" smoothly.',
            },
            {
              phrase: 'step out of comfort zone',
              meaning: 'To do things you are not used to doing.',
              example: 'Speaking English publicly forced me to step out of my comfort zone.',
              speakingTip: 'Emphasize "comfort zone" with steady pacing.',
            },
            {
              phrase: 'stick with it',
              meaning: 'To continue doing something despite difficulties.',
              example: 'If you stick with it daily, fluency will follow naturally.',
              speakingTip: 'Keep "stick with" crisp without hesitation.',
            },
          ];

    const newStory: PracticeStory = {
      id: `custom-story-${Date.now()}`,
      day: newDayNum,
      title: newTitle.trim(),
      focusSkill: newFocusSkill.trim() || 'Natural pacing and pronunciation',
      estimatedReadTime: `${Math.max(1, Math.ceil(paras.join(' ').split(/\s+/).length / 130))} min`,
      storyParagraphs: paras,
      usefulExpressions: finalPhrases,
      retellingPrompts: anchorList,
      reflectionPrompts: [
        'Did I speak from memory during retelling?',
        'Where was my pace most natural?',
        'What vocabulary word would I like to use again tomorrow?',
      ],
    };

    const updated = [...customStories, newStory];
    setCustomStories(updated);
    try {
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setSelectedStory(newStory);
    setShowAddStoryModal(false);
    setAddStoryError(null);
    // Reset form
    setNewTitle('');
    setNewStoryRawText('');
    setNewAnchorsRaw('');
  };

  const handleDeleteCustomStory = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStoryToDelete(storyId);
  };

  const confirmDeleteCustomStory = (storyId: string) => {
    const updated = customStories.filter((s) => s.id !== storyId);
    setCustomStories(updated);
    try {
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSelectedStory(SAMPLE_STORIES[0]);
    setStoryToDelete(null);
  };

  const handleSaveReflection = () => {
    const entry: ReflectionEntry = {
      day: selectedStory.day,
      storyTitle: selectedStory.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scriptIndependenceRating: currentRating,
      stumbleMoments: stumbleNotes || 'None noted.',
      winOfTheDay: winNotes || 'Kept speaking without restarting the video.',
      nextFocus: nextFocusNotes || 'Focus on continuous pacing and fewer filler words.',
    };

    const updated = [entry, ...reflections.filter((r) => r.day !== selectedStory.day)];
    setReflections(updated);
    try {
      localStorage.setItem('speak_in_progress_reflections', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSavedLogSuccess(true);
    setTimeout(() => setSavedLogSuccess(false), 2500);
  };

  return (
    <div className={`space-y-6 sm:space-y-8 ${isCleanMode ? 'bg-stone-950 min-h-screen p-3 sm:p-8' : ''}`}>
      {/* Studio Header (hidden in OBS Clean Mode) */}
      {!isCleanMode && (
        <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-9 shadow-card-elevated backdrop-blur-xl transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/[0.08]">
            <div className="space-y-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
                style={{
                  color: activeBrand.colors.accent.hex,
                  backgroundColor: `${activeBrand.colors.accent.hex}15`,
                  borderColor: `${activeBrand.colors.accent.hex}35`,
                }}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: activeBrand.colors.accent.hex }} />
                <span>Faceless PC Recording Studio · OBS Optimized</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-brand flex items-center gap-3">
                <span>Teleprompter Studio</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-lg border font-mono font-bold"
                  style={{
                    color: activeBrand.colors.accent.hex,
                    backgroundColor: `${activeBrand.colors.accent.hex}18`,
                    borderColor: `${activeBrand.colors.accent.hex}35`,
                  }}
                >
                  v2.0 Pro
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Record your faceless English speaking videos with effortless confidence. Read smoothly, rehearse without pressure, and retell in your own words at your own pace.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch sm:self-start lg:self-center">
              <button
                onClick={() => setShowHowToUseModal(true)}
                className="px-4 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center gap-2"
                title="View recording steps and OBS setup"
              >
                <HelpCircle className="w-4 h-4" style={{ color: activeBrand.colors.accent.hex }} />
                <span>How to Use Properly</span>
              </button>

              <button
                onClick={() => setShowShortcutsBar(!showShortcutsBar)}
                className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5"
                style={
                  showShortcutsBar
                    ? {
                        backgroundColor: `${activeBrand.colors.accent.hex}20`,
                        color: activeBrand.colors.accent.hex,
                        borderColor: `${activeBrand.colors.accent.hex}50`,
                      }
                    : undefined
                }
                title="Toggle keyboard shortcut hints"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shortcuts</span>
              </button>

              <button
                onClick={() => setIsCleanMode(true)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-2"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: '#061210',
                }}
                title="Press 'F' anytime to toggle clean OBS view"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>OBS Clean Mode (F)</span>
              </button>
            </div>
          </div>

          {/* Collapsible Keyboard Shortcuts HUD */}
          {showShortcutsBar && (
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-950/80 border border-white/10 text-xs text-stone-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-fade-in font-mono">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded bg-stone-800 border border-white/10" style={{ color: activeBrand.colors.accent.hex }}>Space</kbd>
                <span className="text-[11px] text-stone-400">Play/Pause or Next Para</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded bg-stone-800 border border-white/10" style={{ color: activeBrand.colors.accent.hex }}>↓ / ↑</kbd>
                <span className="text-[11px] text-stone-400">Next / Prev Paragraph</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded bg-stone-800 border border-white/10" style={{ color: activeBrand.colors.accent.hex }}>[ / ]</kbd>
                <span className="text-[11px] text-stone-400">Prev / Next Stage</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded bg-stone-800 border border-white/10" style={{ color: activeBrand.colors.accent.hex }}>F</kbd>
                <span className="text-[11px] text-stone-400">Clean Screen Mode</span>
              </div>
            </div>
          )}

          {/* Story Selector Bar & Add Story Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0">
                Practice Session:
              </span>
              <div className="flex items-center gap-2">
                {allStories.map((s) => {
                  const isSelected = s.id === selectedStory.id;
                  const isCustom = s.id.startsWith('custom-');
                  return (
                    <div key={s.id} className="relative group shrink-0">
                      <button
                        onClick={() => {
                          setSelectedStory(s);
                          setActiveParagraphIndex(0);
                          setTimerSeconds(0);
                          setIsTimerRunning(false);
                          setIsAutoScrolling(false);
                          setAudioURL(null);
                          setCheckedAnchors({});
                        }}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium rounded-xl border transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? 'font-bold shadow-md'
                            : 'bg-stone-950 text-stone-400 border-white/[0.06] hover:text-white'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: activeBrand.colors.accent.hex,
                                color: '#061210',
                                borderColor: activeBrand.colors.accent.hex,
                              }
                            : undefined
                        }
                      >
                        {isCustom && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        <span>
                          Day {s.day < 10 ? `0${s.day}` : s.day} · {s.title}
                        </span>
                      </button>

                      {isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomStory(s.id, e)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Delete custom story"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Story Trigger */}
            <button
              onClick={() => {
                setNewDayNum(allStories.length + 1);
                setShowAddStoryModal(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Your Story</span>
            </button>
          </div>
        </section>
      )}

      {/* Floating Exit & Quick Controls in Clean Mode */}
      {isCleanMode && (
        <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 bg-stone-900/90 border border-white/15 p-1.5 sm:p-2 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-1.5 px-2 text-xs font-mono" style={{ color: activeBrand.colors.accent.hex }}>
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="hidden sm:inline">OBS Recording</span>
            <span className="text-white font-bold">{formatTime(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsCleanMode(false)}
            className="px-3 py-1.5 text-xs font-bold text-stone-900 bg-white hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit (F)</span>
          </button>
        </div>
      )}

      {/* Main Teleprompter Frame */}
      <div className="bg-stone-950 border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all">
        {/* Navigation & Teleprompter Controls Bar */}
        <div className="bg-stone-900/80 border-b border-white/[0.08] px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 backdrop-blur-md">
          {/* Practice Stages: 1 to 5 */}
          <div className="flex items-center gap-1 bg-stone-950/90 p-1 rounded-xl border border-white/10 text-xs font-semibold shadow-badge-inset overflow-x-auto max-w-full">
            {[
              { id: 'intro', label: '1. Intro' },
              { id: 'story', label: '2. Story Reading' },
              { id: 'expressions', label: '3. Expressions' },
              { id: 'retelling', label: '4. Retelling' },
              { id: 'log', label: '5. Private Log' },
            ].map((stage) => {
              const isActive = currentStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setCurrentStage(stage.id as any);
                    if (stage.id === 'story') setActiveParagraphIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'font-bold shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: '#061210',
                        }
                      : undefined
                  }
                >
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stage Controls & Reading Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 sm:gap-3 text-xs">
            {/* Stopwatch Timer with Live Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 shadow-badge-inset">
              <Clock className="w-3 h-3" style={{ color: activeBrand.colors.accent.hex }} />
              <span className="font-mono font-bold" style={{ color: activeBrand.colors.accent.hex }}>{formatTime(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-stone-400 hover:text-white p-0.5 ml-0.5"
                title={isTimerRunning ? 'Pause Timer (Space)' : 'Start Timer (Space)'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="text-stone-500 hover:text-stone-300 p-0.5"
                title="Reset Timer (R)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Mode Selector (Only on Story Stage) */}
            {currentStage === 'story' && (
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-white/10 text-[11px] font-semibold">
                <button
                  onClick={() => {
                    setPrompterMode('focus');
                    setIsAutoScrolling(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    prompterMode === 'focus'
                      ? 'font-bold shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  style={
                    prompterMode === 'focus'
                      ? {
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: '#061210',
                        }
                      : undefined
                  }
                  title="Paragraph-by-paragraph with beam focus (Recommended for natural speaking)"
                >
                  Focus Beam
                </button>
                <button
                  onClick={() => setPrompterMode('scroll')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    prompterMode === 'scroll'
                      ? 'font-bold shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  style={
                    prompterMode === 'scroll'
                      ? {
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: '#061210',
                        }
                      : undefined
                  }
                  title="Continuous smooth scrolling"
                >
                  Auto-Scroll
                </button>
              </div>
            )}

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-stone-950 px-2 sm:px-2.5 py-1.5 rounded-xl border border-white/10 text-stone-400 shadow-badge-inset">
              <Type className="w-3.5 h-3.5 hidden sm:inline" />
              <button
                onClick={() => setFontSize((f) => Math.max(16, f - 2))}
                className="px-1.5 hover:text-white font-mono"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="font-mono text-[10px] sm:text-[11px] text-stone-300">{fontSize}px</span>
              <button
                onClick={() => setFontSize((f) => Math.min(36, f + 2))}
                className="px-1.5 hover:text-white font-mono"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Auto-Scroll Speed or Focus Controls */}
            {currentStage === 'story' && prompterMode === 'scroll' && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-badge-inset">
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className="flex items-center gap-1 font-semibold transition-colors"
                  style={{ color: isAutoScrolling ? activeBrand.colors.accent.hex : undefined }}
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoScrolling ? 'Pause' : 'Scroll'}</span>
                </button>
                <input
                  type="range"
                  min="15"
                  max="70"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                  className="w-14 sm:w-16 h-1 bg-stone-800 rounded accent-emerald-400 cursor-pointer hidden sm:block"
                  title={`Speed: ${scrollSpeed} px/s (~${Math.round(scrollSpeed * 3.5)} WPM)`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Teleprompter Viewport */}
        <div
          ref={teleprompterContainerRef}
          className="p-5 sm:p-8 md:p-12 min-h-[440px] max-h-[640px] overflow-y-auto space-y-6 sm:space-y-8 select-text relative scroll-smooth"
          style={{ backgroundColor: activeBrand.colors.primary.hex }}
        >
          {/* Subtle Horizontal Eye-line Center Guide (in Auto-Scroll mode) */}
          {currentStage === 'story' && prompterMode === 'scroll' && showReadingBeam && (
            <div
              className="pointer-events-none sticky top-1/2 -translate-y-1/2 left-0 right-0 z-10 flex items-center justify-between px-2 opacity-40 border-y border-dashed py-3"
              style={{ borderColor: activeBrand.colors.accent.hex }}
            >
              <span className="text-[10px] font-mono" style={{ color: activeBrand.colors.accent.hex }}>Reading Eye Line</span>
              <span className="text-[10px] font-mono" style={{ color: activeBrand.colors.accent.hex }}>Keep gaze here</span>
            </div>
          )}

          {/* Document Header on Screen */}
          <div className="border-b border-white/[0.08] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div
                className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase"
                style={{ color: activeBrand.colors.accent.hex }}
              >
                <span>DAY {selectedStory.day < 10 ? `0${selectedStory.day}` : selectedStory.day}</span>
                <span className="text-stone-600">·</span>
                <span>SPEAK IN PROGRESS</span>
                <span className="text-stone-600">·</span>
                <span className="text-stone-300">EPISODE SCRIPT</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1 font-brand">
                {selectedStory.title}
              </h2>
            </div>

            <div className="text-[11px] sm:text-xs font-mono text-stone-400 text-left sm:text-right">
              <div>Est. Read: {selectedStory.estimatedReadTime} ({storyWordCount} words)</div>
              <div className="font-semibold" style={{ color: activeBrand.colors.accent.hex }}>Goal: Unscripted Retelling</div>
            </div>
          </div>

          {/* =========================================
              STAGE 1: INTRODUCTION & SPEAKING FOCUS
              ========================================= */}
          {currentStage === 'intro' && (
            <div className="space-y-6 max-w-3xl">
              <div
                className="bg-stone-900/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-card-elevated border"
                style={{ borderColor: `${activeBrand.colors.accent.hex}40` }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: activeBrand.colors.accent.hex }}
                  >
                    Step 1 · 15-Second Spoken Intro
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">Speak naturally to camera</span>
                </div>

                <div
                  className="text-base sm:text-xl text-stone-100 leading-relaxed font-sans border-l-2 pl-4 py-1"
                  style={{ borderLeftColor: activeBrand.colors.accent.hex }}
                >
                  "Welcome back to <strong>Speak in Progress</strong>. Today is{' '}
                  <strong style={{ color: activeBrand.colors.accent.hex }}>Day {selectedStory.day}</strong> of my speaking journey. Today's
                  story is <em>'{selectedStory.title}'</em>. My focus skill today is{' '}
                  <span className="font-semibold" style={{ color: activeBrand.colors.accent.hex }}>{selectedStory.focusSkill}</span>. Let's jump straight into the story."
                </div>

                <div className="text-xs text-stone-400 pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: activeBrand.colors.accent.hex }} />
                  <span>
                    <strong>Bengali Note:</strong> ভিডিওর শুরুতে দর্শককে স্বাগত জানিয়ে আজকের ফোকাস পরিষ্কারভাবে বলুন।
                  </span>
                </div>
              </div>

              {/* Speaking Objective Box */}
              <div className="bg-stone-900/40 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 space-y-3 shadow-sm">
                <div className="text-xs font-mono font-bold text-stone-400 uppercase">
                  Today's Speaking Objective
                </div>
                <div className="text-xs sm:text-sm text-stone-200 leading-relaxed flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: activeBrand.colors.accent.hex }} />
                  <div>
                    <strong>Focus:</strong> {selectedStory.focusSkill}
                  </div>
                </div>
                <div className="text-[11px] text-stone-400 pl-4">
                  Keep this goal in mind during both story reading and retelling!
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowHowToUseModal(true)}
                  className="text-xs hover:underline flex items-center gap-1 font-mono"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Need help with OBS setup?</span>
                </button>

                <button
                  onClick={() => advanceStage(1)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Proceed to Story Reading</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              STAGE 2: STORY TELEPROMPTER (DUAL MODE)
              ========================================= */}
          {currentStage === 'story' && (
            <div className="space-y-6 sm:space-y-8 max-w-4xl">
              {/* Focus Beam Mode (Paragraph Stepping) */}
              {prompterMode === 'focus' ? (
                <div className="space-y-6">
                  {/* Paragraph Navigator Header */}
                  <div className="flex items-center justify-between bg-stone-900/60 p-3 rounded-xl border border-white/[0.06] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold" style={{ color: activeBrand.colors.accent.hex }}>
                        Paragraph {activeParagraphIndex + 1} of {selectedStory.storyParagraphs.length}
                      </span>
                      <span className="text-stone-500">|</span>
                      <span className="text-stone-400 hidden sm:inline">
                        Use Space or ↓ to advance
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveParagraphIndex((p) => Math.max(0, p - 1))}
                        disabled={activeParagraphIndex === 0}
                        className="px-3 py-1 rounded-lg bg-stone-800 disabled:opacity-40 text-stone-200 hover:bg-stone-700 flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveParagraphIndex((p) =>
                            Math.min(selectedStory.storyParagraphs.length - 1, p + 1)
                          )
                        }
                        disabled={activeParagraphIndex === selectedStory.storyParagraphs.length - 1}
                        className="px-3 py-1 rounded-lg disabled:opacity-40 font-bold flex items-center gap-1 transition-all"
                        style={{
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: '#061210',
                        }}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Paragraphs with active beam highlight */}
                  <div className="space-y-6 sm:space-y-8" style={{ fontSize: `${fontSize}px` }}>
                    {selectedStory.storyParagraphs.map((para, idx) => {
                      const isActive = idx === activeParagraphIndex;
                      return (
                        <p
                          key={idx}
                          ref={(el) => {
                            paragraphRefs.current[idx] = el;
                          }}
                          onClick={() => setActiveParagraphIndex(idx)}
                          className={`leading-relaxed font-sans tracking-wide transition-all duration-300 p-4 sm:p-5 rounded-2xl cursor-pointer ${
                            isActive
                              ? 'text-white border-l-4 shadow-card-elevated font-medium'
                              : 'text-stone-400/70 hover:text-stone-300 hover:bg-white/[0.02] border-l-4 border-transparent'
                          }`}
                          style={
                            isActive
                              ? {
                                  backgroundColor: `${activeBrand.colors.accent.hex}18`,
                                  borderLeftColor: activeBrand.colors.accent.hex,
                                }
                              : undefined
                          }
                        >
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Continuous Auto-Scroll Mode */
                <div className="space-y-5 sm:space-y-7" style={{ fontSize: `${fontSize}px` }}>
                  {selectedStory.storyParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className="text-stone-100 leading-relaxed font-sans tracking-wide transition-all duration-300 hover:text-white"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Bottom Stage Advancement Bar */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-stone-400">
                <button
                  onClick={() => advanceStage(-1)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Intro</span>
                </button>

                <button
                  onClick={() => advanceStage(1)}
                  className="px-4 py-2 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-1.5"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Step 3: 3 Key Expressions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              STAGE 3: 3 KEY USEFUL EXPRESSIONS
              ========================================= */}
          {currentStage === 'expressions' && (
            <div className="space-y-5 max-w-4xl">
              <div className="flex items-center justify-between">
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  Step 3 · Review 3 Spoken Expressions (45s – 1m)
                </div>
                <span className="text-[11px] text-stone-400 font-mono">Explain meaning & example on camera</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {selectedStory.usefulExpressions.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-900/60 border border-white/[0.08] rounded-2xl p-4 sm:p-6 space-y-3 transition-all shadow-card-elevated hover:border-emerald-500/40"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="text-base sm:text-lg font-bold font-mono flex items-center gap-2"
                        style={{ color: activeBrand.colors.accent.hex }}
                      >
                        <span
                          className="w-6 h-6 rounded-lg text-xs flex items-center justify-center border font-bold"
                          style={{
                            backgroundColor: `${activeBrand.colors.accent.hex}25`,
                            color: activeBrand.colors.accent.hex,
                            borderColor: `${activeBrand.colors.accent.hex}40`,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span>"{exp.phrase}"</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono uppercase bg-stone-950 px-2 py-0.5 rounded border border-white/10">
                        High Frequency
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-stone-200">
                      <strong className="text-stone-300">Meaning:</strong> {exp.meaning}
                    </div>

                    <div className="bg-stone-950/80 p-3.5 rounded-xl border border-white/[0.06] text-xs sm:text-sm text-stone-200 italic shadow-badge-inset">
                      "{exp.example}"
                    </div>

                    <div className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                      <Volume2 className="w-3.5 h-3.5 shrink-0" style={{ color: activeBrand.colors.accent.hex }} />
                      <span>
                        <strong style={{ color: activeBrand.colors.accent.hex }}>Speaking Tip:</strong> {exp.speakingTip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => advanceStage(-1)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Story</span>
                </button>
                <button
                  onClick={() => advanceStage(1)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-1.5"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Step 4: Unscripted Retelling</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              STAGE 4: UNSCRIPTED RETELLING (CORE PRACTICE)
              ========================================= */}
          {currentStage === 'retelling' && (
            <div className="space-y-6 max-w-4xl">
              <div
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-card-elevated border"
                style={{
                  backgroundColor: `${activeBrand.colors.accent.hex}12`,
                  borderColor: `${activeBrand.colors.accent.hex}35`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div
                    className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: activeBrand.colors.accent.hex }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Step 4 · Speak Without Script (1 to 2 Minutes)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 5-second Quick Peek Button */}
                    <button
                      onClick={triggerPeek}
                      className="px-3 py-1 text-xs text-stone-300 bg-stone-900/80 hover:bg-stone-800 border border-white/10 rounded-lg flex items-center gap-1.5 transition-all"
                      title="Briefly peek at the original script for 5 seconds"
                    >
                      {peekCountdown !== null ? (
                        <span className="font-mono font-bold" style={{ color: activeBrand.colors.accent.hex }}>Hiding in {peekCountdown}s...</span>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" style={{ color: activeBrand.colors.accent.hex }} />
                          <span>Quick 5s Peek</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setRevealStoryInRetelling(!revealStoryInRetelling)}
                      className="text-xs text-stone-400 hover:text-white flex items-center gap-1 ml-2"
                    >
                      {revealStoryInRetelling ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{revealStoryInRetelling ? 'Hide' : 'Full Script'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  The script is hidden. Retell the story in your own words using the memory anchor clues below. If you stumble, pause, take a breath, and continue. Remember the motto:{' '}
                  <strong style={{ color: activeBrand.colors.accent.hex }}>Progress, not perfection</strong>.
                </p>
              </div>

              {/* Memory Anchor Cues with Interactive Checkboxes */}
              <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-card-elevated">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-stone-400 uppercase">
                    Storyline Memory Anchors (Check off as you mention each)
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {Object.values(checkedAnchors).filter(Boolean).length} / {selectedStory.retellingPrompts.length} mentioned
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStory.retellingPrompts.map((cue, idx) => {
                    const isChecked = !!checkedAnchors[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleAnchorCheck(idx)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-stone-200'
                            : 'bg-stone-950/80 border-white/[0.06] text-stone-300 hover:border-white/20'
                        }`}
                      >
                        <button
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-400 text-stone-950 font-bold'
                              : 'border-stone-600 bg-stone-900'
                          }`}
                        >
                          {isChecked && '✓'}
                        </button>
                        <span className={isChecked ? 'line-through text-stone-400' : ''}>
                          {cue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reveal Full Story if toggled */}
              {revealStoryInRetelling && (
                <div
                  className="bg-stone-900/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xl animate-fade-in border"
                  style={{ borderColor: `${activeBrand.colors.accent.hex}40` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-mono" style={{ color: activeBrand.colors.accent.hex }}>
                      Full Script Preview
                    </span>
                    <button
                      onClick={() => setRevealStoryInRetelling(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                    {selectedStory.storyParagraphs.map((p, i) => (
                      <p key={i} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => advanceStage(-1)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Expressions</span>
                </button>
                <button
                  onClick={() => advanceStage(1)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-1.5"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Step 5: Save Session Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              STAGE 5: PRIVATE PROGRESS LOG
              ========================================= */}
          {currentStage === 'log' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 shadow-card-elevated">
                <div>
                  <div
                    className="text-xs font-mono font-bold uppercase mb-1"
                    style={{ color: activeBrand.colors.accent.hex }}
                  >
                    Private Self-Reflection Log · Day {selectedStory.day}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white font-brand">
                    How Did Today's Speaking Session Go?
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Saved in your browser storage so you can review your steady progress over time.
                  </p>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Script Independence (1–5 scale)
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = currentRating === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setCurrentRating(num)}
                          className={`w-10 h-10 rounded-xl font-mono font-bold text-xs border transition-all duration-200 ${
                            isSelected
                              ? 'scale-105 shadow-md font-bold'
                              : 'bg-stone-950 text-stone-400 border-white/10 hover:text-white'
                          }`}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: activeBrand.colors.accent.hex,
                                  color: '#061210',
                                  borderColor: activeBrand.colors.accent.hex,
                                }
                              : undefined
                          }
                        >
                          {num}
                        </button>
                      );
                    })}
                    <span className="text-xs text-stone-400 ml-1">
                      {currentRating === 1 && 'Heavy script dependence'}
                      {currentRating === 3 && 'Retold with 2-3 glances'}
                      {currentRating === 5 && '100% Free unscripted retelling!'}
                    </span>
                  </div>
                </div>

                {/* Stumbles */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Stumble Moments
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paused on 'disorienting' in paragraph 2"
                    value={stumbleNotes}
                    onChange={(e) => setStumbleNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                {/* Win */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Win of the Day
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Used the phrase 'hit the ground running' smoothly during retelling!"
                    value={winNotes}
                    onChange={(e) => setWinNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                {/* Next */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Next Session Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Slower breathing and clearer sentence linking"
                    value={nextFocusNotes}
                    onChange={(e) => setNextFocusNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleSaveReflection}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-1.5"
                    style={{
                      backgroundColor: activeBrand.colors.accent.hex,
                      color: '#061210',
                    }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Save Session Log</span>
                  </button>
                  {savedLogSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold animate-fade-in">
                      ✓ Saved to Practice Archive!
                    </span>
                  )}
                </div>
              </div>

              {/* Saved History */}
              {reflections.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <div className="text-xs font-mono font-bold text-stone-400 uppercase">
                    Your Saved Progress Archive ({reflections.length} Sessions)
                  </div>
                  <div className="space-y-2">
                    {reflections.slice(0, 5).map((r, i) => (
                      <div
                        key={i}
                        className="bg-stone-950/80 p-3 sm:p-4 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs shadow-sm"
                      >
                        <div className="min-w-0">
                          <span className="font-bold" style={{ color: activeBrand.colors.accent.hex }}>Day {r.day}:</span>{' '}
                          <span className="text-white font-medium">{r.storyTitle}</span>
                          <span className="text-stone-500 ml-1.5 text-[11px]">({r.date})</span>
                          <div className="text-[11px] text-stone-400 mt-0.5 truncate">
                            Win: {r.winOfTheDay}
                          </div>
                        </div>
                        <div className="font-mono text-stone-300 shrink-0 text-[11px]">
                          Rating: {r.scriptIndependenceRating}/5
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Studio Bottom Bar: Microphone Audio Practice Tool */}
        <div className="bg-stone-900/90 border-t border-white/[0.08] px-4 sm:px-6 py-3.5 space-y-3 backdrop-blur-md">
          {micNotice && (
            <div
              className="px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 animate-fade-in shadow-sm border"
              style={{
                backgroundColor: `${activeBrand.colors.accent.hex}15`,
                borderColor: `${activeBrand.colors.accent.hex}35`,
                color: activeBrand.colors.canvas.hex,
              }}
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 shrink-0" style={{ color: activeBrand.colors.accent.hex }} />
                <span className="leading-relaxed">{micNotice}</span>
              </div>
              <button
                onClick={() => setMicNotice(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg shrink-0"
                title="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                isRecordingAudio
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/10 shadow-sm'
              }`}
            >
              {isRecordingAudio ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecordingAudio ? `Stop (${formatTime(audioDuration)})` : 'Rehearse with Mic'}</span>
            </button>

            {/* Pulsing Visualizer bars */}
            {isRecordingAudio && (
              <div className="flex items-end gap-1 h-5 px-1">
                <div className="w-1 bg-rose-400 rounded-full animate-wave-bar-1" />
                <div className="w-1 bg-white rounded-full animate-wave-bar-2" />
                <div className="w-1 bg-rose-500 rounded-full animate-wave-bar-3" />
                <div className="w-1 bg-white rounded-full animate-wave-bar-4" />
                <div className="w-1 bg-rose-400 rounded-full animate-wave-bar-5" />
              </div>
            )}

            {audioURL && (
              <div className="flex items-center gap-2">
                <audio controls src={audioURL} className="h-7 max-w-[170px] sm:max-w-[220px]" />
                <button
                  onClick={downloadAudioRecording}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all"
                  title="Download rehearsal audio"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] sm:text-xs text-stone-400 font-mono text-left sm:text-right">
            <span>Speak in Progress</span>
            <span className="text-stone-600 mx-2">·</span>
            <span>Screen Capture Ready</span>
          </div>
        </div>
      </div>
    </div>

      {/* ====================================================
          MODAL 1: "HOW TO USE PROPERLY & OBS RECORDING GUIDE"
          ==================================================== */}
      {showHowToUseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  Creator Masterclass & Recording Guide
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand mt-0.5">
                  How to Use the Teleprompter Studio Properly
                </h3>
              </div>
              <button
                onClick={() => setShowHowToUseModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-white/10 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'workflow', label: '1. Video Workflow (৫-৭ মিনিট)' },
                { id: 'obs', label: '2. OBS Setup (রেকর্ডিং)' },
                { id: 'speaking', label: '3. Speaking Technique (কৌশল)' },
                { id: 'shortcuts', label: '4. Shortcuts (কিবোর্ড)' },
              ].map((tab) => {
                const isActive = howToUseTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setHowToUseTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: activeBrand.colors.accent.hex,
                            color: '#061210',
                          }
                        : undefined
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: 4-Step Video Workflow */}
            {howToUseTab === 'workflow' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-200">
                <p className="leading-relaxed text-stone-300">
                  প্রতিটি YouTube ভিডিওকে মাত্র ৫ থেকে ৭ মিনিটের একটি টানটান, গঠনমূলক ফরম্যাটে সাজান। দর্শক আপনার আত্মবিশ্বাস এবং অগ্রগতি দেখতে আসবে:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase" style={{ color: activeBrand.colors.accent.hex }}>Part 1 · Introduction (15-20s)</div>
                    <div className="font-semibold text-white">Opening & Focus Declaration</div>
                    <p className="text-xs text-stone-400">
                      দর্শককে স্বাগত জানান, আজকের ডে নম্বর ও কী বিষয়ে অনুশীলন করছেন (যেমন: "Past tense pronunciation") তা সংক্ষেপে বলুন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase" style={{ color: activeBrand.colors.accent.hex }}>Part 2 · Story Reading (2-3 min)</div>
                    <div className="font-semibold text-white">Teleprompter Delivery</div>
                    <p className="text-xs text-stone-400">
                      পর্দায় প্রম্পটার দেখে স্বাভাবিক গতিতে গল্পটি পড়ুন। দ্রুত না পড়ে কমা ও ফুলস্টপে পর্যাপ্ত শ্বাস নিন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase" style={{ color: activeBrand.colors.accent.hex }}>Part 3 · 3 Useful Phrases (45s-1 min)</div>
                    <div className="font-semibold text-white">Vocabulary In Context</div>
                    <p className="text-xs text-stone-400">
                      গল্প থেকে ৩টি আকর্ষণীয় phrase এবং তাদের অর্থ সহজ ইংরেজিতে ব্যাখ্যা করুন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase" style={{ color: activeBrand.colors.accent.hex }}>Part 4 · Retelling (1-2 min)</div>
                    <div className="font-semibold text-white">The Real English Challenge</div>
                    <p className="text-xs text-stone-400">
                      স্ক্রিপ্ট লুকিয়ে শুধু ৪টি পয়েন্ট (Memory Anchors) দেখে নিজের ভাষায় গল্পটি আবার বলুন। এটিই আপনার স্পিকিং ফ্লো আনবে!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: OBS Studio Setup */}
            {howToUseTab === 'obs' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-200">
                <div className="bg-stone-950 p-4 rounded-2xl border border-white/10 space-y-2.5">
                  <div className="font-bold font-mono text-xs uppercase flex items-center gap-2" style={{ color: activeBrand.colors.accent.hex }}>
                    <Monitor className="w-4 h-4" />
                    <span>OBS Studio Best Settings for Faceless Screen Recording</span>
                  </div>
                  <ul className="space-y-2 list-disc list-inside text-stone-300 text-xs">
                    <li>
                      <strong>Canvas Resolution:</strong> 1920 × 1080 (1080p, 60fps or 30fps).
                    </li>
                    <li>
                      <strong>Source Capture:</strong> OBS-এ <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Window Capture</code> সিলেক্ট করে আপনার ব্রাউজার উইন্ডো নির্বাচন করুন।
                    </li>
                    <li>
                      <strong>OBS Clean Mode:</strong> এই স্টুডিওর <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">OBS Clean Mode (F)</code> বোতামে চাপ দিলে ব্রাউজারের অনাবশ্যক সব বাটন লুকানো হয়ে যাবে এবং স্ক্রিন নিখুঁত মিনিমাল দেখাবে।
                    </li>
                    <li>
                      <strong>Microphone Filter:</strong> OBS Audio Filters-এ <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Noise Suppression (RNNoise)</code> এবং হালকা <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Compressor</code> অন করে নিলে বাইরের কোনো ফ্যান বা ঘরের শব্দ রেকর্ড হবে না।
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Speaking Technique */}
            {howToUseTab === 'speaking' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-200">
                <div
                  className="p-4 rounded-2xl space-y-2 border"
                  style={{
                    backgroundColor: `${activeBrand.colors.accent.hex}15`,
                    borderColor: `${activeBrand.colors.accent.hex}35`,
                  }}
                >
                  <div className="font-bold font-mono text-xs uppercase" style={{ color: activeBrand.colors.accent.hex }}>
                    স্বাভাবিকভাবে কথা বলার ৩টি সোনালী নিয়ম:
                  </div>
                  <ol className="space-y-2 list-decimal list-inside text-stone-200 text-xs leading-relaxed">
                    <li>
                      <strong>ভুল হলে রেকর্ড বন্ধ করবেন না ("Never Restart the Video"):</strong> আপনি যদি একটি শব্দ ভুল উচ্চারণ করেন, ঘাবড়াবেন না। হাসিমুখে বলুন—<em>"Let me rephrase that..."</em> এবং আবার বলুন। দর্শকরা রোবটের মতো নিখুঁত মানুষ চায় না, তারা আপনার সত্যিকারের চেষ্টা ও অগ্রগতি দেখতে চায়।
                    </li>
                    <li>
                      <strong>চোখের অবস্থান ("Look Ahead"):</strong> প্রম্পটারের অক্ষরের দিকে চোখ গেঁথে রাখবেন না। ৩-৪টি শব্দের একটি ক্লস্টার এক পলকে দেখে নিয়ে সামনের দিকে তাকিয়ে স্বাভাবিক কণ্ঠে বলুন।
                    </li>
                    <li>
                      <strong>মাথায় বাংলা অনুবাদ বন্ধ করুন:</strong> Retelling-এর সময় বাংলায় অনুবাদ করে ইংরেজিতে রূপান্তর করতে গেলে আটকে যাবেন। স্ক্রিনে দেওয়া ৪টি Memory Clue দেখে সরাসরি ইংরেজিতে কল্পনা করে বলুন।
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 4: Keyboard Shortcuts */}
            {howToUseTab === 'shortcuts' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Play/Pause Scroll or Next Paragraph</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>Space</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Next Paragraph / Speed Up</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>↓ or J</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Previous Paragraph / Speed Down</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>↑ or K</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Toggle OBS Clean Mode</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>F</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Next / Prev Session Stage</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>[ or ]</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Reset Timer</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono" style={{ color: activeBrand.colors.accent.hex }}>R</kbd>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setShowHowToUseModal(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: '#061210',
                }}
              >
                Got It! Back to Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: "+ ADD YOUR OWN CUSTOM STORY"
          ==================================================== */}
      {showAddStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Custom Practice Material
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand mt-0.5">
                  Add Your Own Story / Script
                </h3>
              </div>
              <button
                onClick={() => setShowAddStoryModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">Episode / Day #</label>
                  <input
                    type="number"
                    min="1"
                    value={newDayNum}
                    onChange={(e) => setNewDayNum(parseInt(e.target.value) || 1)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-emerald-400 outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">Story Title</label>
                  <input
                    type="text"
                    placeholder="e.g. My First Freelance Client Meeting"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold uppercase text-[11px]">Today's Speaking Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Connected speech and eliminating 'um/uh' pauses"
                  value={newFocusSkill}
                  onChange={(e) => setNewFocusSkill(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">Story Text (Separate paragraphs with double enter)</label>
                  <span className="text-[10px] text-stone-500 font-mono">2 to 4 paragraphs recommended</span>
                </div>
                <textarea
                  rows={6}
                  placeholder={`Paste your English story here...\n\nParagraph 1: Background of the situation...\n\nParagraph 2: The turning point or challenge...\n\nParagraph 3: How it was resolved and lesson learned.`}
                  value={newStoryRawText}
                  onChange={(e) => setNewStoryRawText(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl p-3 text-stone-100 focus:border-emerald-400 outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold uppercase text-[11px]">Memory Anchors for Retelling (One per line)</label>
                <textarea
                  rows={3}
                  placeholder={`Point 1: Describe the initial situation\nPoint 2: What went wrong or changed\nPoint 3: How you reacted\nPoint 4: Personal reflection or advice`}
                  value={newAnchorsRaw}
                  onChange={(e) => setNewAnchorsRaw(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl p-3 text-stone-100 focus:border-emerald-400 outline-none font-mono text-[11px]"
                />
              </div>
            </div>

            {addStoryError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <span className="font-bold">Notice:</span>
                <span>{addStoryError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setShowAddStoryModal(false);
                  setAddStoryError(null);
                }}
                className="px-4 py-2 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomStory}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Save & Practice This Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Custom Story (avoiding window.confirm) */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-white/15 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white font-brand">Remove Custom Story?</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to remove this custom story? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteCustomStory(storyToDelete)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
