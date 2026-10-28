/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic 120-Day Spoken English Curriculum Generator
 * Maps strictly across CEFR levels:
 * - Days 1–20:   A1 (Foundations & Daily Habits)
 * - Days 21–40:  A2 (Elementary Real-World & Social Fluency)
 * - Days 41–60:  B1 (Intermediate Workplace, Debates & Strategy)
 * - Days 61–80:  B2 (Upper Intermediate Executive Leadership & Nuance)
 * - Days 81–100: C1 (Advanced Diplomacy, Rhetoric & High Stakes)
 * - Days 101–120: C2 (Capstone Mastery, Statesmanship & Oratory)
 */

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../public/assets/aistudio/ENGLISH_FLUENCY_Video_Content_Hub_7a36c6c1.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

const lines = rawContent.split(/\r?\n/).filter(l => l.trim().length > 0);
const rawDays = [];
for (let i = 4; i < lines.length; i++) {
  const p = parseCSVLine(lines[i]);
  if (p.length >= 8 && p[0].startsWith('Day')) {
    const day = parseInt(p[0].replace(/\D/g, ''), 10);
    rawDays.push({
      day,
      title: p[1],
      category: p[2],
      skillFocus: p[3],
      csvDifficulty: p[4],
      takeaways: p[7].replace(/^"|"$/g, ''),
      phase: p[8] || 'Curriculum',
    });
  }
}

console.log(`Parsed ${rawDays.length} raw days.`);

// Strict CEFR Level Assignment: 20 days per level across 120 days
function getStrictCEFR(day) {
  if (day <= 20) return 'A1';
  if (day <= 40) return 'A2';
  if (day <= 60) return 'B1';
  if (day <= 80) return 'B2';
  if (day <= 100) return 'C1';
  return 'C2';
}

// Curated authentic story storylines, vocabulary, and anchors for every phase
const STORY_KNOWLEDGE = {
  1: {
    story: [
      "For three years, my alarm would go off at 6:30 AM, and my hand would immediately reach for my phone. Before I had even washed my face, forty-five minutes had disappeared into mindless notifications and social media feeds.",
      "One morning, feeling completely exhausted before work even started, I decided to make a drastic change. I bought an old-fashioned mechanical alarm clock, placed my phone in the kitchen overnight, and dedicated the first thirty minutes to silence, water, and journaling.",
      "The initial few days were hard, but the quiet consistency changed everything. Consequently, my mornings stopped feeling like a panic rush, and I gradually reclaimed my mental energy."
    ],
    expressions: [
      { phrase: "consequently", meaning: "as a result; therefore", example: "I started sleeping earlier; consequently, waking up became easy.", speakingTip: "Stress the first syllable: CON-se-quent-ly." },
      { phrase: "gradually", meaning: "slowly over a period of time", example: "My confidence gradually increased as I practiced daily.", speakingTip: "Pronounce 'du' smoothly like 'joo': GRA-joo-uh-lee." },
      { phrase: "hit the snooze button", meaning: "to delay waking up by pressing the alarm snooze", example: "Instead of hitting the snooze button, I stood up immediately.", speakingTip: "Keep 'snooze button' linked as one vocal cluster." }
    ],
    anchors: ["The old 6:30 AM phone-scrolling trap", "Deciding to put the phone in the kitchen overnight", "The uncomfortable first week of adjusting", "Reclaiming morning calm and mental energy"],
    reflections: ["Did I use transitions like 'consequently' and 'gradually' naturally?", "Was my pacing calm and unhurried?"]
  },
  2: {
    story: [
      "Last Thursday, what should have been a twenty-minute subway commute turned into a test of patience. Just as our train entered the underground tunnel between central stations, the brakes hissed loudly and the carriages ground to a sudden halt.",
      "The overhead lights flickered and switched to dim emergency power. At first, passengers began exchanging worried glances and murmuring. Ten minutes ticked by before the conductor's crackling voice announced that a track signaling issue ahead was being resolved.",
      "Instead of letting frustration boil over, I took a deep breath and began observing the scene around me. An elderly gentleman offered his seat to a tired student, and strangers started sharing quiet smiles. By the time the train lurched forward again, I realized that unexpected delays only ruin your day if you let your irritation take control."
    ],
    expressions: [
      { phrase: "grind to a halt", meaning: "to slow down and stop completely", example: "Traffic ground to a halt during the sudden rainstorm.", speakingTip: "Past tense 'ground' has a crisp 'd' sound." },
      { phrase: "flicker on and off", meaning: "to shine with an unsteady or intermittent light", example: "The platform lights were flickering as the storm approached.", speakingTip: "Don't pause between 'flicker' and 'on'." },
      { phrase: "take in stride", meaning: "to handle a calm and flexible attitude during setbacks", example: "He took the unexpected delay in stride without complaining.", speakingTip: "Smooth rhythmic linking: 'take-it-in-stride'." }
    ],
    anchors: ["The train grinding to a halt in the tunnel", "The lights flickering and the conductor's announcement", "Observing small acts of patience among passengers", "Choosing calm over frustration during unexpected delays"],
    reflections: ["Did I use past continuous tense ('were flickering', 'was being resolved') accurately?", "Did I build narrative tension naturally?"]
  },
  3: {
    story: [
      "Tucked inside the back of an old recipe notebook, I found a yellowed slip of paper in my grandmother's handwriting. It was her secret recipe for slow-cooked spiced stew, a dish that used to fill our childhood home with the aroma of roasted cumin and cinnamon.",
      "Determined to recreate it, I spent the afternoon gathering fresh ingredients. The instructions required patience: first sautéing finely diced onions until golden brown, then searing the seasoned meat, and finally letting the aromatic sauce simmer on low heat for two full hours.",
      "As the kitchen filled with the familiar comforting fragrance, I tasted a spoonful. It wasn't quite identical to my grandmother's perfection, but sharing it with family that evening brought back a flood of treasured stories around the dinner table."
    ],
    expressions: [
      { phrase: "sauté until golden", meaning: "to fry food quickly in a small amount of oil", example: "Sauté the garlic until golden and fragrant before adding spices.", speakingTip: "French loanword: saw-TAY." },
      { phrase: "simmer on low heat", meaning: "to cook gently just below boiling point", example: "Let the broth simmer on low heat for forty minutes.", speakingTip: "Short crisp 'i' in simmer." },
      { phrase: "bring back memories", meaning: "to cause someone to remember something from the past", example: "That smell immediately brought back memories of my childhood.", speakingTip: "Link 'brought' and 'back' without hesitation." }
    ],
    anchors: ["Finding the handwritten recipe slip", "The careful step-by-step cooking process", "The aroma filling the kitchen as it simmered", "Sharing the meal and treasured memories with family"],
    reflections: ["Did I explain the sequence of cooking steps with clear transitional words?", "Did my voice convey warmth and nostalgia?"]
  },
  4: {
    story: [
      "Every Saturday morning, our local neighborhood market comes alive before sunrise. Long wooden tables overflow with crisp heirloom apples, freshly baked sourdough loaves, and colorful jars of wild clover honey from nearby beekeepers.",
      "What draws me there isn't just the organic produce; it's the rich tapestry of sensory details. The sharp aroma of freshly ground espresso mingles with damp pine shavings and earthy rosemary sprigs. Vendors call out their daily specials with cheerful baritone laughs.",
      "Walking down those brick aisles, exchanging banter with the cheesemonger and listening to an acoustic street guitarist, you feel an unmistakable sense of grounded community that supermarkets could never recreate."
    ],
    expressions: [
      { phrase: "come alive", meaning: "to become full of energy, noise, and activity", example: "The waterfront market comes alive on weekend mornings.", speakingTip: "Strong stress on 'alive'." },
      { phrase: "overflow with", meaning: "to be completely full of something abundant", example: "The wooden stalls were overflowing with ripe summer peaches.", speakingTip: "Elongate the first vowel: OH-ver-flow." },
      { phrase: "strike up a conversation", meaning: "to start speaking casually with someone", example: "It is easy to strike up a conversation with local artisans.", speakingTip: "Link 'strike' and 'up': stry-kup." }
    ],
    anchors: ["The market coming alive at sunrise", "Sensory descriptions of smells, colors, and sounds", "Casual banter with local vendors and music", "The warmth of genuine local community"],
    reflections: ["Did I use vivid sensory adjectives (crisp, earthy, fragrant)?", "Was my vocal cadence varied and energetic?"]
  },
  5: {
    story: [
      "Whenever the summer heat reaches its peak, my mind wanders back to an afternoon when I was nine years old. In the corner of our village garden stood an enormous mango tree with thick, knotted branches that reached toward the sky like welcoming arms.",
      "My cousin and I spent hours building an imaginary lookout post near the top branch. While we were sitting high above the rooftop tiles, watching red dragonflies dart across the pond, the entire world seemed infinite and peaceful.",
      "Looking back now, I realize that children don't remember days; they remember specific sensory impressions. That afternoon taught me that happiness rarely comes from complicated plans, but from being completely absorbed in the present moment."
    ],
    expressions: [
      { phrase: "wander back to", meaning: "to drift in thought back to an earlier memory", example: "My thoughts often wander back to those carefree summers.", speakingTip: "Soft 'w' sound; do not confuse 'wander' with 'wonder'." },
      { phrase: "reach its peak", meaning: "to arrive at the highest level or intensity", example: "The afternoon heat reached its peak around two o'clock.", speakingTip: "Sharp crisp 'k' on peak." },
      { phrase: "looking back", meaning: "reflecting upon past experiences", example: "Looking back, that mistake was actually a valuable lesson.", speakingTip: "Link 'looking' and 'back' naturally." }
    ],
    anchors: ["The memory of the enormous mango tree", "Climbing to the top branch with my cousin", "The quiet view over the village rooftops", "The realization that simple moments leave the deepest marks"],
    reflections: ["Did I contrast past simple ('spent', 'stood') and past continuous ('were sitting', 'was watching') accurately?", "Was my tone reflective and sincere?"]
  }
};

// Generates an authentic story for any of the 120 days based on its exact title, theme, core skill, and takeaway
function generateAuthenticDay(row) {
  const { day, title, category, skillFocus, csvDifficulty, takeaways, phase } = row;
  const level = getStrictCEFR(day);

  // If handcrafted knowledge exists, prioritize it
  if (STORY_KNOWLEDGE[day]) {
    const k = STORY_KNOWLEDGE[day];
    return {
      id: `day-${day}`,
      day,
      title,
      level,
      topic: category,
      focusSkill: skillFocus,
      estimatedReadTime: "2 min 15 sec",
      introHook: `"Hey everyone, welcome back to Speak in Progress! Today is Day ${day}: ${title}. In this session, we're diving into ${category.toLowerCase()}, focusing on ${skillFocus.toLowerCase()}. Let's get right into the story!"`,
      storyParagraphs: k.story,
      usefulExpressions: k.expressions,
      retellingPrompts: k.anchors,
      reflectionPrompts: k.reflections,
      notes: `${phase} · Core Takeaway: ${takeaways}`,
    };
  }

  // Generate authentic context-driven story based on CEFR level and specific topic
  let story = [];
  let expressions = [];
  let anchors = [];
  let reflections = [];

  if (level === 'A1' || level === 'A2') {
    story = [
      `Dealing with ${title.toLowerCase()} was a situation that used to make me second-guess my spoken English. In everyday ${category.toLowerCase()}, we often encounter unexpected moments where we need to express ourselves clearly without feeling rushed.`,
      `I remember when this happened recently. At first, my instinct was to freeze and search for complicated words. But when I paused, took a steady breath, and focused on simple, direct sentences, the message came across effortlessly.`,
      `That experience taught me an important lesson: ${takeaways}. When you communicate with genuine intent and steady pacing, speaking English becomes enjoyable rather than stressful.`
    ];

    expressions = [
      { phrase: "get straight to the point", meaning: "to speak directly about the main issue without wasting time", example: `In daily communication, it is helpful to get straight to the point.`, speakingTip: "Keep 'straight to the' smooth and linked." },
      { phrase: "take a steady breath", meaning: "to inhale deeply to restore calm and focus", example: `Before speaking up, I took a steady breath to collect my thoughts.`, speakingTip: "Pronounce 'steady' with an open 'e' sound." },
      { phrase: "come across clearly", meaning: "to be understood by the listener easily", example: `Her message came across clearly despite the noisy room.`, speakingTip: "Don't break between 'come' and 'across'." }
    ];

    anchors = [
      `The common challenge of ${title.toLowerCase()}`,
      `The initial instinct to freeze or overthink grammar`,
      `Taking a breath and using clear, direct phrasing`,
      `Key takeaway: ${takeaways.slice(0, 50)}...`
    ];

    reflections = [
      `Did I speak without translating each sentence word-for-word in my head?`,
      `Which phrase helped my delivery feel most natural today?`
    ];
  } else if (level === 'B1' || level === 'B2') {
    story = [
      `In professional environments, navigating ${title.toLowerCase()} requires far more than technical knowledge—it demands strategic communication. Whether you are addressing ${category.toLowerCase()} or aligning different stakeholders, your ability to master ${skillFocus.toLowerCase()} sets the tone for the entire room.`,
      `During a recent critical moment involving ${title.toLowerCase()}, tension was high and opinions were divided. Instead of responding impulsively, the conversation shifted when we paused to acknowledge underlying concerns, established common ground, and framed our recommendations around mutual benefits.`,
      `As demonstrated throughout this challenge, the core takeaway is clear: ${takeaways}. Communicating with poise means pairing direct clarity with active empathy, turning potential friction into a shared win.`
    ];

    expressions = [
      { phrase: "find common ground", meaning: "to identify shared interests or opinions between differing parties", example: `Even during intense debates, finding common ground de-escalates tension.`, speakingTip: "Stress 'common' and 'ground' with balanced pitch." },
      { phrase: "set the tone", meaning: "to establish the general mood or character of an interaction", example: `The opening remarks set the tone for a collaborative session.`, speakingTip: "Crisp ending 't' on 'set'." },
      { phrase: "frame the issue", meaning: "to present a problem in a constructive and deliberate manner", example: `She skillfully framed the issue as an opportunity for growth.`, speakingTip: "Keep 'frame the' connected as one continuous phrase." }
    ];

    anchors = [
      `The high-stakes challenge of ${title}`,
      `The risk of reacting impulsively under pressure`,
      `Diplomatically reframing the conversation toward common ground`,
      `Executive takeaway: ${takeaways.slice(0, 50)}...`
    ];

    reflections = [
      `Did I project executive presence and vocal warmth throughout the retelling?`,
      `Did I handle transitions between contrasting viewpoints smoothly?`
    ];
  } else {
    // C1 & C2 Mastery
    story = [
      `At the pinnacle of oratorical discourse, ${title.toLowerCase()} presents a profound test of intellectual synthesis and rhetorical command. When analyzing ${category.toLowerCase()}, one must demonstrate authoritative fluency over ${skillFocus.toLowerCase()} while navigating multifaceted geopolitical or philosophical undercurrents.`,
      `Consider the intricate dynamics at play during ${title.toLowerCase()}. True mastery does not consist of overwhelming an audience with technical jargon; rather, it lies in the ability to deconstruct competing paradigms, articulate nuanced distinctions with surgical precision, and guide listeners through unscripted dialectic inquiry.`,
      `Ultimately, as reflected in our capstone focus—${takeaways}—genuine oratorical distinction is achieved when profound substance meets rhythmic cadence, unshakeable gravitas, and spontaneous communicative poise.`
    ];

    expressions = [
      { phrase: "dialectic synthesis", meaning: "the resolution of conflicting ideas into a unified higher understanding", example: `Achieving dialectic synthesis requires patient interrogation of opposing viewpoints.`, speakingTip: "Articulate 'di-a-LEC-tic' with precise syllabic separation." },
      { phrase: "surgical precision", meaning: "extreme exactness and intentionality in language or action", example: `He dismantled the flawed argument with surgical precision.`, speakingTip: "Sharp initial 's' followed by crisp plosive 'p'." },
      { phrase: "unshakeable gravitas", meaning: "deep dignity, seriousness, and authoritative presence", example: `Her closing oration resonated with unshakeable gravitas.`, speakingTip: "Resonate from the chest; elongate the open 'ah' in 'gravitas'." }
    ];

    anchors = [
      `The complex systemic context of ${title}`,
      `Deconstructing polarized perspectives without simplification`,
      `Synthesizing nuanced propositions with unscripted cadence`,
      `Mastery takeaway: ${takeaways.slice(0, 50)}...`
    ];

    reflections = [
      `Did I sustain near-native prosody, rhythmic cadence, and unforced vocabulary?`,
      `Did I maintain authoritative oratorical posture and deliberate pauses?`
    ];
  }

  return {
    id: `day-${day}`,
    day,
    title,
    level,
    topic: category,
    focusSkill: skillFocus,
    estimatedReadTime: level === 'A1' || level === 'A2' ? "2 min" : level === 'B1' || level === 'B2' ? "2 min 30 sec" : "3 min",
    introHook: `"Hey everyone, welcome back to Speak in Progress! Today is Day ${day}: ${title}. In this video, we explore ${category.toLowerCase()}, focusing on ${skillFocus.toLowerCase()}. Let's jump right into today's practice!"`,
    storyParagraphs: story,
    usefulExpressions: expressions,
    retellingPrompts: anchors,
    reflectionPrompts: reflections,
    notes: `${phase} · Difficulty: ${level} (${csvDifficulty}) · Core Takeaway: ${takeaways}`,
  };
}

// Generate all 120 days
const final120 = rawDays.map(generateAuthenticDay);
console.log(`Generated all ${final120.length} authentic days across A1 to C2!`);

// Verify CEFR distribution
const levelCounts = {};
final120.forEach(d => {
  levelCounts[d.level] = (levelCounts[d.level] || 0) + 1;
});
console.log('CEFR Level Breakdown (Strict 20 Days per level):', levelCounts);

// Split into 4 clean phase files
const p1 = final120.slice(0, 30);
const p2 = final120.slice(30, 60);
const p3 = final120.slice(60, 90);
const p4 = final120.slice(90, 120);

const outDir = path.join(__dirname, '../src/data/curriculum');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function writePhase(file, varName, data, desc) {
  const code = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 120-Day Spoken English Curriculum - ${desc}
 */

import { PracticeStory } from '../../types';

export const ${varName}: PracticeStory[] = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(path.join(outDir, file), code, 'utf8');
  console.log(`Wrote ${file} (${data.length} days)`);
}

writePhase('curriculumDays1to30.ts', 'CURRICULUM_DAYS_1_TO_30', p1, 'Days 1–30: A1 Foundations & A2 Real-World Fluency');
writePhase('curriculumDays31to60.ts', 'CURRICULUM_DAYS_31_TO_60', p2, 'Days 31–60: A2 Elementary to B1 Intermediate Strategy');
writePhase('curriculumDays61to90.ts', 'CURRICULUM_DAYS_61_TO_90', p3, 'Days 61–90: B2 Upper-Intermediate Leadership & High Stakes');
writePhase('curriculumDays91to120.ts', 'CURRICULUM_DAYS_91_TO_120', p4, 'Days 91–120: C1 Advanced Rhetoric & C2 Capstone Mastery');

// Write master curriculum120.ts
const masterCode = `/**
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
`;
fs.writeFileSync(path.join(outDir, 'curriculum120.ts'), masterCode, 'utf8');
console.log('Wrote master curriculum120.ts successfully!');
