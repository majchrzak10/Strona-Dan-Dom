/**
 * Google Consent Mode v2 (tryb zaawansowany).
 *
 * Tagi Google (GA4 + Google Ads) ładują się zawsze, ale startują z odmową zgody.
 * - Bez zgody: brak cookies analitycznych i reklamowych; Google dostaje wyłącznie
 *   anonimowe sygnały bez cookies, z których modeluje konwersje.
 * - Po kliknięciu „Akceptuję analitykę i pomiar reklam”: zgoda na analitykę i pomiar reklam.
 *   Personalizacja reklam (remarketing) zostaje wyłączona — baner o nią nie pyta.
 *
 * Ten plik jest bez "use client": skrypt domyślnej zgody jest wstawiany do HTML w `app/layout.tsx`
 * i musi się wykonać, zanim załaduje się gtag.js.
 */

export const CONSENT_STORAGE_KEY = "dan-dom-cookie-consent";
export const CONSENT_STORAGE_VERSION = 1;

/** Zgody ustawiane po akceptacji w banerze. */
export const CONSENT_GRANTED = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "denied",
} as const;

/** Stan domyślny i stan po wyborze „Tylko niezbędne”. */
export const CONSENT_DENIED = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

/**
 * Inline script for the top of <body>: gtag stub + default consent (denied).
 * Returning visitors who already accepted get the "granted" update before any tag fires.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
gtag('consent', 'default', ${JSON.stringify({ ...CONSENT_DENIED, wait_for_update: 500 })});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
try {
  var s = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) || 'null');
  if (s && s.v === ${CONSENT_STORAGE_VERSION} && s.analytics === true) {
    gtag('consent', 'update', ${JSON.stringify(CONSENT_GRANTED)});
  }
} catch (e) {}
`;
