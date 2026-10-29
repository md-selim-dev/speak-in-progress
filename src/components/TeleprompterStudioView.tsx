/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrandIdentity, PracticeStory, ReflectionEntry, ExpressionItem } from '../types';
import { SAMPLE_STORIES } from '../data/sampleStories';
import { LogoMark } from './LogoMark';
import { User } from 'firebase/auth';
import {
  signInWithGoogle,
  signOutUser,
  onAuthUserChanged,
} from '../lib/firebase';
import {
  subscribeToUserScripts,
  saveUserScript,
  deleteUserScript,
  syncLocalScriptsToCloud,
} from '../lib/scriptService';
import {
  parseImportedContent,
  CEFR_LEVELS,
  getLevelFromDay,
} from '../lib/sheetParser';
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
  Type,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  HelpCircle,
  Keyboard,
  Download,
  Upload,
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
  Edit3,
  Copy,
  Search,
  FileText,
  FileDown,
  FileUp,
  Layers,
  Eye,
  EyeOff,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  AlertTriangle,
  Table,
  Check,
} from 'lucide-react';

interface TeleprompterStudioViewProps {
  activeBrand: BrandIdentity;
}

export const TeleprompterStudioView: React.FC<TeleprompterStudioViewProps> = ({ activeBrand }) => {
  // --- Cloud Auth & Storage State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'guest'>('guest');
  const [cloudStories, setCloudStories] = useState<PracticeStory[]>([]);
  const [cloudError, setCloudError] = useState<string | null>(null);

  // --- Local Fallback & Cache State (Preserving Existing Scripts) ---
  const [customStories, setCustomStories] = useState<PracticeStory[]>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_custom_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editedStoriesMap, setEditedStoriesMap] = useState<Record<string, PracticeStory>>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_edited_stories');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track Auth state changes with Firebase
  useEffect(() => {
    const unsubscribe = onAuthUserChanged(async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        setCloudSyncStatus('syncing');
        // Migrate any pre-existing local scripts to cloud if first time
        try {
          if (customStories.length > 0 || Object.keys(editedStoriesMap).length > 0) {
            await syncLocalScriptsToCloud(user.uid, customStories, editedStoriesMap);
          }
        } catch (e) {
          console.warn('Auto migration error:', e);
        }
      } else {
        setCloudSyncStatus('guest');
        setCloudStories([]);
      }
    });

    return () => unsubscribe();
  }, [customStories, editedStoriesMap]);

  // Subscribe to real-time Cloud Firestore scripts when logged in
  useEffect(() => {
    if (!currentUser) return;

    setCloudSyncStatus('syncing');
    const unsubscribe = subscribeToUserScripts(
      currentUser.uid,
      (remoteStories) => {
        setCloudStories(remoteStories);
        setCloudSyncStatus('synced');
        setCloudError(null);
      },
      (error) => {
        console.error('Real-time sync error:', error);
        setCloudSyncStatus('offline');
        setCloudError('Unable to connect to Cloud Firestore. Using local cached scripts.');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Unified stories library: Strictly unique by day number across A1 to C2
  const allStories = useMemo(() => {
    // 1. Start with the canonical master 120-day curriculum (Days 1–120)
    const storyMap = new Map<number, PracticeStory>();
    SAMPLE_STORIES.forEach((s) => storyMap.set(s.day, s));

    // 2. Overlay user edited stories (only for valid days that match or exceed 5 paragraphs)
    Object.values(editedStoriesMap).forEach((edited) => {
      if (edited && typeof edited.day === 'number' && edited.day >= 1) {
        // Prevent stale 3-paragraph legacy cache from overwriting the official 5-paragraph curriculum
        if (!edited.storyParagraphs || edited.storyParagraphs.length >= 5) {
          storyMap.set(edited.day, {
            ...edited,
            level: edited.level || getLevelFromDay(edited.day),
          });
        }
      }
    });

    // 3. Overlay custom additions (only days > 120 so standard days 1–120 are never duplicated)
    customStories.forEach((custom) => {
      if (custom && typeof custom.day === 'number' && custom.day > 120) {
        storyMap.set(custom.day, {
          ...custom,
          level: custom.level || getLevelFromDay(custom.day),
        });
      }
    });

    // 4. If logged into Cloud Firestore, overlay remote user scripts
    if (currentUser && cloudStories.length > 0) {
      cloudStories.forEach((remote) => {
        if (remote && typeof remote.day === 'number') {
          storyMap.set(remote.day, {
            ...remote,
            level: remote.level || getLevelFromDay(remote.day),
          });
        }
      });
    }

    return Array.from(storyMap.values()).sort((a, b) => a.day - b.day);
  }, [currentUser, cloudStories, customStories, editedStoriesMap]);

  const [selectedStory, setSelectedStory] = useState<PracticeStory>(allStories[0] || SAMPLE_STORIES[0]);

  // Keep selectedStory in sync when stories list changes
  useEffect(() => {
    const found = allStories.find((s) => s.id === selectedStory?.id);
    if (found) {
      setSelectedStory(found);
    } else if (allStories.length > 0) {
      setSelectedStory(allStories[0]);
    }
  }, [allStories]);

  // Level Filter (A1 to C2 for 120 Days)
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');

  // Stage Navigation: 5-step speaking workflow
  const [currentStage, setCurrentStage] = useState<'intro' | 'story' | 'expressions' | 'retelling' | 'log'>('story');

  // Prompter Mode: 'focus' vs 'scroll'
  const [prompterMode, setPrompterMode] = useState<'focus' | 'scroll'>('focus');
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);

  // Screen Recording & Reading Settings
  const [fontSize, setFontSize] = useState<number>(24);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(32); // pixels/sec
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);
  const [showReadingBeam, setShowReadingBeam] = useState<boolean>(true);
  const [showCleanHud, setShowCleanHud] = useState<boolean>(true);

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
  const [showContentManagerModal, setShowContentManagerModal] = useState<boolean>(false);
  const [contentManagerTab, setContentManagerTab] = useState<'list' | 'add' | 'edit' | 'sheets' | 'bulk' | 'backup'>('list');
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [storySearchQuery, setStorySearchQuery] = useState<string>('');

  // Form State & Dirty Tracking (Prevents Accidental Loss of Unsaved Changes)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [formDayNum, setFormDayNum] = useState<number>(allStories.length + 1);
  const [formLevel, setFormLevel] = useState<string>('A1');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formTopic, setFormTopic] = useState<string>('');
  const [formFocusSkill, setFormFocusSkill] = useState<string>('Natural linking & direct thinking');
  const [formStoryRawText, setFormStoryRawText] = useState<string>('');
  const [formPhrases, setFormPhrases] = useState<ExpressionItem[]>([
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
  ]);
  const [formAnchorsRaw, setFormAnchorsRaw] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [isFormSaving, setIsFormSaving] = useState<boolean>(false);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [showUnsavedDiscardConfirm, setShowUnsavedDiscardConfirm] = useState<boolean>(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState<string | null>(null);

  // Google Sheet TSV / CSV Import State
  const [sheetImportRaw, setSheetImportRaw] = useState<string>('');
  const [parsedSheetStories, setParsedSheetStories] = useState<PracticeStory[]>([]);
  const [sheetImportError, setSheetImportError] = useState<string | null>(null);
  const [sheetImportSuccess, setSheetImportSuccess] = useState<string | null>(null);

  // Bulk Import State
  const [bulkImportText, setBulkImportText] = useState<string>('');
  const [bulkImportNotice, setBulkImportNotice] = useState<string | null>(null);

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

  // Copy Feedback States
  const [copiedIntro, setCopiedIntro] = useState<boolean>(false);
  const [copiedStory, setCopiedStory] = useState<boolean>(false);
  const [copiedExpressionIdx, setCopiedExpressionIdx] = useState<number | null>(null);

  const handleCopyIntro = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIntro(true);
      setTimeout(() => setCopiedIntro(false), 2000);
    } catch (err) {
      console.error('Failed to copy intro script', err);
    }
  };

  const handleCopyStory = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStory(true);
      setTimeout(() => setCopiedStory(false), 2000);
    } catch (err) {
      console.error('Failed to copy story text', err);
    }
  };

  const handleCopyExpression = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedExpressionIdx(idx);
      setTimeout(() => setCopiedExpressionIdx(null), 2000);
    } catch (err) {
      console.error('Failed to copy expression', err);
    }
  };

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

  // Peek Countdown Timer (auto-hides retelling story after 5s)
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

  // Teardown microphone media stream on unmount
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

  // Keyboard Navigation Handler (Global Hotkeys for Recording with OBS/Screen Capture)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
            setActiveParagraphIndex((prev) =>
              prev < selectedStory.storyParagraphs.length - 1 ? prev + 1 : 0
            );
          }
        } else {
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
            setScrollSpeed((s) => Math.min(80, s + 5));
          }
        }
      } else if (e.code === 'ArrowUp' || e.code === 'KeyK') {
        if (currentStage === 'story') {
          if (prompterMode === 'focus') {
            e.preventDefault();
            setActiveParagraphIndex((prev) => Math.max(0, prev - 1));
          } else {
            setScrollSpeed((s) => Math.max(15, s - 5));
          }
        }
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        setIsCleanMode((prev) => !prev);
      } else if (e.code === 'KeyH') {
        e.preventDefault();
        setShowCleanHud((prev) => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setTimerSeconds(0);
        setIsTimerRunning(false);
      } else if (e.code === 'BracketRight') {
        e.preventDefault();
        advanceStage(1);
      } else if (e.code === 'BracketLeft') {
        e.preventDefault();
        advanceStage(-1);
      } else if (e.code === 'Slash' && e.shiftKey) {
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
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const storyWordCount = useMemo(() => {
    return selectedStory.storyParagraphs.join(' ').split(/\s+/).filter(Boolean).length;
  }, [selectedStory]);

  const estimatedWpm = useMemo(() => {
    return Math.round(scrollSpeed * 3.8);
  }, [scrollSpeed]);

  // Audio Recording with Microphone
  const startAudioRecording = async () => {
    try {
      setMicNotice(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      recorder.start();
      setIsRecordingAudio(true);
      setAudioDuration(0);

      audioTimerRef.current = setInterval(() => {
        setAudioDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMicNotice('Microphone access denied. Please allow microphone permissions in your browser.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    setIsRecordingAudio(false);
  };

  const downloadAudioRecording = () => {
    if (!audioURL) return;
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `Day-${selectedStory.day}-Speaking-Rehearsal.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Google Login / Logout handlers
  const handleGoogleSignIn = async () => {
    try {
      setCloudError(null);
      const user = await signInWithGoogle();
      if (!user) {
        // User closed or dismissed popup, no error to show
        return;
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        setCloudError(err.message || 'Failed to sign in with Google');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      console.error(err);
    }
  };

  // Open Form to Add New Day
  const handleOpenAddModal = () => {
    if (isFormDirty) {
      setPendingTabSwitch('add');
      setShowUnsavedDiscardConfirm(true);
      return;
    }
    setEditingStoryId(null);
    const nextDay = Math.max(...allStories.map((s) => s.day), 0) + 1;
    setFormDayNum(nextDay);
    setFormLevel(getLevelFromDay(nextDay));
    setFormTitle('');
    setFormTopic('');
    setFormFocusSkill('Natural linking & direct thinking flow');
    setFormStoryRawText('');
    setFormPhrases([
      { phrase: '', meaning: '', example: '', speakingTip: '' },
      { phrase: '', meaning: '', example: '', speakingTip: '' },
      { phrase: '', meaning: '', example: '', speakingTip: '' },
    ]);
    setFormAnchorsRaw('');
    setFormNotes('');
    setFormError(null);
    setFormSuccessMessage(null);
    setIsFormDirty(false);
    setContentManagerTab('add');
    setShowContentManagerModal(true);
  };

  // Open Form to Edit Existing Day
  const handleOpenEditModal = (story: PracticeStory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFormDirty) {
      setPendingTabSwitch(`edit:${story.id}`);
      setShowUnsavedDiscardConfirm(true);
      return;
    }
    setEditingStoryId(story.id);
    setFormDayNum(story.day);
    setFormLevel(story.level || getLevelFromDay(story.day));
    setFormTitle(story.title);
    setFormTopic(story.topic || '');
    setFormFocusSkill(story.focusSkill);
    setFormStoryRawText(story.storyParagraphs.join('\n\n'));
    setFormNotes(story.notes || '');

    const phrases = [...story.usefulExpressions];
    while (phrases.length < 3) {
      phrases.push({ phrase: '', meaning: '', example: '', speakingTip: '' });
    }
    setFormPhrases(phrases.slice(0, 3));
    setFormAnchorsRaw(story.retellingPrompts.join('\n'));
    setFormError(null);
    setFormSuccessMessage(null);
    setIsFormDirty(false);
    setContentManagerTab('edit');
    setShowContentManagerModal(true);
  };

  // Discard Unsaved Changes Confirmation Handler
  const handleConfirmDiscard = () => {
    setIsFormDirty(false);
    setShowUnsavedDiscardConfirm(false);

    if (pendingTabSwitch) {
      if (pendingTabSwitch === 'add') {
        handleOpenAddModal();
      } else if (pendingTabSwitch.startsWith('edit:')) {
        const id = pendingTabSwitch.replace('edit:', '');
        const target = allStories.find((s) => s.id === id);
        if (target) handleOpenEditModal(target);
      } else {
        setContentManagerTab(pendingTabSwitch as any);
      }
      setPendingTabSwitch(null);
    } else {
      setShowContentManagerModal(false);
    }
  };

  // Save Story Form (Cloud Firestore when signed in, Local Storage as fallback)
  const handleSaveStoryForm = async () => {
    setFormError(null);
    if (!formTitle.trim()) {
      setFormError('Please enter a lesson title.');
      return;
    }

    const paras = formStoryRawText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paras.length === 0) {
      setFormError('Please write at least one story paragraph.');
      return;
    }

    const anchorList = formAnchorsRaw
      .split('\n')
      .map((a) => a.trim().replace(/^[-*•]\s*/, ''))
      .filter((a) => a.length > 0);

    const finalPhrases: ExpressionItem[] = formPhrases
      .filter((p) => p.phrase.trim().length > 0)
      .map((p) => ({
        phrase: p.phrase.trim(),
        meaning: p.meaning.trim() || 'Key expression',
        example: p.example.trim() || 'Used naturally in storytelling.',
        speakingTip: p.speakingTip.trim() || 'Emphasize key vowels smoothly.',
      }));

    setIsFormSaving(true);

    try {
      const storyId = editingStoryId || `custom-story-${Date.now()}`;
      const targetExisting = allStories.find((s) => s.id === storyId);

      const storyObj: PracticeStory = {
        id: storyId,
        day: formDayNum,
        level: formLevel || getLevelFromDay(formDayNum),
        title: formTitle.trim(),
        topic: formTopic.trim(),
        focusSkill: formFocusSkill.trim() || 'Natural pacing & conversational flow',
        estimatedReadTime: `${Math.max(1, Math.ceil(paras.join(' ').split(/\s+/).length / 130))} min`,
        storyParagraphs: paras,
        usefulExpressions:
          finalPhrases.length > 0
            ? finalPhrases
            : [
                {
                  phrase: 'keep up momentum',
                  meaning: 'to maintain continuous progress',
                  example: 'I kept up momentum throughout the video.',
                  speakingTip: 'Natural rhythm',
                },
              ],
        retellingPrompts:
          anchorList.length > 0
            ? anchorList
            : paras.slice(0, 4).map((p) => p.slice(0, 60) + '...'),
        reflectionPrompts: targetExisting?.reflectionPrompts || [
          'Did I speak from memory during retelling?',
          'Where was my pace most natural?',
        ],
        notes: formNotes.trim(),
        userId: currentUser?.uid,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save to Cloud Firestore if user is authenticated
      if (currentUser) {
        await saveUserScript(currentUser.uid, storyObj);
        setCloudSyncStatus('synced');
      }

      // 2. Also save to local storage as persistent cache
      const isCustom = storyId.startsWith('custom-') || storyId.startsWith('cloud-') || storyId.startsWith('sheet-');
      if (isCustom) {
        const nextCustoms = customStories.some((s) => s.id === storyId)
          ? customStories.map((s) => (s.id === storyId ? storyObj : s))
          : [...customStories, storyObj];
        setCustomStories(nextCustoms);
        localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(nextCustoms));
      } else {
        const nextEdited = { ...editedStoriesMap, [storyId]: storyObj };
        setEditedStoriesMap(nextEdited);
        localStorage.setItem('speak_in_progress_edited_stories', JSON.stringify(nextEdited));
      }

      setSelectedStory(storyObj);
      setIsFormDirty(false);
      setFormSuccessMessage(`✓ Day ${formDayNum} saved to ${currentUser ? 'Cloud Firestore' : 'Library'}!`);

      setTimeout(() => {
        setShowContentManagerModal(false);
        setFormSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      console.error('Error saving story:', err);
      setFormError(`Failed to save: ${err.message || 'Unknown error'}`);
    } finally {
      setIsFormSaving(false);
    }
  };

  // Delete Story (from Cloud Firestore and local cache)
  const confirmDeleteStory = async (storyId: string) => {
    try {
      if (currentUser) {
        await deleteUserScript(currentUser.uid, storyId);
      }

      const updated = customStories.filter((s) => s.id !== storyId);
      setCustomStories(updated);
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));

      if (editedStoriesMap[storyId]) {
        const nextMap = { ...editedStoriesMap };
        delete nextMap[storyId];
        setEditedStoriesMap(nextMap);
        localStorage.setItem('speak_in_progress_edited_stories', JSON.stringify(nextMap));
      }

      setSelectedStory(SAMPLE_STORIES[0]);
      setStoryToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete script:', err);
      alert(`Delete error: ${err.message}`);
    }
  };

  // Google Sheet TSV Parse & Live Preview
  const handleParseSheetInput = () => {
    setSheetImportError(null);
    setSheetImportSuccess(null);
    const result = parseImportedContent(sheetImportRaw);

    if (result.stories.length === 0) {
      setSheetImportError('No valid rows or days found. Please copy cells directly from your Google Sheet or paste TSV/JSON.');
      return;
    }

    setParsedSheetStories(result.stories);
    setSheetImportSuccess(`✓ Successfully parsed ${result.stories.length} practice days from ${result.format.toUpperCase()}! Preview below before importing.`);
  };

  // Commit Parsed Google Sheet Days to Cloud / Local
  const handleCommitSheetImport = async () => {
    if (parsedSheetStories.length === 0) return;
    setIsFormSaving(true);
    setSheetImportError(null);

    try {
      let savedCount = 0;
      for (const story of parsedSheetStories) {
        if (currentUser) {
          await saveUserScript(currentUser.uid, story);
        }
        savedCount++;
      }

      const updatedCustoms = [...customStories, ...parsedSheetStories];
      setCustomStories(updatedCustoms);
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updatedCustoms));

      setSheetImportSuccess(`🎉 Successfully imported all ${savedCount} days into your ${currentUser ? 'Cloud Firestore' : 'Library'}!`);
      setParsedSheetStories([]);
      setSheetImportRaw('');

      setTimeout(() => {
        setContentManagerTab('list');
      }, 1500);
    } catch (err: any) {
      setSheetImportError(`Import error: ${err.message}`);
    } finally {
      setIsFormSaving(false);
    }
  };

  // Load Sample Sheet Template
  const loadSampleSheetTemplate = () => {
    setSheetImportRaw(
`Day\tLevel\tTitle\tTopic\tFocus Skill\tStory / Script\tExpressions\tRetelling Anchors
11\tA2\tOrdering at a Busy Coffee Shop\tEveryday Situations\tPolite requests & natural pace\tI walked into the local coffee shop during the morning rush. The barista greeted me with a warm smile. I ordered a hot cappuccino with oat milk and asked for a blueberry muffin.\n\nWhile waiting, I listened to the background buzz of friendly chatter and soft acoustic music. It felt completely natural to order in English without translating in my head.\tcan I get: polite way to order;on the go: in a hurry;hit the spot: exactly what was needed\tWalking in during rush;Barista greeting;Ordering with oat milk;Feeling natural without translating
12\tB1\tExplaining a Creative Design Choice\tProfessional English\tPresenting rationale diplomatically\tDuring our weekly project review, the client asked why we chose the obsidian dark background instead of standard white. I paused, took a deep breath, and walked them through our visual hierarchy.\n\nI explained that the dark aesthetic eliminates eye strain for long practice sessions while making the emerald spark accents pop with cinematic clarity. They immediately bought into the vision.\tbuy into: to agree with and support;walk someone through: to explain step by step;pop: to stand out vividly\tThe client question on dark mode;Pausing to explain visual hierarchy;Addressing eye fatigue;Client agreeing with enthusiasm
13\tB2\tNavigating an Unexpected Schedule Delay\tBusiness Communication\tHandling project friction gracefully\tYesterday our development sprint hit an unexpected roadblock when an external API changed its specification without notice. Rather than panicking or looking for someone to blame, our team convened for a quick fifteen-minute sync.\n\nWe transparently updated stakeholders, proposed a clean alternative architecture, and kept our delivery timeline completely on track.\troadblock: an unexpected obstacle;convene: to gather together;on track: progressing as planned\tThe sudden external API change;Quick team alignment sync;Transparent stakeholder communication;On-time delivery breakthrough`
    );
  };

  // Bulk Import text parser
  const handleRunBulkImport = async () => {
    const raw = bulkImportText.trim();
    if (!raw) {
      setBulkImportNotice('Please paste your content text or JSON first.');
      return;
    }

    const result = parseImportedContent(raw, allStories.length + 1);
    if (result.stories.length === 0) {
      setBulkImportNotice('Could not parse any practice days. Please check the formatting or load the sample template.');
      return;
    }

    try {
      setIsFormSaving(true);
      for (const s of result.stories) {
        if (currentUser) {
          await saveUserScript(currentUser.uid, s);
        }
      }

      const updated = [...customStories, ...result.stories];
      setCustomStories(updated);
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));

      setBulkImportNotice(`✓ Successfully imported ${result.stories.length} days into your library!`);
      setBulkImportText('');
    } catch (err: any) {
      setBulkImportNotice(`Import error: ${err.message}`);
    } finally {
      setIsFormSaving(false);
    }
  };

  // Export all days to JSON
  const handleExportAllJSON = () => {
    const dataStr = JSON.stringify(allStories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speak-in-progress-curriculum-${allStories.length}-days.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Restore from JSON
  const handleImportJSONFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (currentUser) {
            for (const item of parsed) {
              await saveUserScript(currentUser.uid, item);
            }
          }
          setCustomStories(parsed);
          localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(parsed));
          setBulkImportNotice(`✓ Restored ${parsed.length} days from JSON backup file!`);
        }
      } catch (err) {
        setBulkImportNotice('Invalid backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to clean official 120-day curriculum (purges old legacy test data)
  const handleResetToOfficialCurriculum = () => {
    localStorage.removeItem('speak_in_progress_custom_stories');
    localStorage.removeItem('speak_in_progress_edited_stories');
    setCustomStories([]);
    setEditedStoriesMap({});
    setSelectedStory(SAMPLE_STORIES[0]);
    setShowContentManagerModal(false);
  };

  // Reflection logger
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

  // Filtered stories by Search and CEFR Level
  const filteredStories = useMemo(() => {
    const q = storySearchQuery.toLowerCase().trim();
    return allStories.filter((s) => {
      // Level check
      const level = (s.level || getLevelFromDay(s.day)).toUpperCase();
      if (selectedLevelFilter !== 'all' && level !== selectedLevelFilter) {
        return false;
      }
      // Query check
      if (!q) return true;
      return (
        s.day.toString().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.focusSkill.toLowerCase().includes(q) ||
        (s.topic && s.topic.toLowerCase().includes(q))
      );
    });
  }, [allStories, storySearchQuery, selectedLevelFilter]);

  return (
    <div className={`space-y-6 sm:space-y-8 ${isCleanMode ? 'bg-[#030705] min-h-screen p-3 sm:p-8' : ''}`}>
      {/* Studio Header (Hidden in Clean Screen Recording Mode) */}
      {!isCleanMode && (
        <section className="bg-stone-900/60 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-9 shadow-card-elevated backdrop-blur-xl transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/[0.08]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
                  style={{
                    color: activeBrand.colors.accent.hex,
                    backgroundColor: `${activeBrand.colors.accent.hex}15`,
                    borderColor: `${activeBrand.colors.accent.hex}35`,
                  }}
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: activeBrand.colors.accent.hex }} />
                  <span>Faceless Screen-Recording Studio · PC & OBS Ready</span>
                </div>

                {/* Cloud Sync Status Badge */}
                {currentUser ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cloud Synced ({currentUser.displayName || currentUser.email})</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 hover:bg-stone-700 border border-white/10 text-stone-300 transition-all active:scale-95"
                    title="Sign in with Google to sync all your practice days to Cloud Firestore"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guest Mode · Sign In to Sync Cloud</span>
                  </button>
                )}
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
                  {allStories.length} Practice Days (A1–C2)
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Designed for faceless YouTube screen recordings. Practice day-by-day unscripted spoken retelling, auto-scroll at natural WPM, and manage all your 120-day scripts with Cloud Firestore synchronization.
              </p>

              {cloudError && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cloudError}</span>
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch sm:self-start lg:self-center">
              <button
                onClick={() => {
                  setContentManagerTab('list');
                  setShowContentManagerModal(true);
                }}
                className="px-4 py-2.5 text-xs font-bold text-stone-100 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/15 shadow-sm transition-all flex items-center gap-2"
                title="Manage all scripts, edit, bulk import, or paste from Google Sheets"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Script Library ({allStories.length})</span>
              </button>

              <button
                onClick={() => {
                  setContentManagerTab('sheets');
                  setShowContentManagerModal(true);
                }}
                className="px-3.5 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center gap-2"
                title="Import 120 days directly from Google Sheet TSV"
              >
                <Table className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Google Sheet Import</span>
              </button>

              <button
                onClick={() => setShowHowToUseModal(true)}
                className="px-3.5 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center gap-2"
                title="View recording workflow and OBS tips"
              >
                <HelpCircle className="w-4 h-4" style={{ color: activeBrand.colors.accent.hex }} />
                <span>Guide</span>
              </button>

              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="p-2.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl border border-white/10 transition-all"
                  title="Sign Out from Cloud"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsCleanMode(true)}
                className="px-5 py-2.5 text-xs font-black rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-2 hover:scale-[1.02]"
                style={{
                  backgroundColor: activeBrand.colors.accent.hex,
                  color: '#061210',
                }}
                title="Open fullscreen clean screen recording canvas (F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Screen Record Mode (F)</span>
              </button>
            </div>
          </div>

          {/* Quick Day Switcher & CEFR Level Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0">
                Level Filter:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedLevelFilter('all')}
                  style={
                    selectedLevelFilter === 'all'
                      ? {
                          backgroundColor: activeBrand.colors.accent.hex,
                          color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                        }
                      : {}
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedLevelFilter === 'all'
                      ? 'shadow-modern-glow font-black'
                      : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700/80 border border-white/5'
                  }`}
                >
                  All (120)
                </button>
                {CEFR_LEVELS.map((lvl) => {
                  const isActive = selectedLevelFilter === lvl.code;
                  return (
                    <button
                      key={lvl.code}
                      onClick={() => {
                        setSelectedLevelFilter(lvl.code);
                        const firstOfLevel = allStories.find(
                          (s) => (s.level || getLevelFromDay(s.day)).toUpperCase() === lvl.code
                        );
                        if (firstOfLevel) {
                          setSelectedStory(firstOfLevel);
                          setActiveParagraphIndex(0);
                          setTimerSeconds(0);
                          setIsTimerRunning(false);
                          setIsAutoScrolling(false);
                          setAudioURL(null);
                        }
                      }}
                      style={
                        isActive
                          ? {
                              backgroundColor: activeBrand.colors.accent.hex,
                              color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                            }
                          : {}
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'shadow-modern-glow font-black'
                          : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700/80 border border-white/5'
                      }`}
                      title={`${lvl.name} (${lvl.range})`}
                    >
                      {lvl.code}
                    </button>
                  );
                })}
              </div>

              <span className="text-stone-700 mx-1">|</span>

              <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0">
                Active Day:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto max-w-xl py-0.5 scrollbar-thin">
                {filteredStories.map((s) => {
                  const isSelected = s.id === selectedStory.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStory(s);
                        setActiveParagraphIndex(0);
                        setTimerSeconds(0);
                        setIsTimerRunning(false);
                        setIsAutoScrolling(false);
                        setAudioURL(null);
                      }}
                      style={
                        isSelected
                          ? {
                              backgroundColor: activeBrand.colors.accent.hex,
                              color: activeBrand.colors.accent.textDark ? '#061210' : '#FFFFFF',
                            }
                          : {}
                      }
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'shadow-modern-glow font-black'
                          : 'bg-stone-800/90 hover:bg-stone-700 text-stone-300 border border-white/5'
                      }`}
                    >
                      <span>Day {s.day}</span>
                      {s.level && (
                        <span
                          className={`text-[9px] px-1 rounded font-sans ${
                            isSelected ? 'bg-black/25 text-inherit' : 'bg-black/20 text-stone-400'
                          }`}
                        >
                          {s.level}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Day</span>
            </button>
          </div>
        </section>
      )}

      {/* Clean Screen Recording Watermark & Top Banner */}
      {isCleanMode && (
        <div className="fixed top-4 right-5 z-40 flex items-center gap-3 select-none pointer-events-none">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
            <LogoMark brand={activeBrand} size="xs" layout="icon-only" />
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-white tracking-wider font-brand leading-none">
                SPEAK IN PROGRESS
              </span>
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest leading-none mt-0.5">
                Day {selectedStory.day} · {selectedStory.level || getLevelFromDay(selectedStory.day)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Teleprompter Surface */}
      <div className="relative bg-[#060b09] border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-card-elevated overflow-hidden">
        {/* Stage Tabs Navigation */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-stone-950/80 px-4 sm:px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'intro', label: '1. Voiceover Intro', icon: Radio },
              { id: 'story', label: '2. Story Reading', icon: BookOpen },
              { id: 'expressions', label: '3. Key Expressions', icon: Sparkles },
              { id: 'retelling', label: '4. Unscripted Retelling', icon: Mic },
              { id: 'log', label: '5. Private Log', icon: CheckSquare },
            ].map((stage) => {
              const isActive = currentStage === stage.id;
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setCurrentStage(stage.id as any);
                    if (stage.id === 'story') setActiveParagraphIndex(0);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenEditModal(selectedStory)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-all text-xs flex items-center gap-1"
              title="Edit this day's story text or vocabulary"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Script</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            STAGE 1: VOICE-OVER INTRO (Customized for Faceless Recording)
            ========================================================= */}
        {currentStage === 'intro' && (() => {
          const plainIntroText = selectedStory.introHook
            ? selectedStory.introHook.replace(/^"|"$/g, '')
            : `Hey everyone, welcome back to Speak in Progress! Today is Day ${selectedStory.day} of our spoken English journey. In this video, I'm working on ${selectedStory.focusSkill.toLowerCase()} through a real-world story about "${selectedStory.title}". Let's get right into it!`;

          return (
            <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  <span>Day {selectedStory.day}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>{selectedStory.level || getLevelFromDay(selectedStory.day)}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>15-Second Intro Hook</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
                  {selectedStory.title}
                </h2>
                <p className="text-sm text-stone-400 max-w-xl mx-auto">
                  Read this opening script to greet your viewers naturally before jumping into today's practice story.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-stone-950 border border-emerald-500/20 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Suggested 15-Second Voiceover Script</span>
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-emerald-400">~15 sec</span>
                    <button
                      onClick={() => handleCopyIntro(plainIntroText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-200 transition-all border border-white/10"
                      title="Copy script to clipboard"
                    >
                      {copiedIntro ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-stone-100 leading-relaxed font-sans">
                  {selectedStory.introHook ? (
                    selectedStory.introHook.replace(/^"|"$/g, '')
                  ) : (
                    <>
                      "Hey everyone, welcome back to Speak in Progress! Today is{' '}
                      <span className="text-emerald-400 font-bold">Day {selectedStory.day}</span> of our spoken English journey.
                      In this video, I'm working on{' '}
                      <span className="text-emerald-300 font-semibold">{selectedStory.focusSkill.toLowerCase()}</span> through
                      a real-world story about <span className="text-white font-bold">"{selectedStory.title}"</span>. Let's get right into it!"
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => advanceStage(1)}
                  className="px-6 py-3 text-xs font-black rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-modern-glow"
                >
                  <span>Continue to Step 2: Story Reading</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* =========================================================
            STAGE 2: STORY READING (Prompter Canvas)
            ========================================================= */}
        {currentStage === 'story' && (
          <div className="relative">
            {/* Reading Mode Switcher & Focus Beam Controls */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-stone-950/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-semibold">Mode:</span>
                <button
                  onClick={() => setPrompterMode('focus')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    prompterMode === 'focus'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  Focus by Paragraph
                </button>
                <button
                  onClick={() => setPrompterMode('scroll')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    prompterMode === 'scroll'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  Continuous Auto-Scroll
                </button>
              </div>

              <div className="flex items-center gap-3 text-stone-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showReadingBeam}
                    onChange={(e) => setShowReadingBeam(e.target.checked)}
                    className="accent-emerald-400"
                  />
                  <span>Eye-line Beam</span>
                </label>
                <span className="font-mono">{storyWordCount} words</span>
              </div>
            </div>

            {/* Visual Eye-line Beam Overlay */}
            {showReadingBeam && (
              <div
                className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 border-y border-emerald-500/25 bg-emerald-500/[0.04] z-10 flex items-center justify-between px-6"
                aria-hidden="true"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
                  Focus Line
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
                  Natural Pace
                </span>
              </div>
            )}

            {/* Story Text Scroll Container */}
            <div
              ref={teleprompterContainerRef}
              className="h-[460px] sm:h-[520px] overflow-y-auto px-6 sm:px-16 py-20 space-y-8 select-text relative scroll-smooth focus:outline-none"
              tabIndex={0}
            >
              <div className="text-center pb-6 space-y-2 border-b border-white/[0.06] mb-6">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-stone-400 font-mono">
                  <span className="text-emerald-400 font-bold">DAY {selectedStory.day}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span className="text-stone-300">{selectedStory.level || getLevelFromDay(selectedStory.day)}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>{selectedStory.topic || 'Fluency Story'}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>~{selectedStory.estimatedReadTime || '2 min'}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white font-brand">
                  {selectedStory.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <p className="text-xs text-stone-400">
                    Speaking Focus: <span className="text-emerald-300 font-medium">{selectedStory.focusSkill}</span>
                  </p>
                  <button
                    onClick={() => handleCopyStory(selectedStory.storyParagraphs.join('\n\n'))}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-white transition-colors bg-stone-900/80 px-2 py-0.5 rounded border border-white/10"
                    title="Copy full story text"
                  >
                    {copiedStory ? (
                      <span className="text-emerald-400 font-bold">✓ Copied Story</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>Copy Story</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {selectedStory.storyParagraphs.map((para, idx) => {
                const isFocused = prompterMode === 'focus' && idx === activeParagraphIndex;
                return (
                  <p
                    key={idx}
                    ref={(el) => {
                      paragraphRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (prompterMode === 'focus') setActiveParagraphIndex(idx);
                    }}
                    style={{ fontSize: `${fontSize}px` }}
                    className={`leading-relaxed transition-all duration-300 cursor-pointer rounded-2xl p-4 ${
                      prompterMode === 'focus'
                        ? isFocused
                          ? 'text-white font-medium bg-emerald-500/10 border border-emerald-500/30 scale-[1.01] shadow-lg'
                          : 'text-stone-500 hover:text-stone-400'
                        : 'text-stone-200'
                    }`}
                  >
                    {para}
                  </p>
                );
              })}

              <div className="h-40" />
            </div>
          </div>
        )}

        {/* =========================================================
            STAGE 3: KEY EXPRESSIONS
            ========================================================= */}
        {currentStage === 'expressions' && (
          <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-1 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Step 3: Master 3 Conversational Expressions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
                Key Idioms & Collocations
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Explain these expressions to your audience. Notice the natural rhythm and pronunciation tip!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {selectedStory.usefulExpressions.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-stone-950 border border-white/10 space-y-2 hover:border-emerald-500/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black text-emerald-400 font-brand">
                      {exp.phrase}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Expression {idx + 1}
                      </span>
                      <button
                        onClick={() => handleCopyExpression(idx, `"${exp.phrase}" - ${exp.meaning}. Example: "${exp.example}" (Tip: ${exp.speakingTip})`)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-all border border-white/10 text-xs"
                        title="Copy expression, meaning, and example"
                      >
                        {copiedExpressionIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-400" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200">
                    <span className="font-semibold text-stone-400">Meaning:</span> {exp.meaning}
                  </p>
                  <p className="text-xs text-stone-300 italic bg-stone-900/60 p-2.5 rounded-xl border border-white/5">
                    "{exp.example}"
                  </p>
                  <p className="text-[11px] text-emerald-300 font-mono">
                    💡 Tip: {exp.speakingTip}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-3">
              <button
                onClick={() => advanceStage(1)}
                className="px-6 py-3 text-xs font-black rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-modern-glow"
              >
                <span>Continue to Step 4: Unscripted Retelling</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STAGE 4: UNSCRIPTED RETELLING
            ========================================================= */}
        {currentStage === 'retelling' && (
          <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-1 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Step 4: Speak from Memory (The Retelling Challenge)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
                Retell Today's Story in Your Own Words
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
                Do not read! Use these memory trigger anchors to speak freely for {retellingTargetSeconds} seconds.
              </p>
            </div>

            {/* Memory Trigger Anchors */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Memory Trigger Anchors
                </span>
                <button
                  onClick={() => {
                    setRevealStoryInRetelling(true);
                    setPeekCountdown(5);
                  }}
                  disabled={peekCountdown !== null}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {peekCountdown !== null ? `Peeking... (${peekCountdown}s)` : 'Peek at Story (5s limit)'}
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                {selectedStory.retellingPrompts.map((anchor, idx) => {
                  const isChecked = !!checkedAnchors[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        setCheckedAnchors((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-stone-400 line-through'
                          : 'bg-stone-900/60 border-white/5 text-stone-200 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="accent-emerald-400"
                      />
                      <span className="text-xs sm:text-sm">{anchor}</span>
                    </div>
                  );
                })}
              </div>

              {revealStoryInRetelling && (
                <div className="p-4 rounded-xl bg-stone-900 border border-emerald-500/40 space-y-2 text-xs text-stone-300 animate-fadeIn">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Quick Peek Reference
                  </span>
                  {selectedStory.storyParagraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => advanceStage(1)}
                className="px-6 py-3 text-xs font-black rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-modern-glow"
              >
                <span>Continue to Step 5: Private Reflection Log</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STAGE 5: PRIVATE LOG & REFLECTION
            ========================================================= */}
        {currentStage === 'log' && (
          <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-1 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Step 5: Private Creator Progress Reflection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
                Log Your Day {selectedStory.day} Wins
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Honest daily self-assessment builds confidence faster than perfectionism.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-white/10 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Script Independence Rating (1 = Fully read, 5 = 100% natural memory retelling):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCurrentRating(star)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        currentRating === star
                          ? 'bg-emerald-400 text-black shadow-modern-glow'
                          : 'bg-stone-900 text-stone-400 hover:text-white'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Win of the Day (Celebrate small victories):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spoke for 90 seconds without restarting the recording..."
                  value={winNotes}
                  onChange={(e) => setWinNotes(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Stumbles / Awkward Moments to Improve:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hesitated when linking past tense verbs in paragraph 2..."
                  value={stumbleNotes}
                  onChange={(e) => setStumbleNotes(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-stone-400">
                  {savedLogSuccess ? '✓ Reflection saved!' : 'Saved in your private history'}
                </span>
                <button
                  onClick={handleSaveReflection}
                  className="px-5 py-2 text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md"
                >
                  Save Daily Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            BOTTOM TELEPROMPTER CONTROLS BAR (Clean Recording HUD)
            ========================================================= */}
        {showCleanHud && (
          <div className="border-t border-white/[0.08] bg-stone-950/95 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            {/* Play/Pause & Scroll Speed */}
            <div className="flex items-center gap-3">
              {currentStage === 'story' && prompterMode === 'scroll' && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAutoScrolling((prev) => !prev)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoScrolling ? 'Pause (Space)' : 'Auto-Scroll (Space)'}</span>
                  </button>

                  <div className="flex items-center gap-2 bg-stone-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-stone-300">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="hidden sm:inline text-stone-400">Speed:</span>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(Number(e.target.value))}
                      className="w-16 sm:w-24 accent-emerald-400 cursor-pointer"
                      title={`Scroll Speed: ${scrollSpeed} px/s`}
                    />
                    <span className="font-mono text-[11px] text-stone-300 whitespace-nowrap">
                      {scrollSpeed} px/s
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono hidden md:inline">
                      (~{Math.round(scrollSpeed * 3.8)} WPM)
                    </span>
                  </div>
                </div>
              )}

              {currentStage === 'story' && prompterMode === 'focus' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveParagraphIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeParagraphIndex === 0}
                    className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white disabled:opacity-30"
                    title="Previous paragraph (Up Arrow)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-stone-300 px-2">
                    {activeParagraphIndex + 1} / {selectedStory.storyParagraphs.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveParagraphIndex((prev) =>
                        Math.min(selectedStory.storyParagraphs.length - 1, prev + 1)
                      )
                    }
                    disabled={activeParagraphIndex === selectedStory.storyParagraphs.length - 1}
                    className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white disabled:opacity-30"
                    title="Next paragraph (Down Arrow or Space)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-2 text-stone-300 text-xs">
                <Type className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="range"
                  min="20"
                  max="44"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-emerald-400 cursor-pointer"
                  title={`Font Size: ${fontSize}px`}
                />
                <span className="font-mono text-[11px] text-stone-400 w-8">{fontSize}px</span>
              </div>
            </div>

            {/* Stopwatch & Audio Rehearsal */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-900 border border-white/10 px-3 py-1.5 rounded-xl font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold">{formatTime(timerSeconds)}</span>
                <button
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className="text-[10px] uppercase font-bold text-emerald-400 hover:underline ml-1"
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                  }}
                  className="text-stone-400 hover:text-white ml-1"
                  title="Reset (R)"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Audio Rehearsal Button */}
              <button
                onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isRecordingAudio
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/10'
                }`}
              >
                {isRecordingAudio ? <Square className="w-3 h-3" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                <span>{isRecordingAudio ? `Stop (${formatTime(audioDuration)})` : 'Rehearse Mic'}</span>
              </button>

              {audioURL && (
                <button
                  onClick={downloadAudioRecording}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400"
                  title="Download Rehearsal WebM"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Clean Mode Toggle */}
              {isCleanMode ? (
                <button
                  onClick={() => setIsCleanMode(false)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                  title="Exit Clean Record Mode (F)"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsCleanMode(true)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                  title="Fullscreen Screen Record Mode (F)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Shortcut Info */}
              <button
                onClick={() => setShowCleanHud(false)}
                className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1"
                title="Hide this HUD for 100% clean recording (Press H to restore)"
              >
                <EyeOff className="w-3 h-3" />
                <span className="hidden sm:inline">Hide HUD (H)</span>
              </button>
            </div>
          </div>
        )}

        {/* When HUD is hidden in Clean Mode */}
        {!showCleanHud && (
          <button
            onClick={() => setShowCleanHud(true)}
            className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full bg-stone-900/90 border border-white/20 text-stone-400 hover:text-white backdrop-blur-md shadow-2xl transition-all"
            title="Restore HUD Controls (H)"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ====================================================
          MODAL: SCRIPT LIBRARY & CONTENT MANAGER (Cloud + Google Sheets)
          ==================================================== */}
      {showContentManagerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-white/15 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Curriculum & Script Library
                  </span>
                  {currentUser ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Cloud Synced
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      Guest / Local
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand mt-0.5">
                  120-Day Practice Scripts Manager
                </h3>
              </div>
              <button
                onClick={() => {
                  if (isFormDirty) {
                    setShowUnsavedDiscardConfirm(true);
                  } else {
                    setShowContentManagerModal(false);
                  }
                }}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'list', label: `All Practice Days (${allStories.length})`, icon: Layers },
                { id: 'add', label: '+ Add New Day', icon: Plus },
                { id: 'sheets', label: 'Google Sheet Import', icon: Table },
                { id: 'bulk', label: 'Bulk Notes & Text', icon: FileText },
                { id: 'backup', label: 'Cloud & Backup', icon: FileDown },
              ].map((tab) => {
                const isActive = contentManagerTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isFormDirty && (contentManagerTab === 'add' || contentManagerTab === 'edit')) {
                        setPendingTabSwitch(tab.id);
                        setShowUnsavedDiscardConfirm(true);
                      } else {
                        setContentManagerTab(tab.id as any);
                        if (tab.id === 'add') {
                          handleOpenAddModal();
                        }
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ====================================================
                TAB 1: ALL DAYS LIST & CEFR LEVEL FILTER
                ==================================================== */}
            {contentManagerTab === 'list' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by Day #, level, or topic keyword..."
                      value={storySearchQuery}
                      onChange={(e) => setStorySearchQuery(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLevelFilter}
                      onChange={(e) => setSelectedLevelFilter(e.target.value)}
                      className="bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-emerald-400 font-mono"
                    >
                      <option value="all">All Levels (120 Days)</option>
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl.code} value={lvl.code}>
                          {lvl.name} ({lvl.range})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleOpenAddModal}
                      className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Day</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                  {filteredStories.map((s) => {
                    const isSelected = s.id === selectedStory.id;
                    const isCustom =
                      s.id.startsWith('custom-') || s.id.startsWith('cloud-') || s.id.startsWith('sheet-');
                    const level = s.level || getLevelFromDay(s.day);

                    return (
                      <div
                        key={s.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-stone-950 border-emerald-500/60 shadow-md'
                            : 'bg-stone-950/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-emerald-400">
                              DAY {s.day < 10 ? `0${s.day}` : s.day}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              {level}
                            </span>
                            <span className="font-bold text-white text-sm truncate">{s.title}</span>
                            {s.topic && (
                              <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded">
                                {s.topic}
                              </span>
                            )}
                            {isCustom ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {currentUser ? 'CLOUD' : 'CUSTOM'}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-white/5">
                                CURRICULUM
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 truncate max-w-xl">
                            {s.focusSkill} · {s.storyParagraphs.length} paragraphs · {s.usefulExpressions.length} expressions
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setSelectedStory(s);
                              setActiveParagraphIndex(0);
                              setShowContentManagerModal(false);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-black'
                                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                            }`}
                          >
                            {isSelected ? 'Active Now' : 'Practice'}
                          </button>

                          <button
                            onClick={(e) => handleOpenEditModal(s, e)}
                            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-all"
                            title="Edit this day's script"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {isCustom && (
                            <button
                              onClick={() => setStoryToDelete(s.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-stone-800 transition-all"
                              title="Delete script"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ====================================================
                TAB 2 & 3: ADD / EDIT DAY FORM (Cloud & Local)
                ==================================================== */}
            {(contentManagerTab === 'add' || contentManagerTab === 'edit') && (
              <div className="space-y-4 text-xs max-h-[460px] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      Day Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formDayNum}
                      onChange={(e) => {
                        setFormDayNum(Number(e.target.value));
                        setIsFormDirty(true);
                      }}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      CEFR Level
                    </label>
                    <select
                      value={formLevel}
                      onChange={(e) => {
                        setFormLevel(e.target.value);
                        setIsFormDirty(true);
                      }}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-emerald-400 outline-none"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl.code} value={lvl.code}>
                          {lvl.code} ({lvl.range})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      Topic Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Job Interview, Coffee Shop"
                      value={formTopic}
                      onChange={(e) => {
                        setFormTopic(e.target.value);
                        setIsFormDirty(true);
                      }}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Coffee Shop Dilemma"
                      value={formTitle}
                      onChange={(e) => {
                        setFormTitle(e.target.value);
                        setIsFormDirty(true);
                      }}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      Spoken Focus Skill
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Natural linking & direct English thinking"
                      value={formFocusSkill}
                      onChange={(e) => {
                        setFormFocusSkill(e.target.value);
                        setIsFormDirty(true);
                      }}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>

                {/* Story Paragraphs */}
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold uppercase text-[11px] flex items-center justify-between">
                    <span>Practice Story Paragraphs (Separate paragraphs with double Enter)</span>
                    <span className="text-stone-500 font-normal">
                      ~150–250 words is ideal
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your story text here. Separate each paragraph with an empty line so the teleprompter can pace paragraph-by-paragraph..."
                    value={formStoryRawText}
                    onChange={(e) => {
                      setFormStoryRawText(e.target.value);
                      setIsFormDirty(true);
                    }}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl p-3 text-stone-100 focus:border-emerald-400 outline-none leading-relaxed font-sans text-xs"
                  />
                </div>

                {/* 3 Useful Expressions */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">
                    3 Key Conversational Expressions (Phrase, Meaning, Example, Tip)
                  </label>
                  <div className="space-y-3">
                    {formPhrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-stone-950 p-2.5 rounded-xl border border-white/5"
                      >
                        <input
                          type="text"
                          placeholder={`Phrase ${idx + 1}`}
                          value={phrase.phrase}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].phrase = e.target.value;
                            setFormPhrases(next);
                            setIsFormDirty(true);
                          }}
                          className="bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:border-emerald-400 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Meaning"
                          value={phrase.meaning}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].meaning = e.target.value;
                            setFormPhrases(next);
                            setIsFormDirty(true);
                          }}
                          className="bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:border-emerald-400 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Example sentence"
                          value={phrase.example}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].example = e.target.value;
                            setFormPhrases(next);
                            setIsFormDirty(true);
                          }}
                          className="bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:border-emerald-400 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Speaking tip"
                          value={phrase.speakingTip}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].speakingTip = e.target.value;
                            setFormPhrases(next);
                            setIsFormDirty(true);
                          }}
                          className="bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-400 focus:border-emerald-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retelling Anchors */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">
                    Memory Anchors for Retelling (One bullet point per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Point 1: Setup and opening context\nPoint 2: The turning point or mistake\nPoint 3: How it was resolved\nPoint 4: Takeaway lesson`}
                    value={formAnchorsRaw}
                    onChange={(e) => {
                      setFormAnchorsRaw(e.target.value);
                      setIsFormDirty(true);
                    }}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl p-3 text-stone-100 focus:border-emerald-400 outline-none font-mono text-[11px]"
                  />
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                {formSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    {formSuccessMessage}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (isFormDirty) {
                        setShowUnsavedDiscardConfirm(true);
                      } else {
                        setContentManagerTab('list');
                      }
                    }}
                    className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                  >
                    Back to List
                  </button>

                  <button
                    onClick={handleSaveStoryForm}
                    disabled={isFormSaving}
                    className="px-5 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isFormSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isFormSaving
                        ? 'Saving...'
                        : editingStoryId
                        ? 'Save Changes to Script'
                        : 'Save to Practice Library'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================
                TAB 4: GOOGLE SHEET / TSV IMPORTER (120 Days A1 to C2)
                ==================================================== */}
            {contentManagerTab === 'sheets' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      <Table className="w-4 h-4 text-cyan-400" />
                      <span>Google Sheet Copy-Paste Importer (120 Days A1–C2)</span>
                    </span>
                    <button
                      onClick={loadSampleSheetTemplate}
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Load Sample Sheet Format</span>
                    </button>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Have your 120 days of content in a Google Sheet? Select all rows in Google Sheets, copy them (<kbd className="font-mono bg-stone-800 px-1 py-0.5 rounded">Ctrl+C</kbd>), and paste below. The parser automatically detects columns such as <strong>Day</strong>, <strong>Level (A1–C2)</strong>, <strong>Title</strong>, <strong>Topic</strong>, <strong>Story Script</strong>, <strong>Expressions</strong>, and <strong>Anchors</strong>!
                  </p>
                </div>

                <textarea
                  rows={8}
                  placeholder={`Paste cells directly from Google Sheets here... Columns can be in any order, for example:\nDay\tLevel\tTitle\tTopic\tFocus Skill\tStory / Script\tExpressions\tRetelling Anchors\n11\tA2\tOrdering at a Busy Coffee Shop\tEveryday\tPolite ordering\tI walked in...`}
                  value={sheetImportRaw}
                  onChange={(e) => setSheetImportRaw(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-2xl p-4 text-stone-100 font-mono text-xs leading-relaxed focus:border-emerald-400 outline-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleParseSheetInput}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-stone-800 hover:bg-stone-700 transition-all border border-white/10"
                  >
                    1. Parse & Preview Days
                  </button>

                  {parsedSheetStories.length > 0 && (
                    <button
                      onClick={handleCommitSheetImport}
                      disabled={isFormSaving}
                      className="px-5 py-2 text-xs font-black text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-modern-glow flex items-center gap-1.5"
                    >
                      {isFormSaving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>
                        2. Commit {parsedSheetStories.length} Days to {currentUser ? 'Cloud Firestore' : 'Library'}
                      </span>
                    </button>
                  )}
                </div>

                {sheetImportError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                    {sheetImportError}
                  </div>
                )}

                {sheetImportSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    {sheetImportSuccess}
                  </div>
                )}

                {/* Live Preview Table */}
                {parsedSheetStories.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-xs font-bold text-stone-300">
                      Parsed Preview ({parsedSheetStories.length} Lessons Ready):
                    </div>
                    <div className="max-h-[200px] overflow-y-auto rounded-xl border border-white/10 bg-stone-950">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-white/10 bg-stone-900/60 text-stone-400 font-mono">
                            <th className="p-2">Day</th>
                            <th className="p-2">Level</th>
                            <th className="p-2">Title</th>
                            <th className="p-2">Expressions</th>
                            <th className="p-2">Story Snippet</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {parsedSheetStories.map((item, idx) => (
                            <tr key={idx} className="hover:bg-stone-900/40">
                              <td className="p-2 font-mono font-bold text-emerald-400">
                                Day {item.day}
                              </td>
                              <td className="p-2 font-mono">{item.level}</td>
                              <td className="p-2 font-bold text-white">{item.title}</td>
                              <td className="p-2 text-stone-400">
                                {item.usefulExpressions.map((e) => e.phrase).join(', ') || '—'}
                              </td>
                              <td className="p-2 text-stone-400 truncate max-w-xs">
                                {item.storyParagraphs[0]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ====================================================
                TAB 5: BULK IMPORT FROM NOTES
                ==================================================== */}
            {contentManagerTab === 'bulk' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Paste Multi-Day Notes or JSON</span>
                    <button
                      onClick={() =>
                        setBulkImportText(
`Day 11: Standing Your Ground in Negotiations
Level: B2
Topic: Professional Assertiveness
Skill: Firm but polite spoken phrasing
Early in my career, I assumed being agreeable was the only way to build trust. Every time a colleague asked for an out-of-scope feature, my default answer was yes.
---
Expressions:
stand one's ground | maintain your position | I learned to stand my ground on delivery estimates.
out of scope | beyond agreed boundary | That change was completely out of scope.
---
Anchors:
- Default habit of always saying yes
- Chronic exhaustion and late nights
- Mentor advice on true value of time
---
Day 12: The Art of Unprepared Small Talk
Level: B1
Topic: Casual Networking
Skill: Spontaneous conversation starters
Last week I arrived twenty minutes early for a design meetup. Instead of staring at my phone, I decided to speak to the person standing next to me.
---
Anchors:
- Arriving early at the meetup
- Choosing to put phone away
- Opening with a simple observation`
                        )
                      }
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Load Sample Block Template</span>
                    </button>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Paste markdown blocks or JSON arrays. Blocks can be separated with <code className="font-mono bg-stone-800 px-1 py-0.5 rounded">---</code>.
                  </p>
                </div>

                <textarea
                  rows={8}
                  placeholder={`Paste your content blocks here...\nDay 11: Title\nLevel: B2\nSkill: Fluent linking\nStory paragraph...\n---\nAnchors:\n- Point 1\n- Point 2\n---\nDay 12: Next Title...`}
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-2xl p-4 text-stone-100 font-mono text-xs leading-relaxed focus:border-emerald-400 outline-none"
                />

                {bulkImportNotice && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    {bulkImportNotice}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setContentManagerTab('list')}
                    className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                  >
                    Back to List
                  </button>

                  <button
                    onClick={handleRunBulkImport}
                    disabled={isFormSaving}
                    className="px-5 py-2.5 text-xs font-black text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Import All Pasted Days</span>
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================
                TAB 6: CLOUD & BACKUP
                ==================================================== */}
            {contentManagerTab === 'backup' && (
              <div className="space-y-4 text-xs">
                {/* Cloud Account Status Card */}
                <div className="p-5 bg-stone-950 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Cloud className="w-4 h-4 text-emerald-400" />
                      <span>Cloud Firestore Synchronization</span>
                    </div>
                    {currentUser && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  {currentUser ? (
                    <div className="space-y-2">
                      <p className="text-stone-300 text-xs">
                        Signed in as <span className="font-bold text-white">{currentUser.email}</span>. All your script edits, new days, and custom stories are backed up in real-time to Google Cloud Firestore and accessible across all your devices.
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-rose-400 bg-stone-900 hover:bg-stone-800 transition-all border border-rose-500/20 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-stone-400 text-xs leading-relaxed">
                        You are currently in <strong>Guest Mode</strong> (scripts are saved only in your current browser). Sign in with Google to enable permanent multi-device Cloud Firestore storage!
                      </p>
                      <button
                        onClick={handleGoogleSignIn}
                        className="px-4 py-2 text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-modern-glow"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-stone-950 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <FileDown className="w-4 h-4 text-emerald-400" />
                      <span>Download JSON Backup</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Export a local file backup of all {allStories.length} practice days to your PC.
                    </p>
                    <button
                      onClick={handleExportAllJSON}
                      className="px-4 py-2 text-xs font-bold rounded-xl text-stone-100 bg-stone-800 hover:bg-stone-700 transition-all flex items-center gap-1.5 border border-white/10"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Backup (.json)</span>
                    </button>
                  </div>

                  <div className="p-5 bg-stone-950 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <FileUp className="w-4 h-4 text-emerald-400" />
                      <span>Restore from JSON File</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Upload a previously exported backup file to restore your full library.
                    </p>
                    <label className="inline-flex px-4 py-2 text-xs font-bold rounded-xl text-stone-200 bg-stone-800 hover:bg-stone-700 transition-all cursor-pointer items-center gap-1.5 border border-white/10">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select Backup File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSONFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-stone-950 rounded-2xl border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-white font-bold text-xs flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>Reset & Clear Local Conflicts</span>
                    </div>
                    <p className="text-stone-400 text-[11px]">
                      Purge old browser cache conflicts and restore all 120 days strictly in official A1 to C2 sequence.
                    </p>
                  </div>
                  <button
                    onClick={handleResetToOfficialCurriculum}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-stone-900 hover:bg-stone-800 border border-rose-500/30 transition-all shrink-0 active:scale-95"
                  >
                    Reset to Official 120 Days
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Discarding Unsaved Form Changes */}
      {showUnsavedDiscardConfirm && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold text-white">Unsaved Changes</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              You have modified this script without saving. If you leave now, your changes will be lost. Would you like to discard them?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUnsavedDiscardConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-stone-800 rounded-xl"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Discard & Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold text-white">Delete Custom Script?</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to delete this script? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-stone-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteStory(storyToDelete)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Delete Script
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Modal */}
      {showHowToUseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-black text-white font-brand">
                  Faceless Recording & Keyboard Guide
                </h3>
              </div>
              <button
                onClick={() => setShowHowToUseModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-stone-950 border border-white/5 space-y-2">
                <span className="font-bold text-emerald-400 text-sm">
                  Recommended Faceless OBS Workflow:
                </span>
                <ol className="list-decimal pl-5 space-y-1.5 text-stone-300">
                  <li>In OBS, add a <strong>Window Capture</strong> pointing to your browser.</li>
                  <li>Press <strong>F</strong> in the app to enter Clean Screen Record Mode.</li>
                  <li>Press <strong>H</strong> to hide the control bar so your recording has zero button clutter.</li>
                  <li>Start speaking naturally! Use <strong>Spacebar</strong> to auto-scroll or advance paragraphs.</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5">
                  <span className="text-emerald-400 font-bold">Spacebar</span>: Play/Pause or Next Paragraph
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5">
                  <span className="text-emerald-400 font-bold">F</span>: Toggle Screen Record Canvas
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5">
                  <span className="text-emerald-400 font-bold">H</span>: Hide / Restore HUD
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5">
                  <span className="text-emerald-400 font-bold">R</span>: Reset Timer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
