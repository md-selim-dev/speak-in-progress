/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrandIdentity } from '../types';

export const BRAND_PRESETS: BrandIdentity[] = [
  {
    id: 'speak-in-progress-emerald',
    name: 'Speak in Progress',
    tagline: 'The Spoken English Journey · Progress Over Perfection',
    subline: 'Documenting the steady, honest shift from silent reading to fearless, natural English speech.',
    conceptPhilosophy:
      'The official flagship visual identity for Speak in Progress. Centered around soothing, eye-pleasing Emerald Spark on deep botanical obsidian ground (#061411), specifically engineered to reduce eye strain during extended PC screen recordings, daily teleprompter reading, and long rehearsal sessions. Balances warm organic vitality with clean modern typography.',
    handleSuggestions: [
      '@SpeakInProgress',
      '@SpeakInProgressJourney',
      '@SpeakProgressDaily',
      '@SpeakInProgressOfficial',
    ],
    vibeKeywords: ['Emerald Spark', 'Eye-Pleasing', 'Focused', 'Calm', 'Sustainable'],
    colors: {
      primary: {
        name: 'Botanical Obsidian',
        role: 'Deep background & dominant ground',
        hex: '#061411',
        hsl: '166° 52% 5%',
        rgb: '6, 20, 17',
        textDark: false,
        notes: '60% canvas; deep, eye-comfort dark botanical ground tailored for long screen recordings and minimal glare.',
      },
      secondary: {
        name: 'Deep Emerald Surface',
        role: 'Elevated cards & subtle borders',
        hex: '#0B241F',
        hsl: '167° 53% 9%',
        rgb: '11, 36, 31',
        textDark: false,
        notes: '30% structural surface; velvety elevated container surface with soft, relaxing depth.',
      },
      accent: {
        name: 'Emerald Spark',
        role: 'Main brand emblem, active indicators & primary CTAs',
        hex: '#10B981',
        hsl: '158° 84% 39%',
        rgb: '16, 185, 129',
        textDark: false,
        notes: '10% accent budget; flagship main brand color with warm, organic, eye-pleasing harmony that prevents fatigue.',
      },
      surface: {
        name: 'Mint Velvet Tint',
        role: 'Interactive controls, input fills & badges',
        hex: '#14332D',
        hsl: '168° 44% 14%',
        rgb: '20, 51, 45',
        textDark: false,
        notes: 'Interactive controls, active states, and hover backgrounds with smooth transitions.',
      },
      canvas: {
        name: 'Crisp Mint Cloud',
        role: 'High-contrast teleprompter body text',
        hex: '#F0FDF8',
        hsl: '156° 73% 97%',
        rgb: '240, 253, 248',
        textDark: true,
        notes: 'Maximum optical readability across PC monitors and mobile screens.',
      },
      textMuted: {
        name: 'Muted Mint Slate',
        role: 'Timestamps, step indexes & subtle metadata',
        hex: '#8DAAA2',
        hsl: '166° 14% 61%',
        rgb: '141, 170, 162',
        textDark: true,
        notes: 'Quiet typography that guides the viewer\'s eye directly to the story.',
      },
    },
    typography: {
      displayFont: 'Plus Jakarta Sans',
      bodyFont: 'DM Sans',
      monoFont: 'JetBrains Mono',
      editorialFont: 'Playfair Display',
      headlineStyle: 'font-extrabold tracking-tight',
      bodyStyle: 'font-normal leading-relaxed',
    },
    toneGuidelines: {
      personality: [
        'Patient, honest, and journey-focused',
        'Down-to-earth: an active fellow learner speaking alongside the audience',
        'Calm and measured: natural conversational rhythm over rushed perfection',
        'Respectful of viewer time: direct to the story within 15 seconds',
      ],
      doSay: [
        '"Welcome to Speak in Progress. Today is Day 14 of my speaking journey."',
        '"I hesitated on that phrase; let me say it once more naturally."',
        '"The goal today is not zero mistakes; it is speaking without translating in my head first."',
        '"Now let\'s hide the notes and retell the story in my own spontaneous words."',
      ],
      dontSay: [
        '"Today I will teach you 5 advanced grammar rules you must obey."',
        '"Sorry for my bad English! (Never apologize for showing up to practice)."',
        '"Smash that like button right now! (Keep presentation calm & dignified)."',
        '"Learn fluent English in 7 days without effort!"',
      ],
      philosophyQuote: 'Progress is quiet. It looks like another paragraph read, another sentence retold.',
    },
    youtubeMeta: {
      aboutBio: `Welcome to Speak in Progress!

I am documenting my ongoing journey to build natural English speaking fluency and communication confidence from scratch, recorded on my PC at my own pace.

No fake accents. No rehearsed perfection. Just sitting down at my screen, reading thought-provoking micro-stories, breaking down 3 useful spoken expressions, and retraining my brain to retell each story unscripted in my own words.

What you will find on this channel:
• Screen-recorded English storytelling practice in crisp 1080p
• 3 practical, real-world phrases per session that elevate spoken vocabulary
• Unscripted retellings: learning to think and speak directly in English without mental translation
• Transparent self-reviews on pronunciation, rhythm, and pacing

I am not an English teacher. I am an active learner proving that consistent, honest practice turns hesitation into fluency.

Subscribe and grow along with me: One story. One session. One step forward.`,
      defaultTags: [
        'Speak in Progress',
        'English speaking practice',
        'spoken English journey',
        'faceless YouTube practice',
        'retelling method English',
        'improve English speaking',
        'English communication practice',
        'progress not perfection',
      ],
      videoDescriptionTemplate: `Speak in Progress · Day [DAY_NUMBER]
Story: [STORY_TITLE]

Building real spoken fluency through storytelling, vocabulary breakdown, and unassisted retelling.

⏱ Timestamps:
0:00 - Introduction & Speaking Focus
0:40 - Story Teleprompter Reading
3:15 - 3 Useful Spoken Expressions
4:20 - Script-Free Retelling (My own words)
5:50 - Personal Speaking Reflection & Takeaway

🎯 Today's 3 Expressions:
1. [EXPRESSION_1]
2. [EXPRESSION_2]
3. [EXPRESSION_3]

💡 Today's Rule:
"Progress, not perfection. Fluency is not the absence of mistakes; it is the presence of momentum."

#SpeakInProgress #EnglishSpeakingPractice #SpokenEnglishJourney #ProgressNotPerfection`,
      seriesTitle: 'Speak in Progress Series',
    },
  },
  {
    id: 'speak-in-progress-cobalt',
    name: 'Speak in Progress',
    tagline: 'Modern Cobalt Studio · The Fluency Reps',
    subline: 'Deep dark cobalt aesthetics tailored for late-night screen recording and focused study.',
    conceptPhilosophy:
      'A sleek, deep cobalt palette emphasizing technical precision, deep focus, and clean typography. Excellent for nighttime PC recording sessions with zero eye fatigue.',
    handleSuggestions: [
      '@SpeakInProgress',
      '@SpeakInProgressJourney',
      '@SpeakProgressDaily',
      '@SpeakInProgressOfficial',
    ],
    vibeKeywords: ['Cobalt', 'Modern', 'Clean', 'Focused', 'High-Contrast'],
    colors: {
      primary: {
        name: 'Midnight Obsidian',
        role: 'Deep background & dominant ground',
        hex: '#0A0E17',
        hsl: '220° 39% 7%',
        rgb: '10, 14, 23',
        textDark: false,
        notes: '60% canvas; sleek, eye-comfort dark ground for high-resolution screen recording.',
      },
      secondary: {
        name: 'Cobalt Slate Surface',
        role: 'Elevated cards & subtle borders',
        hex: '#131B2E',
        hsl: '222° 41% 13%',
        rgb: '19, 27, 46',
        textDark: false,
        notes: '30% structural surface; provides soft depth with 1px border at rgba(255,255,255,0.08).',
      },
      accent: {
        name: 'Electric Cobalt',
        role: 'Brand emblem, active tabs & primary CTAs',
        hex: '#3B82F6',
        hsl: '217° 91% 60%',
        rgb: '59, 130, 246',
        textDark: true,
        notes: '10% accent budget; vibrant, modern, high-energy cue of progressive motion.',
      },
      surface: {
        name: 'Deep Navy Tint',
        role: 'Interactive states, input fills & badges',
        hex: '#1E293B',
        hsl: '215° 28% 17%',
        rgb: '30, 41, 59',
        textDark: false,
        notes: 'Controls and hover backgrounds with smooth transitions.',
      },
      canvas: {
        name: 'Crisp Cloud White',
        role: 'High-contrast teleprompter body text',
        hex: '#F8FAFC',
        hsl: '210° 40% 98%',
        rgb: '248, 250, 252',
        textDark: true,
        notes: 'Maximum readability across 1080p and 4K PC screen recordings.',
      },
      textMuted: {
        name: 'Cool Slate',
        role: 'Timestamps, step indexes & subtle metadata',
        hex: '#94A3B8',
        hsl: '215° 16% 65%',
        rgb: '148, 163, 184',
        textDark: true,
        notes: 'Quiet typography that guides the viewer\'s eye directly to the story.',
      },
    },
    typography: {
      displayFont: 'Plus Jakarta Sans',
      bodyFont: 'DM Sans',
      monoFont: 'JetBrains Mono',
      editorialFont: 'Playfair Display',
      headlineStyle: 'font-extrabold tracking-tight',
      bodyStyle: 'font-normal leading-relaxed',
    },
    toneGuidelines: {
      personality: [
        'Patient, honest, and journey-focused',
        'Down-to-earth: an active fellow learner speaking alongside the audience',
        'Calm and measured: natural conversational rhythm over rushed perfection',
        'Respectful of viewer time: direct to the story within 15 seconds',
      ],
      doSay: [
        '"Welcome to Speak in Progress. Today is Day 14 of my speaking journey."',
        '"I hesitated on that phrase; let me say it once more naturally."',
        '"The goal today is not zero mistakes; it is speaking without translating in my head first."',
      ],
      dontSay: [
        '"Today I will teach you 5 advanced grammar rules you must obey."',
        '"Sorry for my bad English! (Never apologize for showing up to practice)."',
      ],
      philosophyQuote: 'Progress is quiet. It looks like another paragraph read, another sentence retold.',
    },
    youtubeMeta: {
      aboutBio: `Welcome to Speak in Progress!

A continuous experiment in turning passive English comprehension into active, confident speech.`,
      defaultTags: ['Speak in Progress', 'English speaking practice'],
      videoDescriptionTemplate: `Speak in Progress · Day [DAY_NUMBER]`,
      seriesTitle: 'Speak in Progress Series',
    },
  },
  {
    id: 'speak-in-progress-amber',
    name: 'Speak in Progress',
    tagline: 'The Studio Voice Lab · Unscripted Practice',
    subline: 'Warm studio aesthetics capturing the raw, courageous reps of speech.',
    conceptPhilosophy:
      'A warm documentary aesthetic tailored for creator desks, warm lamp lighting, and intimate voice podcasting. It emphasizes the human warmth of the journey, making the viewer feel like they are sitting beside you in a focused study session.',
    handleSuggestions: [
      '@SpeakInProgress',
      '@SpeakInProgressLab',
      '@SpeakProgressStudio',
      '@SpeakInVoice',
    ],
    vibeKeywords: ['Warm', 'Studio', 'Editorial', 'Authentic', 'Reflective'],
    colors: {
      primary: {
        name: 'Obsidian Charcoal',
        role: 'Dark canvas background',
        hex: '#0D0E12',
        hsl: '228° 14% 6%',
        rgb: '13, 14, 18',
        textDark: false,
        notes: 'Deep warm-neutral black.',
      },
      secondary: {
        name: 'Warm Titanium',
        role: 'Structural cards & elevated panels',
        hex: '#181A22',
        hsl: '230° 17% 11%',
        rgb: '24, 26, 34',
        textDark: false,
        notes: 'Cohesive architectural surface.',
      },
      accent: {
        name: 'Sunrise Amber',
        role: 'Accent highlights & active states',
        hex: '#F59E0B',
        hsl: '38° 92% 50%',
        rgb: '245, 158, 11',
        textDark: true,
        notes: 'Warm amber glow representing the dawn of vocal confidence.',
      },
      surface: {
        name: 'Charcoal Mist',
        role: 'Buttons & interactive elements',
        hex: '#232733',
        hsl: '226° 18% 17%',
        rgb: '35, 39, 51',
        textDark: false,
        notes: 'Hover states and controls.',
      },
      canvas: {
        name: 'Warm Alabaster',
        role: 'Primary reading text',
        hex: '#F4F4F5',
        hsl: '240° 5% 96%',
        rgb: '244, 244, 245',
        textDark: true,
        notes: 'High-contrast soft white.',
      },
      textMuted: {
        name: 'Muted Bronze-Slate',
        role: 'Subtitles & hints',
        hex: '#A1A1AA',
        hsl: '240° 5% 65%',
        rgb: '161, 161, 170',
        textDark: true,
        notes: 'Secondary labels.',
      },
    },
    typography: {
      displayFont: 'Plus Jakarta Sans',
      bodyFont: 'DM Sans',
      monoFont: 'JetBrains Mono',
      editorialFont: 'Playfair Display',
      headlineStyle: 'font-extrabold tracking-tight',
      bodyStyle: 'font-normal leading-relaxed',
    },
    toneGuidelines: {
      personality: [
        'Honest, patient, and grounded',
        'Celebrates the messy middle of learning',
        'Encourages continuous momentum over perfection',
        'Conversational, thoughtful cadence',
      ],
      doSay: [
        '"Welcome to Speak in Progress. Let\'s see how much of this story survives in my own words."',
        '"Notice how this idiom transforms the tone of the sentence."',
        '"Every stumble is just data for the next session."',
      ],
      dontSay: [
        '"Never make mistakes when speaking English."',
        '"You must sound like an American movie star."',
        '"Don\'t stop until it is 100% perfect."',
      ],
      philosophyQuote: 'You truly master an English expression when you can give it away in a story of your own.',
    },
    youtubeMeta: {
      aboutBio: `Welcome to Speak in Progress!

A continuous experiment in turning passive English comprehension into active, confident speech.`,
      defaultTags: ['Speak in Progress', 'English practice channel'],
      videoDescriptionTemplate: `Speak in Progress · Day [DAY_NUMBER]`,
      seriesTitle: 'Speak in Progress Series',
    },
  },
];
