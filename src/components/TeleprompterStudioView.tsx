/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrandIdentity, PracticeStory, ReflectionEntry } from '../types';
import { SAMPLE_STORIES } from '../data/sampleStories';
import { LogoMark } from './LogoMark';
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
} from 'lucide-react';

interface TeleprompterStudioViewProps {
  activeBrand: BrandIdentity;
}

export const TeleprompterStudioView: React.FC<TeleprompterStudioViewProps> = ({ activeBrand }) => {
  // --- Persistent Stories State (Sample + Custom + User Edited Days) ---
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

  const allStories = useMemo(() => {
    const base = SAMPLE_STORIES.map((s) => editedStoriesMap[s.id] || s);
    const customs = customStories.map((s) => editedStoriesMap[s.id] || s);
    return [...base, ...customs].sort((a, b) => a.day - b.day);
  }, [customStories, editedStoriesMap]);

  const [selectedStory, setSelectedStory] = useState<PracticeStory>(allStories[0]);

  // Make sure selectedStory stays in sync when allStories updates
  useEffect(() => {
    const current = allStories.find((s) => s.id === selectedStory.id);
    if (current) {
      setSelectedStory(current);
    } else if (allStories.length > 0) {
      setSelectedStory(allStories[0]);
    }
  }, [allStories]);

  // Stage Navigation
  const [currentStage, setCurrentStage] = useState<'intro' | 'story' | 'expressions' | 'retelling' | 'log'>('story');

  // Prompter Mode: 'focus' (Paragraph-by-Paragraph) vs 'scroll' (Smooth Continuous Auto-Scroll)
  const [prompterMode, setPrompterMode] = useState<'focus' | 'scroll'>('focus');
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);

  // Reading Settings & Faceless Screen Recording Presentation
  const [fontSize, setFontSize] = useState<number>(24);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(32); // pixels per sec
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
  const [showContentManagerModal, setShowContentManagerModal] = useState<boolean>(false);
  const [contentManagerTab, setContentManagerTab] = useState<'list' | 'add' | 'edit' | 'bulk' | 'backup'>('list');
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [showShortcutsBar, setShowShortcutsBar] = useState<boolean>(false);
  const [storySearchQuery, setStorySearchQuery] = useState<string>('');

  // Story Form State (Used for Add & Edit)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [formDayNum, setFormDayNum] = useState<number>(allStories.length + 1);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formFocusSkill, setFormFocusSkill] = useState<string>('Natural linking & past tense flow');
  const [formStoryRawText, setFormStoryRawText] = useState<string>('');
  const [formPhrases, setFormPhrases] = useState([
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
    { phrase: '', meaning: '', example: '', speakingTip: '' },
  ]);
  const [formAnchorsRaw, setFormAnchorsRaw] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

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

  // Peek Countdown Timer (auto-hides after 5s)
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

  // Estimated reading Words Per Minute
  const estimatedWpm = useMemo(() => {
    return Math.round(scrollSpeed * 3.8);
  }, [scrollSpeed]);

  // Audio Recording with Microphone
  const startAudioRecording = async () => {
    try {
      setMicNotice(null);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start(200);
      setIsRecordingAudio(true);
      setAudioDuration(0);

      audioTimerRef.current = setInterval(() => {
        setAudioDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access:', err);
      setMicNotice('Microphone access denied. You can still rehearse using the on-screen stopwatch.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
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

  // --- Story Editor & Creator Handlers ---
  const handleOpenAddModal = () => {
    setEditingStoryId(null);
    setFormDayNum(allStories.length + 1);
    setFormTitle('');
    setFormFocusSkill('Natural linking & past tense flow');
    setFormStoryRawText('');
    setFormPhrases([
      { phrase: '', meaning: '', example: '', speakingTip: '' },
      { phrase: '', meaning: '', example: '', speakingTip: '' },
      { phrase: '', meaning: '', example: '', speakingTip: '' },
    ]);
    setFormAnchorsRaw('');
    setFormError(null);
    setFormSuccessMessage(null);
    setContentManagerTab('add');
    setShowContentManagerModal(true);
  };

  const handleOpenEditModal = (story: PracticeStory) => {
    setEditingStoryId(story.id);
    setFormDayNum(story.day);
    setFormTitle(story.title);
    setFormFocusSkill(story.focusSkill);
    setFormStoryRawText(story.storyParagraphs.join('\n\n'));
    setFormPhrases(
      story.usefulExpressions.length > 0
        ? story.usefulExpressions
        : [
            { phrase: '', meaning: '', example: '', speakingTip: '' },
            { phrase: '', meaning: '', example: '', speakingTip: '' },
            { phrase: '', meaning: '', example: '', speakingTip: '' },
          ]
    );
    setFormAnchorsRaw(story.retellingPrompts.join('\n'));
    setFormError(null);
    setFormSuccessMessage(null);
    setContentManagerTab('edit');
    setShowContentManagerModal(true);
  };

  const handleSaveStoryForm = () => {
    setFormError(null);
    if (!formTitle.trim() || !formStoryRawText.trim()) {
      setFormError('Please enter at least a Story Title and Story Text to save.');
      return;
    }

    const paras = formStoryRawText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const anchorList = formAnchorsRaw.trim()
      ? formAnchorsRaw
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean)
      : paras.map((p, i) => `Point ${i + 1}: ${p.slice(0, 50)}...`);

    const validPhrases = formPhrases.filter((p) => p.phrase.trim().length > 0);
    const finalPhrases =
      validPhrases.length > 0
        ? validPhrases
        : [
            {
              phrase: 'take it in stride',
              meaning: 'To deal with a challenge or mistake calmly without panic.',
              example: 'I learned to take speaking mistakes in stride.',
              speakingTip: 'Smooth linking: take-it in stride.',
            },
            {
              phrase: 'step out of comfort zone',
              meaning: 'To do things you are not accustomed to doing.',
              example: 'Speaking English on video forced me to step out of my comfort zone.',
              speakingTip: 'Emphasize "comfort zone" with steady pacing.',
            },
            {
              phrase: 'stick with it',
              meaning: 'To continue practicing daily despite difficulties.',
              example: 'If you stick with it daily, fluency will follow naturally.',
              speakingTip: 'Keep "stick with" crisp without hesitation.',
            },
          ];

    if (editingStoryId) {
      // Modifying an existing story
      const targetStory = allStories.find((s) => s.id === editingStoryId);
      const isCustom = editingStoryId.startsWith('custom-');

      const updatedStory: PracticeStory = {
        id: editingStoryId,
        day: formDayNum,
        title: formTitle.trim(),
        focusSkill: formFocusSkill.trim() || 'Natural pacing and pronunciation',
        estimatedReadTime: `${Math.max(1, Math.ceil(paras.join(' ').split(/\s+/).length / 130))} min`,
        storyParagraphs: paras,
        usefulExpressions: finalPhrases,
        retellingPrompts: anchorList,
        reflectionPrompts: targetStory?.reflectionPrompts || [
          'Did I speak from memory during retelling?',
          'Where was my pace most natural?',
        ],
      };

      if (isCustom) {
        const nextCustoms = customStories.map((s) => (s.id === editingStoryId ? updatedStory : s));
        setCustomStories(nextCustoms);
        localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(nextCustoms));
      } else {
        const nextEdited = { ...editedStoriesMap, [editingStoryId]: updatedStory };
        setEditedStoriesMap(nextEdited);
        localStorage.setItem('speak_in_progress_edited_stories', JSON.stringify(nextEdited));
      }

      setSelectedStory(updatedStory);
      setFormSuccessMessage(`✓ Day ${formDayNum} updated successfully!`);
      setTimeout(() => {
        setShowContentManagerModal(false);
        setFormSuccessMessage(null);
      }, 1200);
    } else {
      // Adding a brand new custom story
      const newStory: PracticeStory = {
        id: `custom-story-${Date.now()}`,
        day: formDayNum,
        title: formTitle.trim(),
        focusSkill: formFocusSkill.trim() || 'Natural pacing and pronunciation',
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
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));

      setSelectedStory(newStory);
      setFormSuccessMessage(`✓ Day ${formDayNum} added to your library!`);
      setTimeout(() => {
        setShowContentManagerModal(false);
        setFormSuccessMessage(null);
      }, 1200);
    }
  };

  const handleDuplicateStory = (story: PracticeStory) => {
    const nextDay = Math.max(...allStories.map((s) => s.day), 0) + 1;
    const duplicated: PracticeStory = {
      ...story,
      id: `custom-story-${Date.now()}`,
      day: nextDay,
      title: `${story.title} (Clone)`,
    };
    const updated = [...customStories, duplicated];
    setCustomStories(updated);
    localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));
    setSelectedStory(duplicated);
  };

  const handleDeleteCustomStory = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStoryToDelete(storyId);
  };

  const confirmDeleteCustomStory = (storyId: string) => {
    const updated = customStories.filter((s) => s.id !== storyId);
    setCustomStories(updated);
    localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));

    // Also remove from edited map if present
    if (editedStoriesMap[storyId]) {
      const nextMap = { ...editedStoriesMap };
      delete nextMap[storyId];
      setEditedStoriesMap(nextMap);
      localStorage.setItem('speak_in_progress_edited_stories', JSON.stringify(nextMap));
    }

    setSelectedStory(SAMPLE_STORIES[0]);
    setStoryToDelete(null);
  };

  // Bulk Import Parser
  const handleRunBulkImport = () => {
    const raw = bulkImportText.trim();
    if (!raw) {
      setBulkImportNotice('Please paste your content text or JSON first.');
      return;
    }

    // 1. Try parsing as JSON array
    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.map((item: any, idx: number) => ({
            id: item.id || `custom-import-${Date.now()}-${idx}`,
            day: Number(item.day) || allStories.length + idx + 1,
            title: item.title || `Day ${item.day || idx + 1} Practice`,
            focusSkill: item.focusSkill || 'Natural speaking flow and pronunciation',
            estimatedReadTime: item.estimatedReadTime || '2 min 30 sec',
            storyParagraphs: Array.isArray(item.storyParagraphs) && item.storyParagraphs.length > 0
              ? item.storyParagraphs
              : ['Story text paragraph...'],
            usefulExpressions: Array.isArray(item.usefulExpressions) ? item.usefulExpressions : [],
            retellingPrompts: Array.isArray(item.retellingPrompts) ? item.retellingPrompts : [],
            reflectionPrompts: Array.isArray(item.reflectionPrompts)
              ? item.reflectionPrompts
              : ['Did I speak from memory during retelling?'],
          }));

          const updated = [...customStories, ...validated];
          setCustomStories(updated);
          localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));
          setBulkImportNotice(`✓ Successfully imported ${validated.length} days from JSON!`);
          setBulkImportText('');
          return;
        }
      } catch (err) {
        console.warn('JSON parse attempt failed, falling back to text parsing', err);
      }
    }

    // 2. Parse structured markdown / text blocks
    // Supported block delimiters: "=== Day", "Day 11:", "Day 12 -"
    const blocks = raw.split(/(?:={3,}\s*Day|\n(?=Day\s+\d+[:\-–]))/i).filter((b) => b.trim().length > 0);
    const importedList: PracticeStory[] = [];

    blocks.forEach((block, idx) => {
      const lines = block.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const firstLine = lines[0];
      const match = firstLine.match(/^(?:Day\s*)?(\d+)\s*[:\-–]\s*(.+)$/i);
      const dayNum = match ? parseInt(match[1]) : allStories.length + importedList.length + 1;
      const title = match ? match[2].trim() : firstLine.replace(/={2,}/g, '').trim();

      let focusSkill = 'Natural pacing & unscripted retelling flow';
      let contentLines = lines.slice(1);
      if (contentLines[0] && contentLines[0].toLowerCase().startsWith('focus:')) {
        focusSkill = contentLines[0].replace(/^focus:\s*/i, '').trim();
        contentLines = contentLines.slice(1);
      }

      const fullContent = contentLines.join('\n');
      const sections = fullContent.split(/\n\s*---\s*\n/);
      const storyText = sections[0] || '';
      const paragraphs = storyText
        .split('\n\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0 && !p.toLowerCase().startsWith('expressions:') && !p.toLowerCase().startsWith('anchors:'));

      // Expressions
      const expressions: any[] = [];
      const expSection = sections.find((s) => s.toLowerCase().includes('expression') || s.toLowerCase().includes('phrase'));
      if (expSection) {
        const expLines = expSection.split('\n').filter((l) => l.includes('|'));
        expLines.forEach((el) => {
          const parts = el.split('|').map((p) => p.trim());
          if (parts[0]) {
            expressions.push({
              phrase: parts[0],
              meaning: parts[1] || 'Key conversational idiom',
              example: parts[2] || 'Used naturally in storytelling.',
              speakingTip: parts[3] || 'Speak smoothly without hesitating.',
            });
          }
        });
      }

      // Anchors
      const anchors: string[] = [];
      const anchorSection = sections.find((s) => s.toLowerCase().includes('retell') || s.toLowerCase().includes('anchor') || s.toLowerCase().includes('point'));
      if (anchorSection) {
        const aLines = anchorSection.split('\n').map((l) => l.replace(/^[-*•]\s*/, '').trim()).filter((l) => l.length > 0 && !l.toLowerCase().startsWith('anchor') && !l.toLowerCase().startsWith('retell'));
        aLines.forEach((al) => anchors.push(al));
      }

      const finalParas = paragraphs.length > 0 ? paragraphs : [storyText || 'Story text...'];
      const finalAnchors = anchors.length > 0 ? anchors : finalParas.map((p, i) => `Point ${i + 1}: ${p.slice(0, 45)}...`);

      importedList.push({
        id: `custom-import-${Date.now()}-${idx}`,
        day: dayNum,
        title: title || `Day ${dayNum} Practice Session`,
        focusSkill,
        estimatedReadTime: `${Math.max(1, Math.ceil(finalParas.join(' ').split(/\s+/).length / 130))} min`,
        storyParagraphs: finalParas,
        usefulExpressions: expressions.length > 0 ? expressions : [
          {
            phrase: 'take it in stride',
            meaning: 'To deal with a challenge or mistake calmly without panic.',
            example: 'I learned to take speaking mistakes in stride.',
            speakingTip: 'Smooth linking: take-it in stride.',
          },
        ],
        retellingPrompts: finalAnchors,
        reflectionPrompts: [
          'Did I express each retelling point smoothly in my own words?',
          'Did I pause naturally instead of using filler words?',
        ],
      });
    });

    if (importedList.length > 0) {
      const updated = [...customStories, ...importedList];
      setCustomStories(updated);
      localStorage.setItem('speak_in_progress_custom_stories', JSON.stringify(updated));
      setBulkImportNotice(`✓ Successfully imported ${importedList.length} days into your library!`);
      setBulkImportText('');
    } else {
      setBulkImportNotice('Could not parse any days. Please click "Load Sample Template" to see the expected format.');
    }
  };

  const loadSampleBulkTemplate = () => {
    setBulkImportText(
`Day 11: The Freelance Client Pitch
Focus: Communicating value and handling client questions with ease
I had been preparing for the prospective client call for nearly four days. The client was a digital agency based in Toronto, and they were looking for a designer who could lead their visual rebranding. In the past, I would spend the entire hour worrying about my accent.

When the Zoom room opened, I took a deliberate breath, smiled, and started by asking about their core mission rather than diving straight into my portfolio. That small adjustment changed the entire dynamic of the conversation from a nervous interrogation into a mutual creative partnership.

---
Expressions:
break the ice | To make people feel relaxed | A warm greeting helped break the ice.
stand one's ground | To maintain your position confidently | I learned to stand my ground on pricing.
---
Anchors:
- Preparing for the Toronto agency client pitch
- The old habit of worrying about accent and pronunciation
- Asking about their mission before opening the portfolio
- Converting an interview into a collaborative partnership

Day 12: Learning When to Say No
Focus: Professional assertiveness and setting boundaries politely
Early in my career, I assumed that being agreeable was the only way to build professional trust. Every time a colleague asked for a favor or a client requested an out-of-scope feature, my default answer was an immediate "Yes, absolutely."

The predictable result was chronic exhaustion. I was spending late nights fixing other people's emergencies while my own creative projects gathered dust. A senior mentor shared a simple truth: "Every time you say yes to something unimportant, you are quietly saying no to your own priorities."

---
Expressions:
out of scope | Beyond the agreed boundaries of a project | That extra feature was completely out of scope.
gather dust | To remain unused or neglected for a long time | My personal channel was gathering dust.
---
Anchors:
- The default habit of always saying yes to avoid friction
- The resulting exhaustion and late night work
- The mentor's insight on what yes really costs
- How polite boundaries actually increase professional respect`
    );
  };

  // Export all days to JSON file
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

  // Restore from JSON file
  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  // Reset to default sample days
  const handleResetToDefault = () => {
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

  const filteredStories = useMemo(() => {
    const q = storySearchQuery.toLowerCase().trim();
    if (!q) return allStories;
    return allStories.filter(
      (s) =>
        s.day.toString().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.focusSkill.toLowerCase().includes(q)
    );
  }, [allStories, storySearchQuery]);

  return (
    <div className={`space-y-6 sm:space-y-8 ${isCleanMode ? 'bg-[#030705] min-h-screen p-3 sm:p-8' : ''}`}>
      {/* Studio Header (hidden in Faceless Screen Recording Mode) */}
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
                <span>Faceless Screen-Recording Studio · PC & OBS Ready</span>
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
                  {allStories.length} Practice Days
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Designed specifically for faceless YouTube screen recordings. Read cleanly, learn 3 key expressions, and challenge yourself with unscripted retelling anchors without turning on your camera.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch sm:self-start lg:self-center">
              <button
                onClick={() => {
                  setContentManagerTab('list');
                  setShowContentManagerModal(true);
                }}
                className="px-4 py-2.5 text-xs font-bold text-stone-100 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/15 shadow-sm transition-all flex items-center gap-2"
                title="Manage all day-by-day content, edit days, or bulk import"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Manage Day Content</span>
              </button>

              <button
                onClick={() => setShowHowToUseModal(true)}
                className="px-4 py-2.5 text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl border border-white/10 shadow-sm transition-all flex items-center gap-2"
                title="View recording workflow and OBS tips"
              >
                <HelpCircle className="w-4 h-4" style={{ color: activeBrand.colors.accent.hex }} />
                <span>How to Use</span>
              </button>

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

          {/* Day Navigation Bar & Management Shortcut */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold text-stone-400 whitespace-nowrap shrink-0">
                Active Session:
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

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Day</span>
              </button>

              <button
                onClick={() => {
                  setContentManagerTab('bulk');
                  setShowContentManagerModal(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 border border-white/10 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap"
                title="Paste multiple days of notes at once"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Bulk Import Notes</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FACELESS SCREEN RECORDING CLEAN VIEWPORT (OBS / LOOM READY)
          ========================================================= */}
      {isCleanMode && (
        <div className="fixed top-3 left-3 sm:top-5 sm:left-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-stone-900/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          <LogoMark brand={activeBrand} size="xs" layout="icon-only" accentColor={activeBrand.colors.accent.hex} />
          <div className="font-brand font-black text-xs tracking-tight">
            <span className="text-white">SPEAK IN </span>
            <span style={{ color: activeBrand.colors.accent.hex }}>PROGRESS</span>
          </div>
          <span className="text-stone-500 text-[10px] font-mono">
            · Day {selectedStory.day}
          </span>
        </div>
      )}

      {/* Floating HUD in Clean Recording Mode */}
      {isCleanMode && showCleanHud && (
        <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-50 flex flex-wrap items-center gap-2 sm:gap-2.5 bg-stone-900/90 border border-white/15 p-2 rounded-2xl backdrop-blur-xl shadow-2xl animate-fade-in text-xs">
          <div className="flex items-center gap-1.5 px-2 font-mono text-xs" style={{ color: activeBrand.colors.accent.hex }}>
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="text-white font-bold">{formatTime(timerSeconds)}</span>
          </div>

          <div className="h-4 w-px bg-white/15 mx-1" />

          {/* Quick Stage Stepper in Clean Mode */}
          <div className="flex items-center gap-1">
            {[
              { id: 'intro', label: '1. Intro' },
              { id: 'story', label: '2. Story' },
              { id: 'expressions', label: '3. Phrases' },
              { id: 'retelling', label: '4. Retelling' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStage(st.id as any);
                  if (st.id === 'story') setActiveParagraphIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  currentStage === st.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/15 mx-1" />

          {/* Font Size controls */}
          <div className="flex items-center gap-1 bg-stone-950 px-2 py-0.5 rounded-lg border border-white/10 text-[11px] font-mono text-stone-300">
            <button onClick={() => setFontSize((f) => Math.max(18, f - 2))} className="hover:text-white">A-</button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize((f) => Math.min(38, f + 2))} className="hover:text-white">A+</button>
          </div>

          {/* Hide HUD shortcut */}
          <button
            onClick={() => setShowCleanHud(false)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all"
            title="Hide controls for 100% clean recording (Press 'H' to restore)"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCleanMode(false)}
            className="px-2.5 py-1 font-bold text-stone-900 bg-white hover:bg-stone-200 rounded-lg flex items-center gap-1 transition-all"
            title="Exit clean mode (F)"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Exit (F)</span>
          </button>
        </div>
      )}

      {/* Floating Restore Icon when HUD is hidden during screen recording */}
      {isCleanMode && !showCleanHud && (
        <button
          onClick={() => setShowCleanHud(true)}
          className="fixed top-4 right-4 z-50 p-2 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-400 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-40 hover:opacity-100"
          title="Restore recording HUD (or press 'H')"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* Main Teleprompter Frame */}
      <div className="bg-stone-950 border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all">
        {/* Navigation & Teleprompter Controls Bar */}
        <div className="bg-stone-900/80 border-b border-white/[0.08] px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 backdrop-blur-md">
          {/* Practice Stages: 1 to 5 */}
          <div className="flex items-center gap-1 bg-stone-950/90 p-1 rounded-xl border border-white/10 text-xs font-semibold shadow-badge-inset overflow-x-auto max-w-full">
            {[
              { id: 'intro', label: '1. Voiceover Intro' },
              { id: 'story', label: '2. Story Reading' },
              { id: 'expressions', label: '3. Expressions' },
              { id: 'retelling', label: '4. Retelling Challenge' },
              { id: 'log', label: '5. Session Log' },
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
                  title="Paragraph-by-paragraph with beam focus (Recommended for natural pacing)"
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
                onClick={() => setFontSize((f) => Math.max(18, f - 2))}
                className="px-1.5 hover:text-white font-mono"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="font-mono text-[10px] sm:text-[11px] text-stone-300">{fontSize}px</span>
              <button
                onClick={() => setFontSize((f) => Math.min(38, f + 2))}
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
                  title={`Speed: ${scrollSpeed} px/s (~${estimatedWpm} WPM)`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Teleprompter Viewport */}
        <div
          ref={teleprompterContainerRef}
          className="p-5 sm:p-8 md:p-12 min-h-[460px] max-h-[660px] overflow-y-auto space-y-6 sm:space-y-8 select-text relative scroll-smooth"
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
              <div className="font-semibold" style={{ color: activeBrand.colors.accent.hex }}>
                Focus: {selectedStory.focusSkill}
              </div>
            </div>
          </div>

          {/* ====================================================
              STAGE 1: FACELESS VOICEOVER INTRO
              ==================================================== */}
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
                    Step 1 · 15-20s Faceless Voiceover Opening
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">Speak with natural energy into mic</span>
                </div>

                <div
                  className="text-base sm:text-xl text-stone-100 leading-relaxed font-sans border-l-2 pl-4 py-1"
                  style={{ borderColor: activeBrand.colors.accent.hex }}
                >
                  “Welcome back to <strong>Speak in Progress</strong>! Today is <strong>Day {selectedStory.day}</strong> of our daily spoken English journey.
                  In today's practice session, I am working on <strong>{selectedStory.focusSkill}</strong> through a short storytelling and unscripted retelling exercise.
                  Let's jump right into the story.”
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span>Pro Tip: Smile while speaking to make your tone warm and friendly.</span>
                  <button
                    onClick={() => {
                      setCurrentStage('story');
                      setActiveParagraphIndex(0);
                    }}
                    className="px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 shadow-sm"
                    style={{
                      backgroundColor: activeBrand.colors.accent.hex,
                      color: '#061210',
                    }}
                  >
                    <span>Next: Story Reading</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              STAGE 2: STORY READING (BEAM FOCUS OR AUTO-SCROLL)
              ==================================================== */}
          {currentStage === 'story' && (
            <div className="space-y-6 max-w-4xl pb-12">
              {selectedStory.storyParagraphs.map((para, idx) => {
                const isCurrent = prompterMode === 'focus' && idx === activeParagraphIndex;
                const isPast = prompterMode === 'focus' && idx < activeParagraphIndex;
                const isFuture = prompterMode === 'focus' && idx > activeParagraphIndex;

                return (
                  <p
                    key={idx}
                    ref={(el) => {
                      paragraphRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (prompterMode === 'focus') setActiveParagraphIndex(idx);
                    }}
                    className={`leading-relaxed transition-all duration-300 rounded-2xl p-4 sm:p-5 select-text cursor-pointer ${
                      prompterMode === 'scroll'
                        ? 'text-stone-100 hover:text-white'
                        : isCurrent
                        ? 'text-white bg-stone-900/90 shadow-2xl scale-[1.01] border-l-4'
                        : isPast
                        ? 'text-stone-500 hover:text-stone-300 opacity-60'
                        : 'text-stone-400 hover:text-stone-200 opacity-40'
                    }`}
                    style={{
                      fontSize: `${fontSize}px`,
                      borderColor: isCurrent ? activeBrand.colors.accent.hex : 'transparent',
                    }}
                  >
                    {para}
                  </p>
                );
              })}

              {/* Bottom Nav on Story stage */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] text-xs">
                <span className="text-stone-400 font-mono">
                  {prompterMode === 'focus'
                    ? `Paragraph ${activeParagraphIndex + 1} of ${selectedStory.storyParagraphs.length}`
                    : `Estimated pace: ~${estimatedWpm} WPM`}
                </span>

                <button
                  onClick={() => setCurrentStage('expressions')}
                  className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Step 3: Key Expressions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              STAGE 3: 3 USEFUL EXPRESSIONS BREAKDOWN
              ==================================================== */}
          {currentStage === 'expressions' && (
            <div className="space-y-6 max-w-4xl">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Step 3 · Useful Idioms & Vocabulary in Context
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedStory.usefulExpressions.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-900/70 border border-white/10 rounded-2xl p-5 space-y-3.5 shadow-card-elevated hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-white/10">
                          Phrase #{idx + 1}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <h4
                        className="text-lg font-black font-brand tracking-tight"
                        style={{ color: activeBrand.colors.accent.hex }}
                      >
                        “{exp.phrase}”
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed font-medium">
                        {exp.meaning}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                      <div className="text-stone-400 italic">
                        “{exp.example}”
                      </div>
                      <div className="text-[11px] text-emerald-300/90 font-mono bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                        Tip: {exp.speakingTip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStage('retelling')}
                  className="px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-modern-glow transition-all"
                  style={{
                    backgroundColor: activeBrand.colors.accent.hex,
                    color: '#061210',
                  }}
                >
                  <span>Step 4: The Retelling Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              STAGE 4: THE RETELLING CHALLENGE (CORE SPEAKING DRILL)
              ==================================================== */}
          {currentStage === 'retelling' && (
            <div className="space-y-6 max-w-3xl">
              <div
                className="bg-stone-900/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-card-elevated border"
                style={{ borderColor: `${activeBrand.colors.accent.hex}40` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{ color: activeBrand.colors.accent.hex }}
                    >
                      Step 4 · Speak Freely from Memory
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-white font-brand mt-0.5">
                      The Unscripted Retelling Challenge
                    </h3>
                  </div>

                  <button
                    onClick={triggerPeek}
                    className="px-3 py-1.5 text-xs font-mono rounded-xl border border-white/10 bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 self-start sm:self-auto"
                    title="Peek at script for 5 seconds if completely stuck"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{peekCountdown !== null ? `Peeking (${peekCountdown}s)` : 'Quick 5s Peek'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Do NOT read the story text word-for-word. Look at the 4 memory anchors below, breathe calmly, and express each point in your own words. It is completely fine to pause, rephrase, or use simple words—authenticity creates fluency!
                </p>

                {/* 4 Memory Clues / Bullet Anchors */}
                <div className="space-y-2.5 pt-1">
                  {selectedStory.retellingPrompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleAnchorCheck(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs sm:text-sm ${
                        checkedAnchors[idx]
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-stone-950/80 border-white/10 text-stone-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare
                          className={`w-4 h-4 shrink-0 ${
                            checkedAnchors[idx] ? 'text-emerald-400' : 'text-stone-600'
                          }`}
                        />
                        <span className={checkedAnchors[idx] ? 'line-through text-stone-400' : 'font-medium'}>
                          {prompt}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {checkedAnchors[idx] ? 'Covered' : 'Point ' + (idx + 1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Script Reveal Peek Card */}
                {revealStoryInRetelling && (
                  <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/40 text-xs text-stone-300 space-y-2 animate-fade-in font-sans">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Quick Peek Reminder:</div>
                    {selectedStory.storyParagraphs.map((p, i) => (
                      <p key={i} className="text-stone-300 leading-relaxed text-xs">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
                  <span className="text-stone-400 font-mono">
                    Retelling Target: ~{retellingTargetSeconds} seconds
                  </span>

                  <button
                    onClick={() => setCurrentStage('log')}
                    className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    style={{
                      backgroundColor: activeBrand.colors.accent.hex,
                      color: '#061210',
                    }}
                  >
                    <span>Final Step: Reflection Log</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              STAGE 5: SESSION LOG & REFLECTION
              ==================================================== */}
          {currentStage === 'log' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-stone-900/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-card-elevated border border-white/10">
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: activeBrand.colors.accent.hex }}
                >
                  Step 5 · Private Progress Archive
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white font-brand">
                  Day {selectedStory.day} Self-Reflection
                </h3>

                {/* Rating */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Script Independence (1 = Heavily reliant, 5 = 100% Free retelling)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentRating(num)}
                        className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all ${
                          currentRating === num
                            ? 'bg-emerald-500 text-black shadow-md scale-105'
                            : 'bg-stone-950 text-stone-400 border border-white/10 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="text-xs text-stone-400 ml-2">
                      {currentRating === 1 && 'Heavy script dependence'}
                      {currentRating === 3 && 'Retold with 2-3 glances'}
                      {currentRating === 5 && '100% Free unscripted retelling!'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Stumble Moments
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hesitated when recalling the ending in paragraph 3"
                    value={stumbleNotes}
                    onChange={(e) => setStumbleNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Win of the Day
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Expressed all 4 retelling points naturally without restarting the video!"
                    value={winNotes}
                    onChange={(e) => setWinNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">
                    Next Session Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Slower breathing and clearer sentence transitions"
                    value={nextFocusNotes}
                    onChange={(e) => setNextFocusNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400 shadow-badge-inset"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleSaveReflection}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-modern-glow active:scale-95 transition-all flex items-center gap-1.5"
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
                      ✓ Saved to Progress Archive!
                    </span>
                  )}
                </div>
              </div>
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
                <span>{isRecordingAudio ? `Stop (${formatTime(audioDuration)})` : 'Rehearse Voice with Mic'}</span>
              </button>

              {audioURL && (
                <div className="flex items-center gap-2">
                  <audio controls src={audioURL} className="h-7 max-w-[170px] sm:max-w-[220px]" />
                  <button
                    onClick={downloadAudioRecording}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all"
                    title="Download audio recording"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] sm:text-xs text-stone-400 font-mono text-left sm:text-right">
              <span>Day {selectedStory.day} of {allStories.length}</span>
              <span className="text-stone-600 mx-2">·</span>
              <span>Screen Recording Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          MODAL: CONTENT & DAY LIBRARY MANAGER
          ==================================================== */}
      {showContentManagerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-white/15 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Curriculum & Session Library
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-brand mt-0.5">
                  Manage Day-by-Day Content
                </h3>
              </div>
              <button
                onClick={() => setShowContentManagerModal(false)}
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
                { id: 'bulk', label: 'Bulk Import Notes', icon: FileText },
                { id: 'backup', label: 'Backup & JSON', icon: FileDown },
              ].map((tab) => {
                const isActive = contentManagerTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setContentManagerTab(tab.id as any);
                      if (tab.id === 'add') {
                        setEditingStoryId(null);
                        setFormDayNum(Math.max(...allStories.map((s) => s.day), 0) + 1);
                        setFormTitle('');
                        setFormStoryRawText('');
                        setFormAnchorsRaw('');
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

            {/* TAB 1: ALL DAYS LIST */}
            {contentManagerTab === 'list' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by Day # (e.g. Day 7) or topic keyword..."
                      value={storySearchQuery}
                      onChange={(e) => setStorySearchQuery(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Day</span>
                  </button>
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                  {filteredStories.map((s) => {
                    const isSelected = s.id === selectedStory.id;
                    const isCustom = s.id.startsWith('custom-');
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-emerald-400">
                              DAY {s.day < 10 ? `0${s.day}` : s.day}
                            </span>
                            <span className="font-bold text-white text-sm truncate">{s.title}</span>
                            {isCustom ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                CUSTOM
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                                STARTER
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-400 truncate">
                            Focus: {s.focusSkill} · {s.storyParagraphs.length} paragraphs · {s.usefulExpressions.length} phrases
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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
                            {isSelected ? 'Active' : 'Select'}
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(s)}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all"
                            title="Edit this day's script and phrases"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicateStory(s)}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all"
                            title="Duplicate as template for next day"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {isCustom && (
                            <button
                              onClick={() => handleDeleteCustomStory(s.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                              title="Delete custom day"
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

            {/* TAB 2 & 3: ADD OR EDIT FORM */}
            {(contentManagerTab === 'add' || contentManagerTab === 'edit') && (
              <div className="space-y-4 text-xs max-h-[460px] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">Day #</label>
                    <input
                      type="number"
                      min="1"
                      value={formDayNum}
                      onChange={(e) => setFormDayNum(parseInt(e.target.value) || 1)}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">Day Topic / Story Title</label>
                    <input
                      type="text"
                      placeholder="e.g. My First International Client Meeting"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 font-bold focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">Today's Speaking Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Connecting ideas with past tense verbs & natural pauses"
                    value={formFocusSkill}
                    onChange={(e) => setFormFocusSkill(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-stone-300 font-semibold uppercase text-[11px]">
                      Story Text (Separate paragraphs with double enter)
                    </label>
                    <span className="text-[10px] text-stone-500 font-mono">2 to 4 paragraphs recommended</span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder={`Paragraph 1: Describe the initial situation or routine...\n\nParagraph 2: What challenge, turning point, or unexpected moment occurred...\n\nParagraph 3: How you reacted, what resolved it, and personal takeaway.`}
                    value={formStoryRawText}
                    onChange={(e) => setFormStoryRawText(e.target.value)}
                    className="w-full bg-stone-950 border border-white/10 rounded-xl p-3 text-stone-100 focus:border-emerald-400 outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* 3 Useful Expressions */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-stone-300 font-semibold uppercase text-[11px] block">
                    3 Key Expressions / Idioms (Optional but recommended)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {formPhrases.map((p, idx) => (
                      <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-400">Phrase #{idx + 1}</span>
                        <input
                          type="text"
                          placeholder="e.g. hit the ground running"
                          value={p.phrase}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].phrase = e.target.value;
                            setFormPhrases(next);
                          }}
                          className="w-full bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-400 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Meaning in plain English"
                          value={p.meaning}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].meaning = e.target.value;
                            setFormPhrases(next);
                          }}
                          className="w-full bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:border-emerald-400 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Example sentence"
                          value={p.example}
                          onChange={(e) => {
                            const next = [...formPhrases];
                            next[idx].example = e.target.value;
                            setFormPhrases(next);
                          }}
                          className="w-full bg-stone-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-stone-400 focus:border-emerald-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retelling Anchors */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <label className="text-stone-300 font-semibold uppercase text-[11px]">
                    Memory Anchors for Retelling (Bullet points, one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Point 1: Describe the initial setup\nPoint 2: The turning point or mistake\nPoint 3: How you handled it\nPoint 4: The lesson learned`}
                    value={formAnchorsRaw}
                    onChange={(e) => setFormAnchorsRaw(e.target.value)}
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
                    onClick={() => setContentManagerTab('list')}
                    className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                  >
                    Back to List
                  </button>

                  <button
                    onClick={handleSaveStoryForm}
                    className="px-5 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{editingStoryId ? 'Save Changes' : 'Add to Practice Library'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: BULK IMPORT FROM NOTES */}
            {contentManagerTab === 'bulk' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-stone-950 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Paste Multi-Day Content from Notes</span>
                    <button
                      onClick={loadSampleBulkTemplate}
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Load Sample Template</span>
                    </button>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Have 10, 30, or 60 days of stories in Notion, Google Docs, or a text file? Paste them below in plain text or JSON format. Our parser will automatically separate each day and load them into your practice library!
                  </p>
                </div>

                <textarea
                  rows={10}
                  placeholder={`Paste your prepared text here... E.g:\n\nDay 11: Story Title\nFocus: Speaking skill\nParagraph 1 text here...\n\nParagraph 2 text here...\n---\nAnchors:\n- Point 1\n- Point 2\n\nDay 12: Next Story Title...`}
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
                    View Days List
                  </button>

                  <button
                    onClick={handleRunBulkImport}
                    className="px-5 py-2.5 text-xs font-black text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Import All Pasted Days</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: BACKUP & RESTORE */}
            {contentManagerTab === 'backup' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-stone-950 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <FileDown className="w-4 h-4 text-emerald-400" />
                      <span>Download All Content (JSON)</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Save a complete backup of all {allStories.length} practice days to your computer. Never lose your hard work.
                    </p>
                    <button
                      onClick={handleExportAllJSON}
                      className="px-4 py-2 text-xs font-bold rounded-xl text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Backup (.json)</span>
                    </button>
                  </div>

                  <div className="p-5 bg-stone-950 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <FileUp className="w-4 h-4 text-emerald-400" />
                      <span>Restore from Backup (JSON)</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      Upload a previously exported curriculum JSON file to restore your full library across browsers.
                    </p>
                    <label className="inline-flex px-4 py-2 text-xs font-bold rounded-xl text-stone-200 bg-stone-800 hover:bg-stone-700 transition-all cursor-pointer items-center gap-1.5 border border-white/10">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Backup File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSONFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-stone-500 text-xs">
                    Need a clean slate? This restores the 10 starter days.
                  </div>
                  <button
                    onClick={handleResetToDefault}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-all"
                  >
                    Reset to 10 Default Starter Days
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: "HOW TO USE PROPERLY & OBS RECORDING GUIDE"
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
                  How to Record Faceless Screen Videos
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
                { id: 'obs', label: '2. OBS Setup (স্ক্রিন রেকর্ড)' },
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
                  প্রতিটি YouTube ভিডিওকে মাত্র ৫ থেকে ৭ মিনিটের একটি টানটান, গঠনমূলক ফরম্যাটে সাজান। ক্যামেরা অন না করলেও দর্শক আপনার কণ্ঠের আত্মবিশ্বাস এবং ইংরেজি বলার সত্যিকারের অগ্রগতি দেখতে আসবে:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase text-emerald-400">Part 1 · Introduction (15-20s)</div>
                    <div className="font-semibold text-white">Opening & Focus Declaration</div>
                    <p className="text-xs text-stone-400">
                      দর্শককে স্বাগত জানান, আজকের ডে নম্বর ও কী বিষয়ে অনুশীলন করছেন (যেমন: "Past tense pronunciation") তা স্ক্রিন রেকর্ড শুরু করে সংক্ষেপে বলুন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase text-emerald-400">Part 2 · Story Reading (2-3 min)</div>
                    <div className="font-semibold text-white">Teleprompter Delivery</div>
                    <p className="text-xs text-stone-400">
                      পর্দায় প্রম্পটার দেখে স্বাভাবিক গতিতে গল্পটি পড়ুন। দ্রুত না পড়ে কমা ও ফুলস্টপে পর্যাপ্ত শ্বাস নিন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase text-emerald-400">Part 3 · 3 Useful Phrases (45s-1 min)</div>
                    <div className="font-semibold text-white">Vocabulary In Context</div>
                    <p className="text-xs text-stone-400">
                      গল্প থেকে ৩টি আকর্ষণীয় phrase এবং তাদের অর্থ সহজ ইংরেজিতে ব্যাখ্যা করুন।
                    </p>
                  </div>

                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-mono font-bold text-xs uppercase text-emerald-400">Part 4 · Retelling (1-2 min)</div>
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
                  <div className="font-bold font-mono text-xs uppercase flex items-center gap-2 text-emerald-400">
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
                      <strong>Screen Record Mode (F):</strong> স্টুডিওর <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Screen Record Mode (F)</code> বোতামে চাপ দিলে সব বোতাম লুকিয়ে স্ক্রিন নিখুঁত মিনিমাল দেখাবে।
                    </li>
                    <li>
                      <strong>Hide HUD (H):</strong> রেকর্ডিং চলাকালীন <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">H</code> প্রেস করলে কন্ট্রোল বার সম্পূর্ণ লুকিয়ে যাবে এবং শুধু স্ক্রিপ্ট ও ওয়াটারমার্ক দেখা যাবে।
                    </li>
                    <li>
                      <strong>Microphone Filter:</strong> OBS Audio Filters-এ <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Noise Suppression (RNNoise)</code> অন করে নিলে ফ্যান বা ঘরের শব্দ রেকর্ড হবে না।
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
                  <div className="font-bold font-mono text-xs uppercase text-emerald-400">
                    স্বাভাবিকভাবে কথা বলার ৩টি সোনালী নিয়ম:
                  </div>
                  <ol className="space-y-2 list-decimal list-inside text-stone-200 text-xs leading-relaxed">
                    <li>
                      <strong>ভুল হলে রেকর্ড বন্ধ করবেন না ("Never Restart the Video"):</strong> আপনি যদি একটি শব্দ ভুল উচ্চারণ করেন, ঘাবড়াবেন না। হাসিমুখে বলুন—<em>"Let me rephrase that..."</em> এবং আবার বলুন। দর্শকরা রোবটের মতো নিখুঁত মানুষ চায় না, তারা আপনার সত্যিকারের চেষ্টা ও অগ্রগতি দেখতে চায়।
                    </li>
                    <li>
                      <strong>চোখের অবস্থান ("Look Ahead"):</strong> প্রম্পটারের অক্ষরের দিকে চোখ গেঁথে রাখবেন না। ৩-৪টি শব্দের একটি ক্লস্টার এক পলকে দেখে নিয়ে স্বাভাবিক কণ্ঠে বলুন।
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
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">Space</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Next Paragraph / Speed Up</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">↓ or J</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Previous Paragraph / Speed Down</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">↑ or K</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Toggle Screen Record Clean Mode</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">F</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Hide/Show Recording Controls (HUD)</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">H</kbd>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300">Reset Timer</span>
                    <kbd className="px-2 py-0.5 rounded bg-stone-800 font-mono text-emerald-400">R</kbd>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setShowHowToUseModal(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 bg-emerald-400 text-black hover:bg-emerald-300"
              >
                Got It! Back to Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-white/15 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white font-brand">Remove Custom Story?</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to remove this day from your library? This action cannot be undone.
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
