/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PracticeStory, BrandIdentity } from '../types';
import { SITE_CONFIG } from '../config/site';

export interface YouTubeTitleOption {
  id: 'standard' | 'hook' | 'series' | 'vocabulary';
  label: string;
  title: string;
}

export interface YouTubeMetadataBundle {
  day: number;
  storyTitle: string;
  level: string;
  topic: string;
  focusSkill: string;
  titles: YouTubeTitleOption[];
  defaultTitle: string;
  description: string;
  tags: string;
  timestamps: string;
  expressionsBlock: string;
}

export interface DescriptionOptions {
  includeOverview?: boolean;
  includeExpressions?: boolean;
  includeTimestamps?: boolean;
  includeMethodology?: boolean;
  includeSocialLinks?: boolean;
  includeHashtags?: boolean;
  customNote?: string;
}

/**
 * Generates high-CTR, YouTube-optimized video titles for a specific practice story.
 */
export function generateYouTubeTitles(story: PracticeStory): YouTubeTitleOption[] {
  const day = story.day;
  const title = story.title;
  const level = story.level || 'Practice';
  const firstExpr = story.usefulExpressions?.[0]?.phrase;

  return [
    {
      id: 'standard',
      label: 'Standard / High Discovery',
      title: `Day ${day}: ${title} | Spoken English Practice (${level})`,
    },
    {
      id: 'hook',
      label: 'Engagement Hook',
      title: `How I Practice English Daily (Day ${day}) · ${title}`,
    },
    {
      id: 'series',
      label: '120-Day Series Tracker',
      title: `Day ${day}/120: ${title} — Spoken English Teleprompter Routine`,
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary & Idiom Focus',
      title: firstExpr
        ? `Day ${day}: ${title} · Learn to Use "${firstExpr}" Naturally`
        : `Day ${day}: ${title} · ${story.focusSkill}`,
    },
  ];
}

/**
 * Generates formatted, ready-to-paste YouTube timestamps / chapters for a session.
 */
export function generateYouTubeTimestamps(story: PracticeStory): string {
  const level = story.level ? ` (${story.level})` : '';
  return [
    `00:00 - Introduction & Daily Focus${level}`,
    `00:15 - Step 1: Voiceover Intro Hook`,
    `00:45 - Step 2: Calibrated Story Reading: ${story.title}`,
    `02:30 - Step 3: Key Expressions & Vocal Intonation`,
    `03:45 - Step 4: 90-Second Unscripted Memory Retelling`,
    `05:15 - Step 5: Neuro-Linguistic Reflection & Practice Log`,
  ].join('\n');
}

/**
 * Formats the useful expressions into a clean, readable text block.
 */
export function generateExpressionsBlock(story: PracticeStory): string {
  if (!story.usefulExpressions || story.usefulExpressions.length === 0) {
    return '';
  }

  const lines: string[] = ['📚 Key Expressions & Phrasing in This Session:'];
  story.usefulExpressions.forEach((item, idx) => {
    lines.push(`${idx + 1}. "${item.phrase}" – ${item.meaning}`);
    if (item.example) {
      lines.push(`   Example: ${item.example}`);
    }
    if (item.speakingTip) {
      lines.push(`   Speaking Tip: ${item.speakingTip}`);
    }
    lines.push('');
  });

  return lines.join('\n').trim();
}

/**
 * Generates a full, comprehensive, high-ranking YouTube video description.
 */
export function generateYouTubeDescription(
  story: PracticeStory,
  options: DescriptionOptions = {}
): string {
  const {
    includeOverview = true,
    includeExpressions = true,
    includeTimestamps = true,
    includeMethodology = true,
    includeSocialLinks = true,
    includeHashtags = true,
    customNote = '',
  } = options;

  const sections: string[] = [];

  // Section 1: Video Overview / Hook
  if (includeOverview) {
    const levelStr = story.level ? ` (${story.level} Level)` : '';
    const overview = [
      `Welcome to Day ${story.day} of Speak in Progress! In this faceless screen-recording practice session, I practice speaking aloud about "${story.title}"${levelStr}.`,
      story.focusSkill ? `🎯 Today's Focus: ${story.focusSkill}.` : '',
      `We follow our calibrated 5-step daily routine: deliberate teleprompter reading at 130–150 WPM, in-depth collocation analysis, and a 90-second unscripted memory retelling without notes.`,
    ]
      .filter(Boolean)
      .join(' ');

    sections.push(overview);
  }

  // Section 1.5: Optional custom creator note
  if (customNote.trim()) {
    sections.push(`📝 Personal Reflection Note:\n${customNote.trim()}`);
  }

  // Section 2: Timestamps / Chapters
  if (includeTimestamps) {
    const timestamps = generateYouTubeTimestamps(story);
    sections.push(`⏱️ Video Chapters & Timestamps:\n${timestamps}`);
  }

  // Section 3: Key Expressions
  if (includeExpressions) {
    const exprBlock = generateExpressionsBlock(story);
    if (exprBlock) {
      sections.push(exprBlock);
    }
  }

  // Section 4: Retelling Anchor Prompts
  if (story.retellingPrompts && story.retellingPrompts.length > 0) {
    const prompts = story.retellingPrompts.map((p, i) => `  ${i + 1}. ${p}`).join('\n');
    sections.push(`🧠 90-Second Memory Retelling Triggers:\n${prompts}`);
  }

  // Section 5: Methodology
  if (includeMethodology) {
    sections.push(
      `🎙️ About the Cognitive Cadence Method:\n` +
      `Speak in Progress is built on one simple rule: Progress over perfection. Instead of memorizing grammar rules in silence, we practice speaking aloud every single day using calibrated PC teleprompter pacing and immediate unscripted recall. Stumbles are not mistakes—they are proof of active neural rewiring.`
    );
  }

  // Section 6: Community & Links
  if (includeSocialLinks) {
    sections.push(
      `💬 Question for the Community:\n` +
      `How do you handle "${story.title.toLowerCase()}" in your daily routine? Which expression did you find most useful? Drop a comment below!\n\n` +
      `🔗 Official Platform & Practice Studio: ${SITE_CONFIG.domain}\n` +
      `📺 Subscribe to the Journey: ${SITE_CONFIG.youtubeUrl}\n` +
      `👤 Creator: ${SITE_CONFIG.creator.name}`
    );
  }

  // Section 7: SEO Hashtags
  if (includeHashtags) {
    const topicTag = story.topic ? `#${story.topic.replace(/[^a-zA-Z0-9]/g, '')}` : '';
    sections.push(
      `#SpeakInProgress #Day${story.day} #SpokenEnglish #EnglishPractice #EnglishFluency #DailyEnglish #Teleprompter #LanguageLearning #LearnEnglish ${topicTag}`.trim()
    );
  }

  return sections.join('\n\n═══════════════════════════════════════\n\n');
}

/**
 * Generates comma-separated YouTube tags for the video.
 */
export function generateYouTubeTags(story: PracticeStory): string {
  const baseTags = [
    'speak in progress',
    'spoken english',
    'daily english practice',
    'english fluency',
    'teleprompter english',
    'faceless youtube practice',
    'unscripted retelling',
    'obs screen recording',
    'english speaking practice',
    'md selim',
  ];

  const storySpecificTags = [
    `day ${story.day}`,
    `day ${story.day} english`,
    story.title.toLowerCase(),
    story.level ? `${story.level.toLowerCase()} english` : '',
    story.topic ? story.topic.toLowerCase() : '',
  ].filter(Boolean);

  if (story.usefulExpressions) {
    story.usefulExpressions.forEach((item) => {
      if (item.phrase) storySpecificTags.push(item.phrase.toLowerCase());
    });
  }

  const allTags = Array.from(new Set([...storySpecificTags, ...baseTags]));
  return allTags.join(', ');
}

/**
 * Builds the complete bundle for a given story.
 */
export function getYouTubeMetadataBundle(
  story: PracticeStory,
  options?: DescriptionOptions
): YouTubeMetadataBundle {
  const titles = generateYouTubeTitles(story);
  const defaultTitle = titles[0].title;
  const description = generateYouTubeDescription(story, options);
  const tags = generateYouTubeTags(story);
  const timestamps = generateYouTubeTimestamps(story);
  const expressionsBlock = generateExpressionsBlock(story);

  return {
    day: story.day,
    storyTitle: story.title,
    level: story.level || 'Practice',
    topic: story.topic || 'General Practice',
    focusSkill: story.focusSkill || 'Spoken English Cadence',
    titles,
    defaultTitle,
    description,
    tags,
    timestamps,
    expressionsBlock,
  };
}
