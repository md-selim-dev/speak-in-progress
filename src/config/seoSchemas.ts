/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SITE_CONFIG, PublicPageId } from './site';

export interface PublicFaqItem {
  q: string;
  a: string;
  category: 'General' | 'Prompter & Practice' | 'YouTube & Output' | 'Privacy & Access';
}

export const PUBLIC_FAQ_ITEMS: PublicFaqItem[] = [
  {
    category: 'General',
    q: 'What is Speak in Progress?',
    a: 'Speak in Progress is a purpose-built desktop studio application engineered by Md. Selim for mastering English spoken fluency and YouTube content delivery. It combines an ultra-smooth teleprompter, an impromptu 90-second recall timer, a 2K thumbnail generator, a dynamic video intro suite, and a 120-day progressive CEFR syllabus (A1 to C2).',
  },
  {
    category: 'Prompter & Practice',
    q: 'Why practice spoken English with a teleprompter?',
    a: 'Reading along with calibrated auto-scroll (between 15 and 75 pixels per second, targeting 130–160 words per minute) trains neuromuscular speech rhythm and eliminates hesitation pauses. It conditions the speaker to formulate continuous English phrases without stopping to translate in their head.',
  },
  {
    category: 'Prompter & Practice',
    q: 'What is the 90-second impromptu recall challenge?',
    a: 'Immediately after reading through a script on the prompter, the text is hidden and a 90-second countdown begins. The speaker must spontaneously summarize the core points aloud using the target vocabulary. This bridges the critical gap between passive reading fluency and active unscripted conversational synthesis.',
  },
  {
    category: 'Prompter & Practice',
    q: 'Can I customize the teleprompter scroll speed and visual layout?',
    a: 'Yes. You can fine-tune scroll velocity between 15 and 75 pixels per second to match your natural speech cadence (110 to 165 WPM). You can also scale font size from 24px up to 64px, switch line height, adjust column margins, and toggle eye-level focus guides.',
  },
  {
    category: 'YouTube & Output',
    q: 'How does the faceless YouTube workflow function?',
    a: 'Rather than dealing with camera anxiety, studio lighting, or complex webcam rigs, you simply record your computer screen using free capture software like OBS Studio or native Windows/macOS tools while the teleprompter scrolls. Your voice is recorded via your microphone over the high-contrast prompter text, creating clean educational and commentary videos ready for YouTube.',
  },
  {
    category: 'YouTube & Output',
    q: 'Can I record with screen recorders other than OBS Studio?',
    a: 'Yes. Speak in Progress runs in any modern desktop browser. You can capture sessions using OBS Studio, native Windows Game Bar (Win+G), macOS QuickTime, or any PC screen recorder.',
  },
  {
    category: 'YouTube & Output',
    q: 'How does the Thumbnail & Video Intro suite work without external software?',
    a: 'The application contains native HTML5 canvas graphic engines. The Thumbnail Studio renders pixel-perfect 2560×1440 (2K) and 1920×1080 (FHD) PNG graphics with customizable titles, level badges, and color presets. The Video Intro Suite renders animated countdown title sequences directly in the browser with zero external editing required.',
  },
  {
    category: 'General',
    q: 'What is the 120-Day structured syllabus?',
    a: 'The application contains a built-in curriculum organized across 6 CEFR difficulty levels (A1 through C2). Each day provides an actionable script, key vocabulary breakdown, structural grammar patterns, and estimated speaking duration, guiding speakers from beginner confidence to executive-level articulation.',
  },
  {
    category: 'Privacy & Access',
    q: 'Can anyone create an account, or is the private studio restricted?',
    a: 'The public website, methodology documentation, feature breakdowns, and workflow guides are open to everyone worldwide. The private studio dashboard, personal script library, and recording persistence are currently reserved for the creator account to ensure an uninterrupted, personalized workflow.',
  },
  {
    category: 'General',
    q: 'Where can I watch Speak in Progress practice sessions and follow the journey?',
    a: 'You can watch authentic spoken English practice sessions, unscripted retellings, and studio workflow documentation directly on our official YouTube channel: @SpeakInProgress (https://www.youtube.com/@SpeakInProgress).',
  },
];

export const WORKFLOW_STEPS = [
  {
    position: 1,
    name: 'Select Daily Script or Curriculum Topic',
    subtitle: 'Structured Leveled Progression (A1 through C2)',
    text: 'Choose from the built-in 120-Day structured syllabus organized across 6 CEFR difficulty levels, or paste your own custom script with target vocabulary and estimated spoken duration.',
  },
  {
    position: 2,
    name: 'Calibrate Prompter Speed and Visual Layout',
    subtitle: 'Target 130–160 Spoken Words Per Minute',
    text: 'Adjust smooth auto-scroll velocity between 15 and 75 pixels per second to match your conversational pace, scale fonts (24px–64px), and enable eye-level reading focus guides.',
  },
  {
    position: 3,
    name: 'Record Seamlessly with PC Screen Capture (OBS Studio)',
    subtitle: 'Faceless YouTube Production Philosophy',
    text: 'Hit record in OBS Studio, Windows Game Bar, or macOS QuickTime. Press F for clean distraction-free teleprompter view while your microphone captures clear voiceover.',
  },
  {
    position: 4,
    name: 'Run the 90-Second Impromptu Recall Challenge',
    subtitle: 'Active Spontaneous Cognitive Synthesis',
    text: 'Immediately after reading the prompter, hide the script and deliver a spontaneous 90-second verbal summary using cognitive anchor cues to bridge passive reading into active fluency.',
  },
  {
    position: 5,
    name: 'Package Assets in Thumbnail, Intro & YouTube Upload Kits',
    subtitle: 'Zero-Export Canvas Generation (2K & 1080p)',
    text: 'Generate 2560×1440 or 1920×1080 YouTube thumbnails, animated video intro stings, and daily YouTube title/description upload metadata, while saving stumble logs in the private creator vault.',
  },
];

export const STUDIO_MODULES = [
  {
    position: 1,
    name: 'Interactive Teleprompter Studio',
    description:
      'Continuous Auto-Scroll (15–75 px/s, 130–160 WPM) and Paragraph Focus modes, eye-line focus beam, clean screen recording canvas (F shortcut), and in-app microphone rehearsal playback.',
  },
  {
    position: 2,
    name: 'Deliberate Fluency Methodology',
    description:
      '120-day CEFR syllabus (A1–C2) pairing calibrated reading with a 90-second unscripted memory recall timer, cognitive retrieval anchors, and private stumble-rate analytics.',
  },
  {
    position: 3,
    name: '16:9 High-CTR Thumbnail Studio',
    description:
      'HTML5 Canvas generator exporting pixel-perfect 2K (2560×1440) and FHD (1920×1080) YouTube thumbnails with customizable typography, highlighted words, and episode day badges.',
  },
  {
    position: 4,
    name: 'Video Intro, Banner & YouTube Upload Kit',
    description:
      'Browser-rendered animated video intro stings with acoustic audio chords, 2560×1440 channel banners with mobile/TV safe zones, SVG logos, and daily YouTube video title/description generators.',
  },
];

export const PACING_CALIBRATION_TABLE = [
  {
    level: 'A1–A2 (Foundational)',
    scrollSpeed: '18–25 px/sec',
    wpm: '110–125 WPM',
    focus: 'Vowel elongation, syllable precision, breathing control',
  },
  {
    level: 'B1–B2 (Conversational)',
    scrollSpeed: '30–42 px/sec',
    wpm: '130–145 WPM',
    focus: 'Natural pauses, connected speech, professional inflection',
  },
  {
    level: 'C1–C2 (Advanced Mastery)',
    scrollSpeed: '45–60 px/sec',
    wpm: '150–165 WPM',
    focus: 'Rapid thought delivery, authoritative storytelling, debate cadence',
  },
];

/**
 * Generates route-specific Schema.org JSON-LD graph for SEO, AEO & GEO.
 * Strictly returns null for 404 pages and private creator workspace routes.
 */
export function getRouteStructuredData(
  pageId: PublicPageId | 'notFound',
  isPrivateWorkspace: boolean = false
): Record<string, unknown> | null {
  if (isPrivateWorkspace || pageId === 'notFound') {
    return null;
  }

  const page = SITE_CONFIG.pages[pageId] || SITE_CONFIG.pages.home;
  const fullUrl = page.path === '/' ? `${SITE_CONFIG.domain}/` : `${SITE_CONFIG.domain}${page.path}`;

  const founderEntity = {
    '@type': 'Person',
    '@id': `${SITE_CONFIG.domain}/#founder`,
    name: SITE_CONFIG.creator.name,
    jobTitle: SITE_CONFIG.creator.role,
    url: `${SITE_CONFIG.domain}/about`,
    sameAs: [SITE_CONFIG.youtubeUrl],
    worksFor: { '@id': `${SITE_CONFIG.domain}/#organization` },
  };

  const orgEntity = {
    '@type': 'EducationalOrganization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.domain}/`,
    sameAs: [SITE_CONFIG.youtubeUrl],
    founder: { '@id': `${SITE_CONFIG.domain}/#founder` },
    slogan: 'Progress, not perfection.',
    description:
      'Deliberate spoken English fluency framework and faceless PC screen-recording studio engineered to eliminate hesitation through calibrated teleprompter pacing and active retrieval.',
  };

  const websiteEntity = {
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    url: `${SITE_CONFIG.domain}/`,
    name: SITE_CONFIG.name,
    alternateName: ['Speak in Progress Studio', 'SpeakInProgress'],
    description: SITE_CONFIG.pages.home.description,
    inLanguage: 'en-US',
    publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
  };

  const breadcrumbEntity =
    pageId === 'home'
      ? null
      : {
          '@type': 'BreadcrumbList',
          '@id': `${fullUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${SITE_CONFIG.domain}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: page.navLabel,
              item: fullUrl,
            },
          ],
        };

  if (pageId === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteEntity,
        founderEntity,
        orgEntity,
        {
          '@type': 'WebApplication',
          '@id': `${SITE_CONFIG.domain}/#webapp`,
          name: SITE_CONFIG.pages.home.title,
          url: `${SITE_CONFIG.domain}/`,
          image: `${SITE_CONFIG.domain}${SITE_CONFIG.assets.ogImage}`,
          applicationCategory: 'EducationalApplication',
          applicationSubCategory: 'Language Learning & Video Production Studio',
          operatingSystem: 'All modern desktop and mobile browsers (Chrome, Edge, Firefox, Safari)',
          browserRequirements: 'Requires modern browser with HTML5 Canvas and Web Audio API support',
          author: { '@id': `${SITE_CONFIG.domain}/#founder` },
          publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
          description: SITE_CONFIG.pages.home.description,
          featureList: [
            'Continuous and paragraph auto-scroll teleprompter (15-75 px/s, 130-160 WPM)',
            '5-step deliberate speech recording workflow',
            '90-second unscripted memory retelling with cognitive anchor triggers',
            'In-app microphone rehearsal audio recorder with instant playback',
            '16:9 YouTube thumbnail generator (2K 2560x1440 and FHD 1920x1080)',
            'Acoustic animated video intro stinger and channel banner suite',
            'Daily YouTube title and description metadata generator',
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${SITE_CONFIG.domain}/#webpage`,
          url: `${SITE_CONFIG.domain}/`,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
          about: { '@id': `${SITE_CONFIG.domain}/#organization` },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.domain}${SITE_CONFIG.assets.ogImage}`,
            width: SITE_CONFIG.assets.ogWidth,
            height: SITE_CONFIG.assets.ogHeight,
          },
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.speakable-summary', '.speakable-methodology', '.speakable-faq'],
          },
        },
      ],
    };
  }

  if (pageId === 'features') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteEntity,
        orgEntity,
        breadcrumbEntity,
        {
          '@type': 'WebPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
          breadcrumb: { '@id': `${fullUrl}#breadcrumb` },
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.speakable-summary', '.speakable-feature'],
          },
        },
        {
          '@type': 'ItemList',
          '@id': `${fullUrl}#modules`,
          name: 'Speak in Progress Integrated Creator Studio Modules',
          description: 'Four integrated modules built for spoken English practice and faceless YouTube recording.',
          numberOfItems: STUDIO_MODULES.length,
          itemListElement: STUDIO_MODULES.map((mod) => ({
            '@type': 'ListItem',
            position: mod.position,
            name: mod.name,
            description: mod.description,
          })),
        },
      ],
    };
  }

  if (pageId === 'howItWorks') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteEntity,
        orgEntity,
        breadcrumbEntity,
        {
          '@type': 'WebPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
          breadcrumb: { '@id': `${fullUrl}#breadcrumb` },
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.speakable-summary', '.speakable-step'],
          },
        },
        {
          '@type': 'HowTo',
          '@id': `${fullUrl}#howto`,
          name: 'How to Practice Spoken English with the 5-Step Screen Recording Workflow',
          description: page.description,
          totalTime: 'PT15M',
          tool: [
            { '@type': 'HowToTool', name: 'Modern Desktop Web Browser' },
            { '@type': 'HowToTool', name: 'OBS Studio or PC Screen Recorder' },
            { '@type': 'HowToTool', name: 'Computer Microphone' },
          ],
          step: WORKFLOW_STEPS.map((s) => ({
            '@type': 'HowToStep',
            position: s.position,
            name: s.name,
            text: s.text,
            url: `${fullUrl}#step-${s.position}`,
          })),
        },
      ],
    };
  }

  if (pageId === 'about') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteEntity,
        founderEntity,
        orgEntity,
        breadcrumbEntity,
        {
          '@type': 'AboutPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
          breadcrumb: { '@id': `${fullUrl}#breadcrumb` },
          mainEntity: { '@id': `${SITE_CONFIG.domain}/#founder` },
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.speakable-summary', '.speakable-definition', '.speakable-methodology'],
          },
        },
        {
          '@type': 'DefinedTerm',
          '@id': `${fullUrl}#cognitive-cadence-method`,
          name: 'Cognitive Cadence Method',
          description:
            'A structured spoken English training methodology created by Md. Selim combining calibrated teleprompter pacing (130–160 words per minute), 90-second spontaneous active recall, faceless PC screen recording, and stumble-rate tracking.',
          inDefinedTermSet: `${SITE_CONFIG.domain}/about`,
        },
      ],
    };
  }

  // faq
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteEntity,
      orgEntity,
      breadcrumbEntity,
      {
        '@type': 'FAQPage',
        '@id': `${fullUrl}#faqpage`,
        url: fullUrl,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
        breadcrumb: { '@id': `${fullUrl}#breadcrumb` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.speakable-summary', '.speakable-faq'],
        },
        mainEntity: PUBLIC_FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };
}
