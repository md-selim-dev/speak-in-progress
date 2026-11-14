/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { SITE_CONFIG, PublicPageId } from '../src/config/site';
import {
  PUBLIC_FAQ_ITEMS,
  WORKFLOW_STEPS,
  STUDIO_MODULES,
  PACING_CALIBRATION_TABLE,
  getRouteStructuredData,
} from '../src/config/seoSchemas';

const DIST_DIR = path.resolve('dist');

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface PagePrerenderMeta {
  id: PublicPageId | 'notFound';
  path: string;
  title: string;
  description: string;
  isIndexable: boolean;
  bodyHtml: string;
}

const PUBLIC_PAGES: PagePrerenderMeta[] = [
  {
    id: 'home',
    path: '/',
    title: SITE_CONFIG.pages.home.title,
    description: SITE_CONFIG.pages.home.description,
    isIndexable: true,
    bodyHtml: `
      <section class="text-center max-w-4xl mx-auto space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
          <span>Faceless Screen-Recording Studio · PC &amp; OBS Ready</span>
        </div>
        <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Documenting Real English Fluency, <span class="text-emerald-400">One Authentic Day at a Time.</span>
        </h1>
        <p class="speakable-summary text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
          ${escapeHtml(SITE_CONFIG.pages.home.description)}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="/features" class="px-6 py-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
            Explore 4 Studio Modules
          </a>
          <a href="/how-it-works" class="px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 text-xs font-bold uppercase tracking-wider">
            5-Step Daily Routine
          </a>
          <a href="/about" class="px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 text-xs font-bold uppercase tracking-wider">
            About Methodology
          </a>
          <a href="/faq" class="px-6 py-3 rounded-xl bg-stone-900 border border-white/10 text-stone-200 text-xs font-bold uppercase tracking-wider">
            Methodology FAQ
          </a>
        </div>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Four Integrated Studios Built for Spoken English</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${STUDIO_MODULES.map(
            (mod) => `
          <article class="p-6 rounded-2xl bg-stone-950/80 border border-white/5 space-y-3">
            <h3 class="text-lg font-bold text-emerald-400">0${mod.position} · ${escapeHtml(mod.name)}</h3>
            <p class="text-xs sm:text-sm text-stone-300">${escapeHtml(mod.description)}</p>
          </article>`
          ).join('')}
        </div>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">The Cognitive Cadence Method</h2>
        <p class="speakable-methodology text-sm sm:text-base text-stone-300 leading-relaxed">
          Speak in Progress pairs calibrated teleprompter pacing (130–160 words per minute) with an immediate 90-second unscripted recall challenge and faceless PC screen recording to eliminate speaking hesitation and build active neural retrieval.
        </p>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">The 5-Step Daily Studio Workflow</h2>
        <ol class="space-y-4 text-xs sm:text-sm text-stone-300 list-decimal list-inside">
          ${WORKFLOW_STEPS.map(
            (step) =>
              `<li><strong>${escapeHtml(step.name)}</strong> — ${escapeHtml(step.text)}</li>`
          ).join('')}
        </ol>
      </section>

      <section class="p-8 sm:p-12 rounded-3xl bg-stone-900/60 border border-white/10 space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${PUBLIC_FAQ_ITEMS.slice(0, 4)
            .map(
              (item) => `
          <article class="p-5 rounded-2xl bg-stone-950/80 border border-white/5 space-y-2">
            <h3 class="text-sm font-bold text-white">${escapeHtml(item.q)}</h3>
            <p class="speakable-faq text-xs text-stone-300 leading-relaxed">${escapeHtml(item.a)}</p>
          </article>`
            )
            .join('')}
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
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Integrated Creator Suite</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Everything Needed for YouTube Spoken Practice
        </h1>
        <p class="speakable-summary text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Four purpose-built studios working seamlessly inside a single high-performance workspace. Designed strictly around real, existing features for authentic PC screen recording.
        </p>
      </section>

      <div class="space-y-8">
        ${STUDIO_MODULES.map(
          (mod) => `
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Module 0${mod.position}: ${escapeHtml(mod.name)}</h2>
          <p class="speakable-feature text-sm text-stone-300 leading-relaxed">${escapeHtml(mod.description)}</p>
        </article>`
        ).join('')}
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
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Daily Workflow Blueprint</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Speak in Progress Works
        </h1>
        <p class="speakable-summary text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          A disciplined, 5-phase daily spoken workout that pairs teleprompter-guided reading with active recall and high-impact YouTube video packaging.
        </p>
      </section>

      <section class="space-y-6">
        ${WORKFLOW_STEPS.map(
          (step) => `
        <article id="step-${step.position}" class="p-6 sm:p-8 rounded-2xl bg-stone-900/60 border border-white/10 space-y-3">
          <div class="text-xs font-mono font-bold text-emerald-400 uppercase">${escapeHtml(step.subtitle)}</div>
          <h2 class="text-xl font-bold text-white">Step ${step.position}: ${escapeHtml(step.name)}</h2>
          <p class="speakable-step text-xs sm:text-sm text-stone-300 leading-relaxed">${escapeHtml(step.text)}</p>
        </article>`
        ).join('')}
      </section>

      <section class="p-6 sm:p-10 rounded-3xl bg-stone-900/80 border border-white/10 space-y-6">
        <h2 class="text-xl sm:text-2xl font-extrabold text-white">Teleprompter Speed vs. Spoken Cadence</h2>
        <div class="overflow-x-auto">
          <table aria-label="Teleprompter Scroll Speed and Spoken Cadence Calibration by CEFR Level" class="w-full text-left text-xs sm:text-sm text-stone-300 border-collapse">
            <thead>
              <tr class="border-b border-white/10 text-stone-400 text-[11px] uppercase">
                <th scope="col" class="py-3 px-4">Level</th>
                <th scope="col" class="py-3 px-4">Prompter Scroll Speed</th>
                <th scope="col" class="py-3 px-4">Target WPM</th>
                <th scope="col" class="py-3 px-4">Recommended Tone &amp; Focus</th>
              </tr>
            </thead>
            <tbody>
              ${PACING_CALIBRATION_TABLE.map(
                (row) => `
              <tr class="border-b border-white/5">
                <td class="py-3 px-4 font-semibold text-white">${escapeHtml(row.level)}</td>
                <td class="py-3 px-4 font-mono text-emerald-400">${escapeHtml(row.scrollSpeed)}</td>
                <td class="py-3 px-4 font-mono">${escapeHtml(row.wpm)}</td>
                <td class="py-3 px-4 text-stone-400">${escapeHtml(row.focus)}</td>
              </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      </section>

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
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Origin &amp; Methodology</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About Speak in Progress
        </h1>
        <p class="speakable-summary text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Built by Md. Selim to solve the real friction of mastering spoken English fluency through daily faceless YouTube screen recordings and structured cadence training.
        </p>
      </section>

      <div class="space-y-6">
        <article class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">Fluency as an Engineering Discipline</h2>
          <p class="text-sm text-stone-300 leading-relaxed">
            For non-native English speakers, the bottleneck to spoken fluency is motor-articulatory speed and unprompted cognitive retrieval under time pressure. Speak in Progress removes camera anxiety by pairing a calibrated desktop prompter with PC screen recording and 90-second unscripted recall tests.
          </p>
          <dl class="speakable-definition grid sm:grid-cols-2 gap-4 pt-2 text-xs text-stone-300">
            <div class="p-4 rounded-xl bg-stone-950/70 border border-white/5">
              <dt class="font-bold text-emerald-400">Cognitive Cadence Method</dt>
              <dd class="mt-1">Four learning feedback loops: subvocal alignment at 130–160 WPM, 90-second spontaneous recall, YouTube output accountability, and integrated studio asset packaging.</dd>
            </div>
            <div class="p-4 rounded-xl bg-stone-950/70 border border-white/5">
              <dt class="font-bold text-emerald-400">Creator &amp; Official Channel</dt>
              <dd class="mt-1">Founded by <strong>Md. Selim</strong>. Watch authentic practice sessions on YouTube: <a href="${SITE_CONFIG.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="text-red-400 underline font-semibold">@SpeakInProgress</a>.</dd>
            </div>
          </dl>
        </article>

        <section class="p-8 rounded-3xl bg-stone-900/60 border border-white/10 space-y-4">
          <h2 class="text-2xl font-bold text-white">The 4 Principles of Cognitive Cadence</h2>
          <p class="speakable-methodology text-sm text-stone-300">
            Four interconnected learning feedback loops built directly into the software: 01. Subvocal Alignment (130–160 WPM), 02. 90s Spontaneous Recall, 03. Visual Accountability on YouTube, and 04. Zero Asset Delay via 2K thumbnail and intro generation.
          </p>
        </section>
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
    bodyHtml: `
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/30">
          <span>Knowledge Base</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p class="speakable-summary text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Clear, factual answers regarding the teleprompter studio, the Cognitive Cadence Method, faceless YouTube workflow, and technical architecture.
        </p>
      </section>

      <div class="max-w-3xl mx-auto space-y-4">
        ${PUBLIC_FAQ_ITEMS.map(
          (item) => `
        <article class="p-6 rounded-2xl bg-stone-900/60 border border-white/10 space-y-2">
          <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">${escapeHtml(item.category)}</span>
          <h2 class="text-lg font-bold text-white">${escapeHtml(item.q)}</h2>
          <p class="speakable-faq text-xs sm:text-sm text-stone-300 leading-relaxed">${escapeHtml(item.a)}</p>
        </article>`
        ).join('')}
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
      ? ''
      : `${SITE_CONFIG.domain}${page.path === '/' ? '/' : page.path}`;

  // 1. Update Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);

  // 2. Update Meta Description
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(page.description)}" />`
  );

  // 3. Update or Remove Canonical URL (no canonical on 404 pages)
  if (page.isIndexable && fullCanonicalUrl) {
    html = html.replace(
      /<link\s+rel="canonical"\s+id="canonical-url"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" id="canonical-url" href="${fullCanonicalUrl}" />`
    );
  } else {
    html = html.replace(/<link\s+rel="canonical"\s+id="canonical-url"\s+href=".*?"\s*\/?>\s*/i, '');
  }

  // 4. Update OpenGraph Tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`
  );
  if (fullCanonicalUrl) {
    html = html.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${fullCanonicalUrl}" />`
    );
  }

  // 5. Update Twitter Card Tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`
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

  // 7. Replace #schema-page with route-specific Schema.org JSON-LD (or strip cleanly on 404)
  const routeSchema = getRouteStructuredData(page.id, !page.isIndexable);
  const schemaScriptBlock = routeSchema
    ? `<script type="application/ld+json" id="schema-page">${JSON.stringify(routeSchema)}</script>`
    : '';
  html = html.replace(
    /<script\s+type="application\/ld\+json"\s+id="schema-page">[\s\S]*?<\/script>/i,
    schemaScriptBlock
  );

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
            © 2026 Speak in Progress · Founded by <strong>Md. Selim</strong> · <a href="${SITE_CONFIG.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300">YouTube @SpeakInProgress</a>
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

  console.log('⚡ Starting Static Prerendering for SEO, AEO & GEO...');

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
      const slug = page.id === 'howItWorks' ? 'how-it-works' : page.id;
      const dirPath = path.join(DIST_DIR, slug);
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(path.join(dirPath, 'index.html'), renderedHtml, 'utf8');

      const cleanHtmlPath = path.join(DIST_DIR, `${slug}.html`);
      fs.writeFileSync(cleanHtmlPath, renderedHtml, 'utf8');

      console.log(`  ✓ Prerendered: ${page.path} (${dirPath}/index.html & ${cleanHtmlPath})`);
    }
  }

  console.log('✨ All public pages successfully prerendered with route-specific JSON-LD & AEO content!');
}

if (process.argv[1]?.endsWith('prerender.ts')) {
  prerenderAll();
}
