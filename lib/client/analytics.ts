"use client";

import { CONSENT_DENIED, CONSENT_GRANTED } from "@/lib/consentMode";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

const configuredIds = new Set<string>();

function installGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag() {
    // gtag.js only processes an Arguments object, not a rest-parameter array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
}

/**
 * Configures a Google tag (GA4 `G-…` or Google Ads `AW-…`).
 * Consent is handled separately (Consent Mode v2 default in `app/layout.tsx`).
 */
export function configureGoogleTag(id: string): void {
  if (typeof window === "undefined") return;
  if (configuredIds.has(id)) return;
  installGtagStub();
  if (configuredIds.size === 0) window.gtag?.("js", new Date());
  configuredIds.add(id);
  window.gtag?.("config", id);
}

/** User accepted analytics + ad measurement in the cookie banner. */
export function grantConsent(): void {
  if (typeof window === "undefined") return;
  installGtagStub();
  window.gtag?.("consent", "update", CONSENT_GRANTED);
}

/** User chose "essential only" — keep everything denied (cookieless pings only). */
export function denyConsent(): void {
  if (typeof window === "undefined") return;
  installGtagStub();
  window.gtag?.("consent", "update", CONSENT_DENIED);
}

export function trackEvent(name: string, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
