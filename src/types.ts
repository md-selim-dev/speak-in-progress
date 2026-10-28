/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  hsl: string;
  rgb: string;
  textDark: boolean;
  notes: string;
}

export interface BrandIdentity {
  id: string;
  name: string;
  tagline: string;
  subline: string;
  conceptPhilosophy: string;
  handleSuggestions: string[];
  vibeKeywords: string[];
  colors: {
    primary: ColorSwatch;
    secondary: ColorSwatch;
    accent: ColorSwatch;
    surface: ColorSwatch;
    canvas: ColorSwatch;
    textMuted: ColorSwatch;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    monoFont: string;
    editorialFont: string;
    headlineStyle: string;
    bodyStyle: string;
  };
  toneGuidelines: {
    personality: string[];
    doSay: string[];
    dontSay: string[];
    philosophyQuote: string;
  };
  youtubeMeta: {
    aboutBio: string;
    defaultTags: string[];
    videoDescriptionTemplate: string;
    seriesTitle: string;
  };
}

export interface ExpressionItem {
  phrase: string;
  meaning: string;
  example: string;
  speakingTip: string;
}

export interface PracticeStory {
  id: string;
  day: number;
  title: string;
  focusSkill: string;
  estimatedReadTime: string;
  storyParagraphs: string[];
  usefulExpressions: ExpressionItem[];
  retellingPrompts: string[];
  reflectionPrompts: string[];
  introHook?: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | string;
  topic?: string;
  notes?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReflectionEntry {
  day: number;
  storyTitle: string;
  date: string;
  scriptIndependenceRating: number; // 1 to 5
  stumbleMoments: string;
  winOfTheDay: string;
  nextFocus: string;
}

