/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandIdentity } from './types';
import { BRAND_PRESETS } from './data/brandPresets';
import { Header } from './components/Header';
import { BrandIdentityView } from './components/BrandIdentityView';
import { ToneGuidelinesView } from './components/ToneGuidelinesView';
import { ChannelMockupView } from './components/ChannelMockupView';
import { TeleprompterStudioView } from './components/TeleprompterStudioView';
import { ExportKitView } from './components/ExportKitModal';
import { LandingPage } from './components/LandingPage';
import { User } from 'firebase/auth';
import { onAuthUserChanged, signInWithGoogle, signOutUser } from './lib/firebase';
import { isAuthorizedOwner, OWNER_EMAIL } from './lib/authConfig';
import { LogoMark } from './components/LogoMark';

export default function App() {
  const [activeBrand, setActiveBrand] = useState<BrandIdentity>(() => {
    try {
      const saved = localStorage.getItem('speak_in_progress_brand_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = BRAND_PRESETS.find((p) => p.id === parsed.id);
        if (match) return match;
      }
    } catch {
      // ignore
    }
    return BRAND_PRESETS[0]; // Speak in Progress (Emerald Spark Flagship)
  });

  const [activeTab, setActiveTab] = useState<
    'teleprompter' | 'identity' | 'tone' | 'channel' | 'export'
  >('teleprompter');
  
  // Authentication & Authorization state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [inStudio, setInStudio] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('speak_in_progress_in_studio') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthUserChanged((user) => {
      setIsAuthLoading(false);
      if (user) {
        if (isAuthorizedOwner(user.email)) {
          setCurrentUser(user);
          setUnauthorizedEmail(null);
          setLoginError(null);
        } else {
          // If non-owner email logs in, reject access and sign out
          setUnauthorizedEmail(user.email || 'unknown account');
          setCurrentUser(null);
          setInStudio(false);
          sessionStorage.removeItem('speak_in_progress_in_studio');
          signOutUser().catch(() => {});
        }
      } else {
        setCurrentUser(null);
        setInStudio(false);
        sessionStorage.removeItem('speak_in_progress_in_studio');
      }
    });

    return () => unsubscribe();
  }, []);

  const isAuthorized = !!(currentUser && isAuthorizedOwner(currentUser.email));

  // Strict SEO Indexing Policy:
  // Public facing landing page is indexed (index, follow).
  // Once the creator enters the private studio workspace, dynamically set 'noindex, nofollow, noarchive'
  // to guarantee internal recordings, stumble notes, and teleprompter drafts are never indexed by Google.
  useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const googlebotMeta = document.querySelector('meta[name="googlebot"]');
    const canonicalLink = document.querySelector('link[rel="canonical"]');

    if (canonicalLink && typeof window !== 'undefined' && window.location) {
      canonicalLink.setAttribute('href', window.location.origin + window.location.pathname);
    }

    if (isAuthorized && inStudio) {
      robotsMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      googlebotMeta?.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      document.title = 'Speak in Progress · Creator Workspace (Private)';
    } else {
      robotsMeta?.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      googlebotMeta?.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      document.title = 'Speak in Progress — Spoken English Fluency & Recording Studio';
    }
  }, [isAuthorized, inStudio]);

  const handleBrandChange = (newBrand: BrandIdentity) => {
    setActiveBrand(newBrand);
    try {
      localStorage.setItem('speak_in_progress_brand_v4', JSON.stringify(newBrand));
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickRecord = () => {
    setActiveTab('teleprompter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterStudio = () => {
    setInStudio(true);
    try {
      sessionStorage.setItem('speak_in_progress_in_studio', 'true');
    } catch {}
  };

  const handleOwnerLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    setUnauthorizedEmail(null);
    setUnauthorizedDomain(null);

    try {
      const user = await signInWithGoogle();
      if (!user) {
        // User closed the popup, cancel gracefully
        return;
      }

      if (isAuthorizedOwner(user.email)) {
        setCurrentUser(user);
        setInStudio(true);
        sessionStorage.setItem('speak_in_progress_in_studio', 'true');
      } else {
        // Unauthorized user: show polite restricted dialog and sign out
        setUnauthorizedEmail(user.email || 'unknown');
        setCurrentUser(null);
        setInStudio(false);
        sessionStorage.removeItem('speak_in_progress_in_studio');
        await signOutUser();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const isDomainError =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain') ||
        err?.message?.includes('authorized domain');

      if (isDomainError) {
        const currentDomain =
          typeof window !== 'undefined' && window.location.hostname
            ? window.location.hostname
            : 'speak-in-progress.netlify.app';
        setUnauthorizedDomain(currentDomain);
        setLoginError(
          `Domain "${currentDomain}" is not yet authorized in Firebase Auth. Add it to Authorized Domains in Firebase Console to enable login.`
        );
      } else {
        setLoginError(err.message || 'Unable to sign in. Please verify your internet connection.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setInStudio(false);
      sessionStorage.removeItem('speak_in_progress_in_studio');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // If initial auth check is loading, show quiet obsidian splash
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#030705] flex flex-col items-center justify-center space-y-4">
        <LogoMark brand={activeBrand} size="sm" layout="icon-only" isAnimated={true} />
        <span className="text-xs font-mono text-stone-400 animate-pulse tracking-widest uppercase">
          Initializing Studio...
        </span>
      </div>
    );
  }

  // Display public landing page if not authenticated OR if not currently inside studio
  if (!isAuthorized || !inStudio) {
    return (
      <LandingPage
        activeBrand={activeBrand}
        isAuthenticated={isAuthorized}
        onEnterStudio={handleEnterStudio}
        onLogin={handleOwnerLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
        unauthorizedEmail={unauthorizedEmail}
        onDismissUnauthorized={() => setUnauthorizedEmail(null)}
        onSwitchAccount={handleOwnerLogin}
        unauthorizedDomain={unauthorizedDomain}
        onDismissDomainError={() => setUnauthorizedDomain(null)}
      />
    );
  }

  // --- Authorized Owner Studio Workspace ---
  return (
    <div
      className="min-h-screen flex flex-col text-stone-100 transition-colors duration-700 relative overflow-x-hidden selection:bg-emerald-400/25 selection:text-emerald-200"
      style={{ backgroundColor: activeBrand.colors.primary.hex }}
    >
      {/* Ambient background glow orb with smooth floating animation */}
      <div
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-1000 -z-10"
        style={{ backgroundColor: activeBrand.colors.accent.hex }}
      />

      {/* Top Bar Navigation (Strict 3-zone contract with Owner Sign Out) */}
      <Header
        activeBrand={activeBrand}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickRecord={handleQuickRecord}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content View with transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'teleprompter' && (
          <div className="animate-fade-in">
            <TeleprompterStudioView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="animate-fade-in">
            <BrandIdentityView
              activeBrand={activeBrand}
              setActiveBrand={handleBrandChange}
              onNavigateToTeleprompter={handleQuickRecord}
            />
          </div>
        )}

        {activeTab === 'tone' && (
          <div className="animate-fade-in">
            <ToneGuidelinesView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'channel' && (
          <div className="animate-fade-in">
            <ChannelMockupView activeBrand={activeBrand} />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="animate-fade-in">
            <ExportKitView activeBrand={activeBrand} />
          </div>
        )}
      </main>

      {/* Quiet, Human Editorial Footer */}
      <footer className="border-t border-white/[0.08] bg-stone-950/90 py-8 px-6 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: activeBrand.colors.accent.hex,
                boxShadow: `0 0 10px ${activeBrand.colors.accent.hex}`,
              }}
            />
            <span className="font-bold text-stone-200 font-brand">Speak in Progress</span>
            <span className="text-stone-600">·</span>
            <span>Spoken English Journey & Studio</span>
          </div>

          <div className="text-stone-400 text-center sm:text-right">
            Progress, not perfection · Built for PC screen recording & public storytelling
          </div>
        </div>
      </footer>
    </div>
  );
}
