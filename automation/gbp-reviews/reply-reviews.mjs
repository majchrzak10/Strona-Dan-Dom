/**
 * GBP Reviews — automatyczne odpowiedzi na nowe opinie na wizytówkach (raz dziennie).
 *
 * Jak działa:
 *  1. Pobiera opinie z obu wizytówek (Rogoźno, Wągrowiec) przez Business Profile API.
 *  2. Bierze tylko opinie, których nie ma jeszcze w state.json i które nie mają odpowiedzi.
 *  3. 4–5 gwiazdek  → odpowiada „Bardzo dziękujemy za opinię!”.
 *     1–3 gwiazdki  → NIE odpowiada; zakłada issue w GitHubie (powiadomienie mailem),
 *                     żeby odpowiedzieć ręcznie.
 *     Opinie od rodziny (nazwisko Majchrzak) są pomijane.
 *
 * Pierwsze uruchomienie (brak state.json) tylko zapisuje istniejące opinie jako „obsłużone”
 * i niczego nie publikuje — stare opinie zostały już przejrzane ręcznie.
 *
 * Tryby:
 *   node automation/gbp-reviews/reply-reviews.mjs            — normalnie
 *   node automation/gbp-reviews/reply-reviews.mjs --dry-run  — tylko pokazuje, co by zrobił
 *
 * Env: GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN,
 *      GITHUB_TOKEN + GITHUB_REPOSITORY (opc., do zakładania issue przy niskich ocenach)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, "state.json");
const DRY_RUN = process.argv.includes("--dry-run");

const REPLY_TEXT = "Bardzo dziękujemy za opinię!";
const SKIP_REVIEWER = /majchrzak/i;
const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const LOCATIONS = {
  rogozno: { label: "Rogoźno", locationId: "8789942959024409489", cid: "16642116072601270385" },
  wagrowiec: { label: "Wągrowiec", locationId: "17818313479284027844", cid: "4307722389435830076" },
};

const log = (m) => console.log(`[gbp-reviews] ${m}`);

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

async function api(method, url, token, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function findAccount(token) {
  const data = await api("GET", "https://mybusinessaccountmanagement.googleapis.com/v1/accounts", token);
  const acc = (data.accounts || [])[0];
  if (!acc) throw new Error("Nie znaleziono konta GBP");
  return acc.name;
}

async function listReviews(token, account, locationId) {
  const all = [];
  let pageToken = "";
  do {
    const url =
      `https://mybusiness.googleapis.com/v4/${account}/locations/${locationId}/reviews?pageSize=50` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
    const data = await api("GET", url, token);
    all.push(...(data.reviews || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return all;
}

async function openIssue(review, loc) {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
  const stars = STARS[review.starRating] ?? "?";
  const who = review.reviewer?.displayName || "Anonim";
  const title = `Opinia ${stars}★ na wizytówce ${loc.label} — odpowiedz ręcznie (${who})`;
  const body = [
    `**Wizytówka:** ${loc.label}`,
    `**Autor:** ${who}`,
    `**Ocena:** ${stars}/5`,
    `**Data:** ${review.createTime}`,
    "",
    "**Treść:**",
    review.comment ? `> ${review.comment.replace(/\n/g, "\n> ")}` : "_(bez komentarza)_",
    "",
    `Wizytówka w Mapach: https://maps.google.com/?cid=${loc.cid}`,
    "",
    "Automat nie odpowiada na opinie 1–3★. Odpowiedz ręcznie w panelu wizytówki i zamknij to zgłoszenie.",
  ].join("\n");
  if (DRY_RUN || !GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    log(`[issue] ${title}`);
    return;
  }
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`, {
    method: "POST",
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) log(`nie udało się założyć issue: ${res.status} ${await res.text()}`);
  else log(`założono issue: ${title}`);
}

async function main() {
  const token = await accessToken();
  const account = await findAccount(token);

  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : null;
  const handled = new Set(state?.handled || []);
  const replied = state?.replied || {};

  for (const [key, loc] of Object.entries(LOCATIONS)) {
    const reviews = await listReviews(token, account, loc.locationId);
    log(`${loc.label}: ${reviews.length} opinii.`);

    if (!state) {
      reviews.forEach((r) => handled.add(r.reviewId));
      continue;
    }

    for (const r of reviews) {
      if (handled.has(r.reviewId)) continue;
      const stars = STARS[r.starRating] ?? 0;
      const who = r.reviewer?.displayName || "Anonim";

      if (r.reviewReply) {
        handled.add(r.reviewId);
        continue;
      }
      if (SKIP_REVIEWER.test(who)) {
        log(`pomijam opinię od ${who} (rodzina).`);
        handled.add(r.reviewId);
        continue;
      }
      if (stars <= 3) {
        await openIssue(r, loc);
        handled.add(r.reviewId);
        continue;
      }
      if (DRY_RUN) {
        log(`[dry-run] odpowiedziałbym na ${stars}★ od ${who} (${loc.label}).`);
        continue;
      }
      try {
        await api("PUT", `https://mybusiness.googleapis.com/v4/${r.name}/reply`, token, { comment: REPLY_TEXT });
        replied[r.reviewId] = { location: key, stars, at: new Date().toISOString() };
        handled.add(r.reviewId);
        log(`odpowiedziano na ${stars}★ od ${who} (${loc.label}).`);
      } catch (e) {
        log(`błąd odpowiedzi na opinię od ${who}: ${e.message}`);
      }
    }
  }

  if (!state) log(`pierwsze uruchomienie — zapisano ${handled.size} istniejących opinii jako obsłużone, nic nie publikuję.`);
  if (!DRY_RUN) {
    const next = {
      initializedAt: state?.initializedAt || new Date().toISOString(),
      handled: [...handled].sort(),
      replied,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2) + "\n");
  }
}

main().catch((e) => {
  console.error(`[gbp-reviews] nieoczekiwany błąd: ${e?.message ?? e}`);
  process.exitCode = 1;
});
