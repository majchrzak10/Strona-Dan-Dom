/**
 * GBP Post — nowe oferty z eksportu Asari → wpisy na wizytówkach Google (raz dziennie).
 *
 * Jak działa:
 *  1. Scala paczki XML z asari-export/ (ADD/UPDATE/DELETE, kolejność wg nazwy pliku = czas).
 *  2. Bierze aktualne oferty, których nie ma jeszcze w state.json.
 *  3. Przypisuje wizytówkę po powiecie (param. 46): obornicki itd. → Rogoźno, wągrowiecki itd. → Wągrowiec.
 *     Oferty spoza tych powiatów (np. Poznań) idą na wizytówkę Wągrowca — każda oferta tylko na jedną wizytówkę.
 *  4. Sprawdza, że strona oferty i zdjęcie JPG są już na dan-dom.pl (po deployu).
 *  5. Publikuje wpis „Co nowego” ze zdjęciem i przyciskiem „Więcej informacji”.
 *     Najwyżej 1 wpis, nie częściej niż co 3 dni — reszta czeka w kolejce (najstarsze pierwsze).
 *
 * Pierwsze uruchomienie (brak state.json) tylko zapisuje obecne oferty jako „widziane”
 * i niczego nie publikuje — żeby nie wysłać naraz kilkudziesięciu wpisów.
 *
 * Tryby:
 *   node automation/gbp-post/post-new-offers.mjs            — normalnie (wymaga sekretów GBP_*)
 *   node automation/gbp-post/post-new-offers.mjs --dry-run  — tylko pokazuje treść wpisów
 *   node automation/gbp-post/post-new-offers.mjs --preview N — treść dla N najnowszych ofert (bez stanu)
 *
 * Env: GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN, ASARI_DATA_DIR (opc.), SITE_URL (opc.)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const STATE_FILE = path.join(__dirname, "state.json");
const DATA_DIR = process.env.ASARI_DATA_DIR || path.join(ROOT, "asari-export");
const SITE_URL = (process.env.SITE_URL || "https://dan-dom.pl").replace(/\/$/, "");
const MAX_POSTS_PER_RUN = 1;
/** Minimalny odstęp między wpisami (dni). Nowe oferty czekają w kolejce i wychodzą po jednej. */
const MIN_DAYS_BETWEEN_POSTS = 3;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const PREVIEW_N = args.includes("--preview") ? Number(args[args.indexOf("--preview") + 1] || 3) : 0;

/** Identyfikatory wizytówek (Business Profile ID = location ID). */
const LOCATIONS = {
  rogozno: { label: "Rogoźno", locationId: "8789942959024409489" },
  wagrowiec: { label: "Wągrowiec", locationId: "17818313479284027844" },
};

/** Powiat (param. 46, wielkie litery) → wizytówka. Pozostałe powiaty (np. Poznań) → DEFAULT_LOCATION. */
const POWIAT_TO_LOCATION = {
  OBORNICKI: "rogozno",
  CHODZIESKI: "rogozno",
  "CZARNKOWSKO-TRZCIANECKI": "rogozno",
  WĄGROWIECKI: "wagrowiec",
  NAKIELSKI: "wagrowiec",
  GNIEŹNIEŃSKI: "wagrowiec",
};

/** Oferty spoza powiatów powyżej (Poznań, poznański, inne) trafiają na Wągrowiec. */
const DEFAULT_LOCATION = "wagrowiec";

const log = (m) => console.log(`[gbp-post] ${m}`);

// ---------------------------------------------------------------------------
// Asari XML
// ---------------------------------------------------------------------------
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
  processEntities: { maxTotalExpansions: 500_000 },
});
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const pText = (p) => (typeof p === "object" ? String(p?.["#text"] ?? "") : String(p ?? ""));

function params(offer) {
  const m = new Map();
  for (const p of arr(offer?.parameters?.p)) if (p?.["@_id"] != null) m.set(String(p["@_id"]), pText(p).trim());
  return m;
}

function loadOffers() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.toLowerCase().endsWith(".xml") && !/cfg|defini/i.test(f))
    .sort();
  const offers = new Map();
  for (const f of files) {
    const root = parser.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
    for (const sig of arr(root?.PACKAGE?.DELETE?.offers?.signature)) offers.delete(String(sig).trim());
    for (const o of arr(root?.PACKAGE?.offer)) {
      const pm = params(o);
      const sig = pm.get("1");
      if (sig) offers.set(sig, { pm, offer: o });
    }
  }
  return offers;
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const plnFmt = (n) => `${Math.round(n).toLocaleString("pl-PL").replace(/ /g, " ")} zł`;
const cap = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "");
const titleCase = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());

function mainPhoto(offer) {
  const pics = arr(offer?.pictures?.picture)
    .map((p) => ({ name: String(p?.unique ?? "").trim(), status: String(p?.status ?? ""), w: Number(p?.weight ?? 999) }))
    .filter((p) => p.name);
  if (!pics.length) return null;
  const main = pics.find((p) => p.status === "1") || pics.sort((a, b) => a.w - b.w)[0];
  return main.name;
}

/** Krótki, czysty opis: bez HTML, telefonów, maili, linków i formułek o płatnym pośrednictwie. */
function cleanDescription(html) {
  const text = String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.split(/(?<=[.!?])\s+/);
  const bad = /(\d{3}[\s-]?\d{3}[\s-]?\d{3}|@|https?:|www\.|facebook|płatna|regulamin|osoba prowadząca|polecamy państwu|zachęcamy|serdecznie|w razie dodatkowych pytań|współpraca z nami|lokalizacja:|miasto \/ dzielnica)/i;
  const endsWithAbbrev = /\b(k|ok|ul|m|gm|pow|tj|np|ca|godz|al|os|pl|nr)\.$/i;
  const out = [];
  let len = 0;
  for (let s of sentences) {
    if (endsWithAbbrev.test(s)) break;
    if (bad.test(s) || s.length < 15) continue;
    if (s === s.toUpperCase()) s = s.charAt(0) + s.slice(1).toLowerCase();
    if (len + s.length > 480) break;
    out.push(s);
    len += s.length + 1;
    if (out.length >= 3) break;
  }
  return out.join(" ");
}

function buildPost(sig, { pm, offer }) {
  const slug = sig.replace(/\//g, "-");
  const transaction = (pm.get("43") || "").toUpperCase();
  const rent = transaction.includes("WYNAJEM");
  const title = (pm.get("491") || `${cap(pm.get("36"))} ${titleCase(pm.get("48"))}`).trim();
  const price = num(pm.get("10"));
  const area = num(pm.get("128"));
  const rooms = (pm.get("19") || "").match(/\d+/)?.[0];
  const place = [titleCase(pm.get("48")), pm.get("47") && pm.get("47") !== pm.get("48") ? `gm. ${titleCase(pm.get("47"))}` : ""]
    .filter(Boolean)
    .join(", ");
  const facts = [
    price ? (rent ? `${plnFmt(price)}/mies.` : plnFmt(price)) : null,
    area ? `${String(area).replace(".", ",")} m²` : null,
    rooms ? `${rooms} pok.` : null,
    place || null,
  ].filter(Boolean);
  const desc = cleanDescription(offer?.description);
  const summary = [`${rent ? "Na wynajem" : "Nowa oferta"}: ${title}`, facts.join(" · "), desc]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 1450);
  const photo = mainPhoto(offer);
  const photoJpg = photo ? `${SITE_URL}/zdjecia/${encodeURIComponent(photo)}` : null;
  return {
    sig,
    location: POWIAT_TO_LOCATION[(pm.get("46") || "").toUpperCase()] || DEFAULT_LOCATION,
    powiat: pm.get("46") || "?",
    created: pm.get("5") || "",
    url: `${SITE_URL}/oferty/${slug}/`,
    photo: photoJpg,
    summary,
  };
}

// ---------------------------------------------------------------------------
// Google Business Profile API
// ---------------------------------------------------------------------------
async function accessToken() {
  const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN } = process.env;
  if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN) throw new Error("Brak sekretów GBP_*");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GBP_CLIENT_ID,
      client_secret: GBP_CLIENT_SECRET,
      refresh_token: GBP_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`OAuth ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

class ApiNotReady extends Error {}

async function api(method, url, token, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (res.status === 429 || (res.status === 403 && /quota|has not been used|disabled|PERMISSION_DENIED/i.test(text))) {
    throw new ApiNotReady(`${res.status}: ${text.slice(0, 300)}`);
  }
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : {};
}

async function findAccount(token) {
  const data = await api("GET", "https://mybusinessaccountmanagement.googleapis.com/v1/accounts", token);
  const acc = (data.accounts || [])[0];
  if (!acc) throw new Error("Nie znaleziono konta GBP");
  return acc.name; // "accounts/123"
}

async function publish(token, account, post) {
  const loc = LOCATIONS[post.location];
  return api("POST", `https://mybusiness.googleapis.com/v4/${account}/locations/${loc.locationId}/localPosts`, token, {
    languageCode: "pl",
    topicType: "STANDARD",
    summary: post.summary,
    callToAction: { actionType: "LEARN_MORE", url: post.url },
    ...(post.photo ? { media: [{ mediaFormat: "PHOTO", sourceUrl: post.photo }] } : {}),
  });
}

async function isLive(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
function printPost(p) {
  const loc = p.location ? LOCATIONS[p.location].label : `POMINIĘTA (powiat ${p.powiat})`;
  console.log(`\n── ${p.sig} → wizytówka: ${loc}`);
  console.log(p.summary);
  console.log(`[Zdjęcie] ${p.photo ?? "brak"}`);
  console.log(`[Więcej informacji] ${p.url}`);
}

async function main() {
  const offers = loadOffers();
  const current = [...offers.entries()].filter(([, v]) => (v.pm.get("26") || "AKTUALNA").toUpperCase() === "AKTUALNA");

  if (PREVIEW_N) {
    current
      .sort(([, a], [, b]) => (b.pm.get("5") || "").localeCompare(a.pm.get("5") || ""))
      .slice(0, PREVIEW_N)
      .forEach(([sig, v]) => printPost(buildPost(sig, v)));
    return;
  }

  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : null;
  if (!state) {
    const init = { initializedAt: new Date().toISOString(), seen: current.map(([s]) => s).sort(), posted: {} };
    if (!DRY_RUN) fs.writeFileSync(STATE_FILE, JSON.stringify(init, null, 2) + "\n");
    log(`pierwsze uruchomienie — zapisano ${init.seen.length} obecnych ofert jako widziane, nic nie publikuję.`);
    return;
  }

  const seen = new Set(state.seen || []);
  const fresh = current.filter(([s]) => !seen.has(s)).map(([s, v]) => buildPost(s, v));
  if (!fresh.length) return log("brak nowych ofert.");

  const skipped = fresh.filter((p) => !p.location);
  for (const p of skipped) {
    log(`pomijam ${p.sig} — powiat ${p.powiat} poza obszarem wizytówek.`);
    seen.add(p.sig);
  }
  const lastPostAt = Object.values(state.posted || {})
    .map((x) => Date.parse(x.at))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];
  const daysSince = lastPostAt ? (Date.now() - lastPostAt) / 86_400_000 : Infinity;
  if (!DRY_RUN && daysSince < MIN_DAYS_BETWEEN_POSTS) {
    log(`ostatni wpis ${daysSince.toFixed(1)} dnia temu — czekam (co najmniej ${MIN_DAYS_BETWEEN_POSTS} dni). W kolejce: ${fresh.filter((p) => p.location).length}.`);
    state.seen = [...seen].sort();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
    return;
  }

  const queue = fresh
    .filter((p) => p.location)
    .sort((a, b) => (a.created || "").localeCompare(b.created || ""))
    .slice(0, MAX_POSTS_PER_RUN);

  let token = null;
  let account = null;
  for (const p of queue) {
    if (DRY_RUN) {
      printPost(p);
      continue;
    }
    if (!(await isLive(p.url)) || (p.photo && !(await isLive(p.photo)))) {
      log(`${p.sig}: strona lub zdjęcie jeszcze nie na serwerze — spróbuję jutro.`);
      continue;
    }
    try {
      token ??= await accessToken();
      account ??= await findAccount(token);
      const res = await publish(token, account, p);
      state.posted = state.posted || {};
      state.posted[p.sig] = { location: p.location, post: res.name || null, at: new Date().toISOString() };
      seen.add(p.sig);
      log(`opublikowano ${p.sig} na wizytówce ${LOCATIONS[p.location].label}.`);
    } catch (e) {
      if (e instanceof ApiNotReady) {
        log(`API wizytówek jeszcze niedostępne (czekamy na zatwierdzenie przez Google): ${e.message}`);
        break;
      }
      log(`błąd przy ${p.sig}: ${e.message}`);
    }
  }

  if (!DRY_RUN) {
    state.seen = [...seen].sort();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  }
}

main().catch((e) => {
  console.error(`[gbp-post] nieoczekiwany błąd: ${e?.message ?? e}`);
  process.exitCode = 1;
});
