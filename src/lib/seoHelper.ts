/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SITE_CONFIG, PublicPageId } from '../config/site';
import { getRouteStructuredData } from '../config/seoSchemas';

export type PageRouteId = PublicPageId | 'notFound';

/**
 * Ensures a <meta> tag exists in document.head and updates its content attribute.
 */
function upsertMeta(selector: string, attrName: 'name' | 'property', attrVal: string, content: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Updates or removes the route-specific Schema.org JSON-LD script element (#schema-page).
 */
function syncRouteSchema(pageId: PageRouteId, isPrivateWorkspace: boolean) {
  const existingPageSchema = document.getElementById('schema-page');
  const legacyBreadcrumbSchema = document.getElementById('schema-breadcrumbs');
  if (legacyBreadcrumbSchema) legacyBreadcrumbSchema.remove();

  const schemaData = getRouteStructuredData(pageId, isPrivateWorkspace);
  if (!schemaData) {
    if (existingPageSchema) existingPageSchema.remove();
    return;
  }

  let scriptEl = existingPageSchema as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-page';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaData);
}

/**
 * Updates document head metadata dynamically for public pages, private workspace, and 404 states.
 */
export function updatePageSEO(pageId: PageRouteId, isPrivateWorkspace: boolean = false) {
  if (typeof document === 'undefined') return;

  const robotsNoIndex = 'noindex, nofollow, noarchive, nosnippet';
  const robotsIndex = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  const canonicalLink = document.querySelector('link[rel="canonical"]') || document.getElementById('canonical-url');

  if (isPrivateWorkspace) {
    // Strictly protect private creator studio from search & AI indexing
    document.title = 'Speak in Progress · Creator Workspace (Private)';
    upsertMeta('meta[name="robots"]', 'name', 'robots', robotsNoIndex);
    upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', robotsNoIndex);
    upsertMeta('meta[name="bingbot"]', 'name', 'bingbot', robotsNoIndex);
    upsertMeta(
      'meta[name="description"]',
      'name',
      'description',
      'Private authenticated creator workspace.'
    );
    // Do not advertise public canonical or public JSON-LD inside authenticated studio
    if (canonicalLink) canonicalLink.remove();
    syncRouteSchema('notFound', true);
    return;
  }

  if (pageId === 'notFound') {
    // Strictly instruct search engine crawlers not to index 404 routes (prevents soft-404 penalty)
    document.title = 'Page Not Found (404) — Speak in Progress';
    upsertMeta(
      'meta[name="description"]',
      'name',
      'description',
      'The requested page could not be found. Return to the Speak in Progress home page.'
    );
    upsertMeta('meta[name="robots"]', 'name', 'robots', robotsNoIndex);
    upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', robotsNoIndex);
    upsertMeta('meta[name="bingbot"]', 'name', 'bingbot', robotsNoIndex);
    if (canonicalLink) canonicalLink.remove();
    syncRouteSchema('notFound', false);
    return;
  }

  // Public Page SEO / AEO / GEO
  const page = SITE_CONFIG.pages[pageId] || SITE_CONFIG.pages.home;
  const fullUrl = page.path === '/' ? `${SITE_CONFIG.domain}/` : `${SITE_CONFIG.domain}${page.path}`;

  document.title = page.title;
  upsertMeta('meta[name="description"]', 'name', 'description', page.description);
  upsertMeta('meta[name="robots"]', 'name', 'robots', robotsIndex);
  upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', robotsIndex);
  upsertMeta('meta[name="bingbot"]', 'name', 'bingbot', robotsIndex);

  let canonEl = canonicalLink as HTMLLinkElement | null;
  if (!canonEl) {
    canonEl = document.createElement('link');
    canonEl.rel = 'canonical';
    canonEl.id = 'canonical-url';
    document.head.appendChild(canonEl);
  }
  canonEl.href = fullUrl;

  upsertMeta('meta[property="og:title"]', 'property', 'og:title', page.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', page.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', page.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', page.description);

  syncRouteSchema(pageId, false);
}
