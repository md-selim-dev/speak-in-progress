/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Master 120-Day Storytelling & Spoken English Curriculum (A1 to C2)
 * Strictly partitioned into 20 days per CEFR level:
 * - Days 1–20:   A1 (Beginner Foundations)
 * - Days 21–40:  A2 (Elementary Social Interaction)
 * - Days 41–60:  B1 (Intermediate Workplace & Debates)
 * - Days 61–80:  B2 (Upper Intermediate Executive Strategy)
 * - Days 81–100: C1 (Advanced Leadership & Diplomacy)
 * - Days 101–120: C2 (Capstone Mastery & Statesmanship Orations)
 *
 * Each day contains:
 * 1. Exactly 5 rich paragraphs for immersive teleprompter reading.
 * 2. A distinct, non-repetitive opening hook.
 * 3. A 15-second conversational voiceover intro hook.
 * 4. 3 conversational expressions with pronunciation tips.
 * 5. 4 memory trigger anchors for unscripted retelling.
 * 6. Daily reflection prompts.
 */

import { PracticeStory } from '../../types';
import { CURRICULUM_DAYS_1_TO_30 } from './curriculumDays1to30';
import { CURRICULUM_DAYS_31_TO_60 } from './curriculumDays31to60';
import { CURRICULUM_DAYS_61_TO_90 } from './curriculumDays61to90';
import { CURRICULUM_DAYS_91_TO_120 } from './curriculumDays91to120';

export const CURRICULUM_120_DAYS: PracticeStory[] = [
  ...CURRICULUM_DAYS_1_TO_30,
  ...CURRICULUM_DAYS_31_TO_60,
  ...CURRICULUM_DAYS_61_TO_90,
  ...CURRICULUM_DAYS_91_TO_120,
];
