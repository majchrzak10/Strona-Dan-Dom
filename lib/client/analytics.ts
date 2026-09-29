"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

let configuredId: string | null = null;

function installGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag() {
    // gtag.js only processes an Arguments object, not a rest-parameter array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
}

/** GA4 after cookie consent. Explicit grant — without it EEA hits stay non-consented. */
export function ensureGa4(measurementId: string): void {
  if (typeof window === "undefined") return;
  if (configuredId === measurementId) return;
  configuredId = measurementId;
  installGtagStub();
  window.gtag?.("consent", "update", { analytics_storage: "granted" });
  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId);
}

export function trackEvent(name: string, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
