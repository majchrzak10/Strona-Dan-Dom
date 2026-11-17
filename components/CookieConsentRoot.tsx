"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import GaRouteTracker from "@/components/analytics/GaRouteTracker";
import { configureGoogleTag, denyConsent, grantConsent, trackEvent } from "@/lib/client/analytics";
import { CONSENT_STORAGE_KEY as STORAGE_KEY, CONSENT_STORAGE_VERSION as STORAGE_VERSION } from "@/lib/consentMode";

/** Publiczny identyfikator Google Ads (konwersje). Zgoda: Consent Mode v2, patrz `lib/consentMode.ts`. */
const GOOGLE_ADS_MEASUREMENT_ID = "AW-18073325436";

type ConsentState = "loading" | "pending" | "analytics" | "essential";

type Stored = { v: number; analytics: boolean };

function readStored(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed?.v !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(analytics: boolean) {
  const data: Stored = { v: STORAGE_VERSION, analytics };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * GA4 + tag Google Ads w Consent Mode v2 (tryb zaawansowany): tagi ładują się zawsze,
 * domyślnie bez zgody (bez cookies). Baner tylko aktualizuje zgodę.
 */
export default function CookieConsentRoot({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<ConsentState>("loading");

  const needsConsentBanner = Boolean(gaId) || Boolean(GOOGLE_ADS_MEASUREMENT_ID);

  useEffect(() => {
    const stored = readStored();
    if (stored === null) {
      setConsent("pending");
    } else {
      setConsent(stored.analytics ? "analytics" : "essential");
    }
  }, []);

  const acceptAnalytics = useCallback(() => {
    writeStored(true);
    grantConsent();
    setConsent("analytics");
    trackEvent("cookie_consent_update", { analytics_storage: "granted" });
  }, []);

  const essentialOnly = useCallback(() => {
    writeStored(false);
    denyConsent();
    setConsent("essential");
  }, []);

  useLayoutEffect(() => {
    if (gaId) configureGoogleTag(gaId);
    configureGoogleTag(GOOGLE_ADS_MEASUREMENT_ID);
  }, [gaId]);

  /** Kliknięcia tel:/mailto: — liczone zawsze; bez zgody Google dostaje sygnał bez cookies. */
  useEffect(() => {

    const onClick = (evt: MouseEvent) => {
      const target = evt.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        trackEvent("click_phone", {
          method: "tel",
          destination: href.replace(/^tel:/, ""),
          link_text: anchor.textContent?.trim() ?? "",
        });
      } else if (href.startsWith("mailto:")) {
        trackEvent("click_email", {
          method: "mailto",
          destination: href.replace(/^mailto:/, ""),
          link_text: anchor.textContent?.trim() ?? "",
        });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!needsConsentBanner) {
    return null;
  }

  if (consent === "loading") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId ?? GOOGLE_ADS_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {gaId ? <GaRouteTracker gaId={gaId} /> : null}
      {consent === "pending" ? (
        <div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          className="fixed bottom-0 left-0 right-0 z-[120] border-t border-zinc-200/90 bg-white/95 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm sm:px-6 lg:px-10 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-700">
              <p id="cookie-consent-title" className="font-semibold text-zinc-900">
                Pliki cookies, analityka i pomiar reklam
              </p>
              <p className="mt-1.5">
                Po akceptacji używamy cookies Google Analytics 4 oraz tagu Google Ads (pomiar konwersji),
                aby lepiej rozumieć ruch w serwisie i skuteczność działań marketingowych. Jeśli wybierzesz
                tylko niezbędne, nie zapisujemy cookies analitycznych ani reklamowych — Google otrzymuje
                wtedy wyłącznie anonimowe sygnały bez plików cookies (tryb zgody Google).{" "}
                <Link
                  href="/polityka-prywatnosci/"
                  className="font-medium text-burgundy underline decoration-burgundy/30 underline-offset-2 hover:decoration-burgundy"
                >
                  Polityka prywatności
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={essentialOnly}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                Tylko niezbędne
              </button>
              <button
                type="button"
                onClick={acceptAnalytics}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
              >
                Akceptuję analitykę i pomiar reklam
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
