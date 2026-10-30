/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Centralized Site and SEO Configuration for Speak in Progress.
 * Changing the primary domain here updates all canonical references,
 * structured data endpoints, and meta generation across the application.
 */
export const SITE_CONFIG = {
  name: 'Speak in Progress',
  shortName: 'SpeakInProgress',
  tagline: 'Documenting Real English Fluency, One Authentic Day at a Time.',
  // Centralized official primary domain
  domain: 'https://speak-in-progress.pages.dev',
  locale: 'en_US',
  themeColor: '#030705',
  
  // Creator & Contact Information (100% factually accurate)
  creator: {
    name: 'Md. Selim',
    email: 'support@mdselim.com',
    role: 'Founder & Creator',
  },
  supportEmail: 'support@mdselim.com',

  // Social & Asset paths (relative to domain)
  assets: {
    ogImage: '/og-image.png',
    ogImageAlt: 'Speak in Progress — Spoken English Fluency & Recording Studio Preview',
    ogWidth: 1200,
    ogHeight: 630,
    faviconSvg: '/favicon.svg',
    faviconPng: '/favicon-32x32.png',
    appleTouchIcon: '/apple-touch-icon.png',
  },

  // Public Pages Configuration
  pages: {
    home: {
      id: 'home',
      path: '/',
      navLabel: 'Home',
      title: 'Speak in Progress — Spoken English Fluency & Recording Studio',
      description:
        'Master real-world English fluency through deliberate practice, calibrated teleprompter pacing, unscripted memory retelling, and PC screen-recording.',
    },
    features: {
      id: 'features',
      path: '/features',
      navLabel: 'Features',
      title: 'Studio Features — Speak in Progress',
      description:
        'Explore the 4 integrated studios: Calibrated Teleprompter, Cognitive Fluency Methodology, 16:9 Thumbnail Studio, and Video Intro Suite.',
    },
    howItWorks: {
      id: 'how-it-works',
      path: '/how-it-works',
      navLabel: 'How It Works',
      title: '5-Step Daily Workflow — Speak in Progress',
      description:
        'A structured 5-step daily routine for recording authentic faceless YouTube practice sessions with calibrated prompter pacing and 90s unscripted recall.',
    },
    about: {
      id: 'about',
      path: '/about',
      navLabel: 'About',
      title: 'About the Journey & Methodology — Speak in Progress',
      description:
        'The philosophy behind Speak in Progress: overcoming speaking anxiety, normalizing stumbles, and deliberate daily practice via PC screen recording.',
    },
    faq: {
      id: 'faq',
      path: '/faq',
      navLabel: 'FAQ',
      title: 'Frequently Asked Questions — Speak in Progress',
      description:
        'Answers about the Cognitive Cadence Method, faceless PC recording, teleprompter pacing, data privacy, and YouTube fluency documentation.',
    },
  },
} as const;

export type PublicPageId = keyof typeof SITE_CONFIG.pages;
