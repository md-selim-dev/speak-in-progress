/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PracticeStory, ExpressionItem } from '../types';

export const CEFR_LEVELS = [
  { code: 'A1', name: 'A1 · Beginner Foundations', range: 'Days 1–20', color: 'emerald' },
  { code: 'A2', name: 'A2 · Elementary Social Fluency', range: 'Days 21–40', color: 'teal' },
  { code: 'B1', name: 'B1 · Intermediate Workplace', range: 'Days 41–60', color: 'cyan' },
  { code: 'B2', name: 'B2 · Executive Strategy & Nuance', range: 'Days 61–80', color: 'blue' },
  { code: 'C1', name: 'C1 · Advanced Rhetoric & Diplomacy', range: 'Days 81–100', color: 'indigo' },
  { code: 'C2', name: 'C2 · Capstone Mastery & Oratory', range: 'Days 101–120', color: 'purple' },
] as const;

export function getLevelFromDay(day: number): string {
  if (day <= 20) return 'A1';
  if (day <= 40) return 'A2';
  if (day <= 60) return 'B1';
  if (day <= 80) return 'B2';
  if (day <= 100) return 'C1';
  return 'C2';
}

/**
 * Parses raw text from a Google Sheet (pasted TSV/CSV) or structured text/JSON
 */
export function parseImportedContent(rawInput: string, defaultStartDay: number = 1): {
  stories: PracticeStory[];
  errors: string[];
  format: 'json' | 'tsv' | 'blocks';
} {
  const trimmed = rawInput.trim();
  const errors: string[] = [];

  if (!trimmed) {
    return { stories: [], errors: ['Input is empty'], format: 'blocks' };
  }

  // 1. Try parsing JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const stories: PracticeStory[] = items.map((item, idx) => {
        const day = Number(item.day || item.dayNumber || defaultStartDay + idx);
        return {
          id: item.id || `cloud-import-day-${day}-${Date.now()}-${idx}`,
          day,
          title: String(item.title || `Day ${day} Practice`),
          level: item.level || getLevelFromDay(day),
          topic: String(item.topic || ''),
          focusSkill: String(item.focusSkill || item.skill || 'Natural Spoken Flow'),
          estimatedReadTime: item.estimatedReadTime || '2 min',
          storyParagraphs: Array.isArray(item.storyParagraphs)
            ? item.storyParagraphs.map(String)
            : typeof item.story === 'string'
            ? item.story.split('\n\n').filter((p: string) => p.trim())
            : typeof item.content === 'string'
            ? item.content.split('\n\n').filter((p: string) => p.trim())
            : ['(Practice content)'],
          usefulExpressions: Array.isArray(item.usefulExpressions)
            ? item.usefulExpressions
            : [],
          retellingPrompts: Array.isArray(item.retellingPrompts)
            ? item.retellingPrompts
            : [],
          reflectionPrompts: Array.isArray(item.reflectionPrompts)
            ? item.reflectionPrompts
            : [],
          notes: item.notes || '',
        };
      });
      return { stories, errors: [], format: 'json' };
    } catch (e: any) {
      // Continue to TSV/Block parsing
    }
  }

  // 2. Check if input is Tab-Separated Values (Direct copy-paste from Google Sheets)
  const lines = trimmed.split('\n');
  const isTSV = lines.length > 1 && lines[0].includes('\t');

  if (isTSV) {
    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split('\t').map((h) => h.trim());

    // Locate column indices
    const dayIdx = headers.findIndex((h) => h.includes('day') || h.includes('#'));
    const levelIdx = headers.findIndex((h) => h.includes('level') || h.includes('cefr'));
    const titleIdx = headers.findIndex((h) => h.includes('title') || h.includes('lesson'));
    const topicIdx = headers.findIndex((h) => h.includes('topic') || h.includes('subject'));
    const skillIdx = headers.findIndex((h) => h.includes('skill') || h.includes('focus'));
    const contentIdx = headers.findIndex(
      (h) => h.includes('story') || h.includes('script') || h.includes('content') || h.includes('text')
    );
    const vocabIdx = headers.findIndex(
      (h) => h.includes('vocab') || h.includes('expression') || h.includes('phrase')
    );
    const anchorIdx = headers.findIndex(
      (h) => h.includes('anchor') || h.includes('retell') || h.includes('prompt')
    );

    const stories: PracticeStory[] = [];

    // Parse data rows (skipping header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split('\t');

      const parsedDayNum = dayIdx >= 0 && cols[dayIdx] ? parseInt(cols[dayIdx].replace(/\D/g, ''), 10) : defaultStartDay + i - 1;
      const day = isNaN(parsedDayNum) || parsedDayNum <= 0 ? defaultStartDay + i - 1 : parsedDayNum;
      const level = levelIdx >= 0 && cols[levelIdx] ? cols[levelIdx].trim().toUpperCase() : getLevelFromDay(day);
      const title = titleIdx >= 0 && cols[titleIdx] ? cols[titleIdx].trim() : `Day ${day} Speaking Practice`;
      const topic = topicIdx >= 0 && cols[topicIdx] ? cols[topicIdx].trim() : '';
      const focusSkill = skillIdx >= 0 && cols[skillIdx] ? cols[skillIdx].trim() : 'Confidence and direct thinking';

      // Parse story paragraphs
      const rawStory = contentIdx >= 0 && cols[contentIdx] ? cols[contentIdx] : (cols[1] || 'Today we practice natural spoken English.');
      const paragraphs = rawStory
        .replace(/\\n/g, '\n')
        .split(/\n\n|\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      // Parse vocab if provided
      const expressions: ExpressionItem[] = [];
      if (vocabIdx >= 0 && cols[vocabIdx]) {
        const rawVocab = cols[vocabIdx].replace(/\\n/g, '\n');
        const vocabParts = rawVocab.split(/[;\n]/).filter((v) => v.trim());
        vocabParts.slice(0, 5).forEach((part) => {
          const [phrase, meaning] = part.split(/[-–:]/).map((s) => s.trim());
          if (phrase) {
            expressions.push({
              phrase,
              meaning: meaning || 'Key conversational phrase',
              example: `I frequently use "${phrase}" in daily spoken English.`,
              speakingTip: 'Emphasize key vowels smoothly.',
            });
          }
        });
      }

      // Parse anchors
      const rawAnchors = anchorIdx >= 0 && cols[anchorIdx] ? cols[anchorIdx] : '';
      const anchors = rawAnchors
        ? rawAnchors.split(/[;\n]/).map((a) => a.trim()).filter(Boolean)
        : paragraphs.slice(0, 4).map((p) => p.slice(0, 60) + '...');

      stories.push({
        id: `sheet-day-${day}-${Date.now()}-${i}`,
        day,
        level,
        topic,
        title,
        focusSkill,
        estimatedReadTime: `${Math.max(1, Math.round(paragraphs.join(' ').split(/\s+/).length / 130))} min`,
        storyParagraphs: paragraphs.length > 0 ? paragraphs : ['(Practice content)'],
        usefulExpressions: expressions,
        retellingPrompts: anchors,
        reflectionPrompts: [
          'Did I speak without hesitating or translating in my head?',
          'Which expression felt most natural to use?',
        ],
      });
    }

    if (stories.length > 0) {
      return { stories, errors, format: 'tsv' };
    }
  }

  // 3. Fallback: Block format ("---" separated)
  const blocks = trimmed.split(/\n\s*---\s*\n/).filter((b) => b.trim());
  const stories: PracticeStory[] = [];

  blocks.forEach((block, idx) => {
    const blockLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (blockLines.length === 0) return;

    let day = defaultStartDay + idx;
    let title = `Day ${day} Speaking Practice`;
    let focusSkill = 'Natural fluency';
    let level = getLevelFromDay(day);
    let topic = '';
    const storyParas: string[] = [];
    const phrases: ExpressionItem[] = [];
    const anchors: string[] = [];

    let currentSection: 'header' | 'story' | 'vocab' | 'anchors' = 'header';

    blockLines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.startsWith('day')) {
        const match = line.match(/day\s*(\d+)[:\-\s]*(.*)/i);
        if (match) {
          day = parseInt(match[1], 10);
          if (match[2]) title = match[2].trim();
        }
      } else if (lower.startsWith('level:')) {
        level = line.replace(/level:\s*/i, '').trim().toUpperCase();
      } else if (lower.startsWith('topic:')) {
        topic = line.replace(/topic:\s*/i, '').trim();
      } else if (lower.startsWith('skill:') || lower.startsWith('focus:')) {
        focusSkill = line.replace(/^(skill|focus):\s*/i, '').trim();
      } else if (lower.startsWith('expressions:') || lower.startsWith('vocab:')) {
        currentSection = 'vocab';
      } else if (lower.startsWith('anchors:') || lower.startsWith('retell:')) {
        currentSection = 'anchors';
      } else if (currentSection === 'vocab') {
        const [phrase, meaning] = line.replace(/^[•\-\*\d\.]+\s*/, '').split(/[-–:]/).map((s) => s.trim());
        if (phrase) {
          phrases.push({
            phrase,
            meaning: meaning || 'Key conversational phrase',
            example: `I often say "${phrase}".`,
            speakingTip: 'Natural rhythm',
          });
        }
      } else if (currentSection === 'anchors') {
        const anchor = line.replace(/^[•\-\*\d\.]+\s*/, '').trim();
        if (anchor) anchors.push(anchor);
      } else {
        storyParas.push(line);
      }
    });

    stories.push({
      id: `block-day-${day}-${Date.now()}-${idx}`,
      day,
      level,
      topic,
      title: title || `Day ${day} Challenge`,
      focusSkill,
      estimatedReadTime: '2 min',
      storyParagraphs: storyParas.length > 0 ? storyParas : ['(Practice text)'],
      usefulExpressions: phrases,
      retellingPrompts: anchors.length > 0 ? anchors : ['Anchor: Core memory trigger point'],
      reflectionPrompts: ['How natural was my pace?'],
    });
  });

  return { stories, errors, format: 'blocks' };
}
