/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { SITE_CONFIG, PublicPageId } from '../src/config/site';

const DIST_DIR = path.resolve('dist');

interface PagePrerenderMeta {
  id: PublicPageId | 'notFound';
  path: string;
  title: string;
  description: string;
  isIndexable: boolean;
  heading: string;
  subheading: string;
  bodyHtml: string;
}

const PUBLIC_PAGES: PagePrerenderMeta[] = [
  {
    id: 'home',
    path: '/',
    title: SITE_CONFIG.pages.home.title,
    description: SITE_CONFIG.pages.home.description,
    isIndexable: true,
    heading: 'Documenting Real English Fluency, One Authentic Day at a Time.',
    subheading:
      'Master spoken cadence, eliminate cognitive hesitation pauses, and build a lasting YouTube speaking archive with our calibrated teleprompter and 90s unscripted recall framework.',
    bodyHtml: `
      <section class="text-center max-w-4xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
          <span>Faceless Screen-Recording Studio · PC &amp; OBS Ready</span>
        </div>
        <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Documenting Real English Fluency, <span class="text-emerald-400">One Authentic Day at a Time.</span>
        </h1>
        <p class="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Master spoken cadence, eliminate cognitive hesitation pauses, and build a lasting YouTube speaking archive with our calibrated teleprompter and 90s unscripted recall framework.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="/features" class="px-6 py-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
            Explore 4 Studio Modules
          </a>
          <a href="/how-it-works" class="px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 text-xs font-bold uppercase tracking-wider">
            5-Step Daily Routine
          </a>
          <a href="/faq" class="px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 text-xs font-bold uppercase tracking-wider">
            Methodology FAQ
          </a>
        </div>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Four Integrated Studios Built for Spoken English</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3">
            <h3 class="text-lg font-bold text-emerald-400">01 · Calibrated Teleprompter</h3>
            <p class="text-xs sm:text-sm text-stone-300">
              Smooth auto-scroll between 15 and 75 px/s calibrated for target English speech cadence (130–160 WPM). Eliminate filler pauses and eye wandering.
            </p>
          </article>
          <article class="p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3">
            <h3 class="text-lg font-bold text-emerald-400">02 · Cognitive Fluency &amp; 90s Recall</h3>
            <p class="text-xs sm:text-sm text-stone-300">
              Immediate unscripted retelling timer after teleprompter reading. Builds active conversational synthesis from memory without reading crutches.
            </p>
          </article>
          <article class="p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3">
            <h3 class="text-lg font-bold text-emerald-400">03 · 16:9 YouTube Thumbnail Generator</h3>
            <p class="text-xs sm:text-sm text-stone-300">
              Export pixel-perfect 2K and 1080p thumbnails with dynamic episode numbering, CEFR tags, and topic cues ready for video publishing.
            </p>
          </article>
          <article class="p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3">
            <h3 class="text-lg font-bold text-emerald-400">04 · Dynamic Video Intro Stinger Suite</h3>
            <p class="text-xs sm:text-sm text-stone-300">
              Generate MP4 and WebM intro stingers with sound and acoustic animations directly in browser or transcode cleanly via server.
            </p>
          </article>
        </div>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">The 5-Step Daily Studio Workflow</h2>
        <div class="space-y-4 text-xs sm:text-sm text-stone-300">
          <p><strong>Step 1: Voiceover Intro Hook (15s)</strong> — Hook viewers and warm up speaking organs.</p>
          <p><strong>Step 2: Story Reading with Calibrated Prompter</strong> — Read narrative at 130–150 WPM with steady cadence.</p>
          <p><strong>Step 3: Key Expressions &amp; Collocations</strong> — Articulate 3 high-impact phrases in context.</p>
          <p><strong>Step 4: 90-Second Impromptu Memory Retelling</strong> — Speak freely from memory without reading text.</p>
          <p><strong>Step 5: Private Stumble Log &amp; Fluency Rating</strong> — Track progress, stumbling friction, and daily wins.</p>
        </div>
      </section>
    `,
  },
  {
    id: 'features',
    path: '/features',
    title: SITE_CONFIG.pages.features.title,
    description: SITE_CONFIG.pages.features.description,
    isIndexable: true,
    heading: 'Everything Needed for YouTube Spoken Practice',
    subheading:
      'Four purpose-built studios working seamlessly inside a single high-performance workspace. Designed strictly around real, existing features for authentic PC screen recording.',
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Integrated Creator Suite</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Everything Needed for YouTube Spoken Practice
        </h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Four purpose-built studios working seamlessly inside a single high-performance workspace. Designed strictly around real, existing features for authentic PC screen recording.
        </p>
      </section>

      <div class="space-y-8">
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Module 01: Interactive Teleprompter Studio</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            Engineered specifically to solve spoken English hesitation and unnatural pacing. Smooth continuous scrolling from 15 to 75 px/s targeting 130–160 WPM. Supports eye-level reading guides, customizable font sizing (24–64px), and paragraph stepping.
          </p>
        </article>
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Module 02: Cognitive Cadence &amp; 90s Impromptu Retelling</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            The bridge between reading along and spontaneous speech. Immediately after reading, text vanishes and a 90-second countdown begins with memory anchor prompts. Forces brain to retrieve vocabulary actively without translating mentally.
          </p>
        </article>
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Module 03: 16:9 YouTube Thumbnail Generator</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            High-contrast 2K and 1080p canvas generator adhering strictly to the Speak in Progress brand identity. Instant download ready for YouTube video uploads.
          </p>
        </article>
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Module 04: Dynamic Video Intro Stinger Suite</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            Generates 3.5s to 7s animated brand bumpers with acoustic audio waveforms in both MP4 (H.264+AAC) and WebM formats for seamless video intros.
          </p>
        </article>
      </div>

      <div class="pt-8 text-center space-y-4">
        <a href="/how-it-works" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
          See the 5-Step Daily Workflow →
        </a>
      </div>
    `,
  },
  {
    id: 'howItWorks',
    path: '/how-it-works',
    title: SITE_CONFIG.pages.howItWorks.title,
    description: SITE_CONFIG.pages.howItWorks.description,
    isIndexable: true,
    heading: 'The 5-Step Daily Speaking Blueprint',
    subheading:
      'A structured routine for recording daily faceless YouTube practice sessions. Each session builds fluency, speech cadence, and cognitive retrieval.',
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Daily Production Routine</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          The 5-Step Daily Speaking Blueprint
        </h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          A structured routine for recording daily faceless YouTube practice sessions. Each session builds fluency, speech cadence, and cognitive retrieval.
        </p>
      </section>

      <div class="space-y-6">
        <article class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <h2 class="text-xl font-bold text-emerald-400">Step 1: 15-Second Voiceover Intro Hook</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Open the screen recorder, read the daily session greeting with positive vocal energy, and introduce the day's linguistic focus.
          </p>
        </article>
        <article class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <h2 class="text-xl font-bold text-emerald-400">Step 2: Calibrated Teleprompter Reading</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Read through the 5-paragraph daily script along with the auto-scroll bar. Target a steady 130–150 words per minute pacing without rushing or freezing.
          </p>
        </article>
        <article class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <h2 class="text-xl font-bold text-emerald-400">Step 3: Key Expressions &amp; Collocations Deep-Dive</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Identify 3 high-impact idioms or phrasal verbs from the passage. Pronounce each cleanly and formulate a spontaneous personal example.
          </p>
        </article>
        <article class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <h2 class="text-xl font-bold text-emerald-400">Step 4: 90-Second Impromptu Memory Retelling</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Hide the script text. The 90s countdown begins with 3 anchor cues. Summarize the narrative aloud without pausing, forcing active neural language production.
          </p>
        </article>
        <article class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <h2 class="text-xl font-bold text-emerald-400">Step 5: Private Stumble Log &amp; Fluency Reflection</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Log your daily independence rating (1–5), note stumbling friction areas, and save your practice entry to the private encrypted database.
          </p>
        </article>
      </div>

      <div class="pt-8 text-center space-y-4">
        <a href="/about" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 font-bold text-xs uppercase tracking-wider">
          Read About the Methodology &amp; Philosophy →
        </a>
      </div>
    `,
  },
  {
    id: 'about',
    path: '/about',
    title: SITE_CONFIG.pages.about.title,
    description: SITE_CONFIG.pages.about.description,
    isIndexable: true,
    heading: 'Behind the Speak in Progress Methodology',
    subheading:
      'The philosophy of deliberate practice: overcoming speaking anxiety, normalizing stumbles, and documenting daily progress publicly.',
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Philosophy &amp; Foundation</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Behind the Speak in Progress Methodology
        </h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          The philosophy of deliberate practice: overcoming speaking anxiety, normalizing stumbles, and documenting daily progress publicly.
        </p>
      </section>

      <div class="space-y-6">
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Why Documenting Progress Beats Perfection</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            Most language learners stay silent for years because they wait to speak "flawlessly." Speak in Progress was founded on the opposite premise: true communicative mastery is forged by speaking aloud every single day, embracing stumbles as cognitive calibration cues, and documenting real-world progress.
          </p>
        </article>
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">The Power of Faceless Screen Recording</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            On-camera speaking introduces vanity anxiety, lighting hassles, and posture self-consciousness. By recording the teleprompter screen directly, 100% of cognitive bandwidth is freed to focus purely on speech tempo, vocal resonance, vocabulary retrieval, and cadence.
          </p>
        </article>
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Creator &amp; Founder Attribution</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            Engineered and designed by <strong>Md. Selim</strong>. Built for personal spoken English discipline and designed for creator consistency. For inquiries, contact <a href="mailto:support@mdselim.com" class="text-emerald-400 underline">support@mdselim.com</a>.
          </p>
        </article>
      </div>

      <div class="pt-8 text-center space-y-4">
        <a href="/faq" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
          Read All Frequently Asked Questions →
        </a>
      </div>
    `,
  },
  {
    id: 'faq',
    path: '/faq',
    title: SITE_CONFIG.pages.faq.title,
    description: SITE_CONFIG.pages.faq.description,
    isIndexable: true,
    heading: 'Frequently Asked Questions',
    subheading:
      'Everything you need to know about Speak in Progress, teleprompter pacing, unscripted retelling, faceless YouTube workflows, and data security.',
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Direct Answers</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about Speak in Progress, teleprompter pacing, unscripted retelling, faceless YouTube workflows, and data security.
        </p>
      </section>

      <div class="space-y-6">
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <h2 class="text-lg font-bold text-emerald-400">What is Speak in Progress?</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Speak in Progress is a purpose-built desktop studio application engineered by Md. Selim for mastering English spoken fluency and YouTube content delivery. It combines a calibrated teleprompter, an impromptu 90-second recall timer, a thumbnail studio, and video stinger tools.
          </p>
        </article>
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <h2 class="text-lg font-bold text-emerald-400">Why practice spoken English with a teleprompter?</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Reading along with calibrated auto-scroll (between 15 and 75 px/s, targeting 130–160 WPM) trains neuromuscular speech rhythm and eliminates hesitation pauses. It conditions the speaker to formulate continuous English phrases without stopping to translate mentally.
          </p>
        </article>
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <h2 class="text-lg font-bold text-emerald-400">What is the 90-second impromptu recall challenge?</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Immediately after reading through a script on the prompter, the text is hidden and a 90-second countdown begins. The speaker must spontaneously summarize the core points aloud using the target vocabulary, bridging passive reading with active conversational synthesis.
          </p>
        </article>
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <h2 class="text-lg font-bold text-emerald-400">How does the faceless YouTube workflow function?</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Rather than dealing with camera anxiety or lighting rigs, you record your computer screen using OBS Studio or native tools while the teleprompter scrolls. Your voice is recorded over the high-contrast prompter text, creating clean educational videos.
          </p>
        </article>
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <h2 class="text-lg font-bold text-emerald-400">Is my practice data and private scripts kept secure?</h2>
          <p class="text-xs sm:text-sm text-stone-300">
            Yes. The creator studio workspace, private scripts, stumble ratings, and video recordings are strictly isolated behind Google Firebase Authentication. Public pages never expose private user records.
          </p>
        </article>
      </div>

      <div class="pt-8 text-center space-y-4">
        <a href="/" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
          Return to Studio Home →
        </a>
      </div>
    `,
  },
  {
    id: 'notFound',
    path: '/404',
    title: 'Page Not Found (404) — Speak in Progress',
    description: 'The requested page could not be found. Return to the Speak in Progress home page.',
    isIndexable: false,
    heading: 'Lost in the Studio? (Error 404)',
    subheading: 'The page you requested does not exist, has been removed, or the URL was entered incorrectly.',
    bodyHtml: `
      <section class="text-center max-w-2xl mx-auto py-12 space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-950/40 border border-amber-500/30">
          <span>Error 404 · Page Not Found</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Lost in the Studio?
        </h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-md mx-auto">
          The page or resource you are looking for does not exist, has been removed, or the URL was entered incorrectly.
        </p>
        <div class="pt-4">
          <a href="/" class="px-6 py-3.5 rounded-2xl font-bold text-sm text-black bg-emerald-400 hover:bg-emerald-300 transition-all inline-block">
            Return to Studio Home
          </a>
        </div>
        <div class="pt-8 border-t border-white/10 text-left space-y-3">
          <div class="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider text-center">
            Explore Available Public Pages
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <a href="/features" class="p-3 rounded-xl bg-stone-900 border border-white/10 text-emerald-400 font-bold">Features →</a>
            <a href="/how-it-works" class="p-3 rounded-xl bg-stone-900 border border-white/10 text-emerald-400 font-bold">How It Works →</a>
            <a href="/about" class="p-3 rounded-xl bg-stone-900 border border-white/10 text-emerald-400 font-bold">About →</a>
            <a href="/faq" class="p-3 rounded-xl bg-stone-900 border border-white/10 text-emerald-400 font-bold">FAQ →</a>
          </div>
        </div>
      </section>
    `,
  },
];

function generatePageHtml(template: string, page: PagePrerenderMeta): string {
  let html = template;

  const fullCanonicalUrl =
    page.id === 'notFound'
      ? `${SITE_CONFIG.domain}/404.html`
      : `${SITE_CONFIG.domain}${page.path === '/' ? '/' : page.path}`;

  // 1. Update Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);

  // 2. Update Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${page.description}" />`
  );

  // 3. Update Canonical URL
  html = html.replace(
    /<link\s+rel="canonical"\s+id="canonical-url"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" id="canonical-url" href="${fullCanonicalUrl}" />`
  );

  // 4. Update OpenGraph Tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${page.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${fullCanonicalUrl}" />`
  );

  // 5. Update Twitter Card Tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${page.description}" />`
  );

  // 6. Robots indexing directives
  if (!page.isIndexable) {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
      '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />'
    );
    html = html.replace(
      /<meta\s+name="googlebot"\s+content=".*?"\s*\/?>/i,
      '<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />'
    );
    html = html.replace(
      /<meta\s+name="bingbot"\s+content=".*?"\s*\/?>/i,
      '<meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet" />'
    );
  }

  // 7. Inject Breadcrumbs JSON-LD if subpage
  if (page.id !== 'home' && page.id !== 'notFound') {
    const pageConfig = SITE_CONFIG.pages[page.id as PublicPageId];
    if (pageConfig) {
      const breadcrumbJson = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
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
            name: pageConfig.navLabel,
            item: fullCanonicalUrl,
          },
        ],
      });
      const breadcrumbScript = `<script type="application/ld+json" id="schema-breadcrumbs">${breadcrumbJson}</script>`;
      html = html.replace('</head>', `  ${breadcrumbScript}\n  </head>`);
    }
  }

  // 8. Inject Semantic Content inside <div id="root">
  const pageNavActive = (id: string) =>
    page.id === id
      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
      : 'text-stone-300 hover:text-white';

  const prerenderedRootHtml = `
    <div class="min-h-screen bg-[#030705] text-stone-100 flex flex-col selection:bg-emerald-400/25 selection:text-emerald-200 relative overflow-x-hidden">
      <!-- Top Public Header -->
      <header class="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-stone-950/90 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <a href="/" class="flex items-center gap-2.5 group cursor-pointer" aria-label="Speak in Progress Home">
            <span class="text-base sm:text-lg font-extrabold tracking-tight text-white font-brand">
              Speak in Progress
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-stone-400 bg-white/[0.03] hidden lg:inline">
              CREATOR STUDIO
            </span>
          </a>
          <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-1.5 bg-stone-900/60 p-1 rounded-xl border border-white/5 text-xs font-mono">
            <a href="/" class="px-3 py-1.5 rounded-lg ${pageNavActive('home')}">Home</a>
            <a href="/features" class="px-3 py-1.5 rounded-lg ${pageNavActive('features')}">Features</a>
            <a href="/how-it-works" class="px-3 py-1.5 rounded-lg ${pageNavActive('howItWorks')}">How It Works</a>
            <a href="/about" class="px-3 py-1.5 rounded-lg ${pageNavActive('about')}">About</a>
            <a href="/faq" class="px-3 py-1.5 rounded-lg ${pageNavActive('faq')}">FAQ</a>
          </nav>
          <div class="flex items-center gap-3">
            <a href="/" class="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-400 text-stone-950 flex items-center gap-1.5">
              <span>Sign In</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Semantic Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        ${page.bodyHtml}
      </main>

      <!-- Footer -->
      <footer class="border-t border-white/[0.08] bg-stone-950/95 py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-400 mt-16">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Speak in Progress · Founded by <strong>Md. Selim</strong> · <a href="mailto:support@mdselim.com" class="text-emerald-400 underline">support@mdselim.com</a>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a href="/" class="hover:text-emerald-400">Home</a>
            <span>·</span>
            <a href="/features" class="hover:text-emerald-400">Features</a>
            <span>·</span>
            <a href="/how-it-works" class="hover:text-emerald-400">How It Works</a>
            <span>·</span>
            <a href="/about" class="hover:text-emerald-400">About</a>
            <span>·</span>
            <a href="/faq" class="hover:text-emerald-400">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  `;

  html = html.replace(
    /<div\s+id="root">[\s\S]*?<\/div>/i,
    `<div id="root">${prerenderedRootHtml}</div>`
  );

  return html;
}

export function prerenderAll() {
  const masterTemplatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(masterTemplatePath)) {
    console.error('Error: dist/index.html not found. Run "vite build" first.');
    process.exit(1);
  }

  const masterTemplate = fs.readFileSync(masterTemplatePath, 'utf8');

  console.log('⚡ Starting Static Prerendering for SEO and Cloudflare Pages...');

  for (const page of PUBLIC_PAGES) {
    const renderedHtml = generatePageHtml(masterTemplate, page);

    if (page.id === 'home') {
      fs.writeFileSync(masterTemplatePath, renderedHtml, 'utf8');
      console.log('  ✓ Prerendered: / (dist/index.html)');
    } else if (page.id === 'notFound') {
      const outPath = path.join(DIST_DIR, '404.html');
      fs.writeFileSync(outPath, renderedHtml, 'utf8');
      console.log('  ✓ Prerendered: 404 (dist/404.html)');
    } else {
      // Create nested route folder e.g. dist/features/index.html AND dist/features.html
      const dirPath = path.join(DIST_DIR, page.id === 'howItWorks' ? 'how-it-works' : page.id);
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(path.join(dirPath, 'index.html'), renderedHtml, 'utf8');

      // Also create direct .html file for hosts supporting direct clean files
      const cleanHtmlPath = path.join(
        DIST_DIR,
        `${page.id === 'howItWorks' ? 'how-it-works' : page.id}.html`
      );
      fs.writeFileSync(cleanHtmlPath, renderedHtml, 'utf8');

      console.log(`  ✓ Prerendered: ${page.path} (${dirPath}/index.html & ${cleanHtmlPath})`);
    }
  }

  console.log('✨ All public pages successfully prerendered with full semantic HTML & metadata!');
}

if (process.argv[1]?.endsWith('prerender.ts')) {
  prerenderAll();
}
