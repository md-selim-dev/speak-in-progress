/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SITE_CONFIG, PublicPageId } from '../config/site';

export type PageRouteId = PublicPageId | 'notFound';

/**
 * Updates document head metadata dynamically for public pages, private workspace, and 404 states.
 */
export function updatePageSEO(pageId: PageRouteId, isPrivateWorkspace: boolean = false) {
  if (typeof document === 'undefined') return;

  const robotsMeta = document.querySelector('meta[name="robots"]');
  const googlebotMeta = document.querySelector('meta[name="googlebot"]');
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  const descMeta = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  const twDesc = document.querySelector('meta[name="twitter:description"]');

  if (isPrivateWorkspace) {
    // Strictly protect private creator studio from search indexing
    document.title = 'Speak in Progress · Creator Workspace (Private)';
    robotsMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    googlebotMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    return;
  }

  if (pageId === 'notFound') {
    // Strictly instruct search engine crawlers not to index 404 routes (prevents soft-404 penalty)
    document.title = 'Page Not Found (404) — Speak in Progress';
    descMeta?.setAttribute(
      'content',
      'The requested page could not be found. Return to the Speak in Progress home page.'
    );
    robotsMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    googlebotMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
    const existingScript = document.getElementById('schema-breadcrumbs');
    if (existingScript) existingScript.remove();
    return;
  }

  // Public Page SEO
  const page = SITE_CONFIG.pages[pageId] || SITE_CONFIG.pages.home;
  const fullUrl = `${SITE_CONFIG.domain}${page.path === '/' ? '' : page.path}`;

  document.title = page.title;
  descMeta?.setAttribute('content', page.description);

  robotsMeta?.setAttribute(
    'content',
    'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );
  googlebotMeta?.setAttribute(
    'content',
    'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );

  canonicalLink?.setAttribute('href', fullUrl);
  ogTitle?.setAttribute('content', page.title);
  ogDesc?.setAttribute('content', page.description);
  ogUrl?.setAttribute('content', fullUrl);
  twTitle?.setAttribute('content', page.title);
  twDesc?.setAttribute('content', page.description);

  // Update BreadcrumbList structured data for subpages
  updateBreadcrumbSchema(pageId);
}

/**
 * Dynamically inserts or updates Schema.org BreadcrumbList for rich results
 */
function updateBreadcrumbSchema(pageId: PublicPageId) {
  const existingScript = document.getElementById('schema-breadcrumbs');
  if (pageId === 'home') {
    if (existingScript) existingScript.remove();
    return;
  }

  const page = SITE_CONFIG.pages[pageId];
  if (!page) return;

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${SITE_CONFIG.domain}/`,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': page.navLabel,
        'item': `${SITE_CONFIG.domain}${page.path}`,
      },
    ],
  };

  let scriptEl = existingScript as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-breadcrumbs';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(breadcrumbData);
}
