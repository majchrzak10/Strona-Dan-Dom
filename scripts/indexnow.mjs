/**
 * IndexNow — po wdrożeniu powiadamia Bing (i inne wyszukiwarki IndexNow)
 * o nowych i usuniętych adresach z out/sitemap.xml.
 *
 * Bing zasila też wyszukiwanie w ChatGPT / Copilot, więc nowe oferty
 * szybciej pojawiają się w odpowiedziach AI. Google nie korzysta z IndexNow.
 *
 * Uruchamiane w CI po rsync: `node scripts/indexnow.mjs`
 * Stan (lista już zgłoszonych URL): automation/indexnow/state.json
 * Klucz: public/<KEY>.txt (klucz jest jawny z założenia protokołu).
 *
 * Skrypt nigdy nie przerywa deployu — błędy sieci tylko loguje.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const KEY = "e0efe82e7ee9816458f22c65df8fd1f7";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const PROD_HOST = "dan-dom.pl";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITEMAP = path.join(ROOT, "out", "sitemap.xml");
const STATE = path.join(ROOT, "automation", "indexnow", "state.json");
const DRY_RUN = process.argv.includes("--dry-run");

function log(msg) {
  console.log(`[indexnow] ${msg}`);
}

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP)) return null;
  const xml = fs.readFileSync(SITEMAP, "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, "utf8"));
  } catch {
    return null;
  }
}

async function submit(host, urlList) {
  for (let i = 0; i < urlList.length; i += 10000) {
    const chunk = urlList.slice(i, i + 10000);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList: chunk }),
    });
    log(`wysłano ${chunk.length} URL → HTTP ${res.status}`);
    if (res.status >= 400) {
      log(`odpowiedź: ${(await res.text()).slice(0, 300)}`);
      return false;
    }
  }
  return true;
}

async function main() {
  const urls = readSitemapUrls();
  if (!urls || urls.length === 0) {
    log("brak out/sitemap.xml albo pusta (staging/noindex) — pomijam.");
    return;
  }
  const host = new URL(urls[0]).hostname;
  if (host !== PROD_HOST) {
    log(`host ${host} to nie produkcja (${PROD_HOST}) — pomijam.`);
    return;
  }
  if (!fs.existsSync(path.join(ROOT, "out", `${KEY}.txt`))) {
    log(`brak out/${KEY}.txt — klucz nie trafi na serwer, pomijam.`);
    return;
  }

  const prev = readState();
  const prevSet = new Set(prev?.urls ?? []);
  const nowSet = new Set(urls);
  const added = urls.filter((u) => !prevSet.has(u));
  const removed = [...prevSet].filter((u) => !nowSet.has(u));

  let toSend;
  if (!prev) {
    toSend = urls;
    log(`pierwsze uruchomienie — zgłaszam całą stronę (${urls.length} URL).`);
  } else if (added.length === 0 && removed.length === 0) {
    log("bez zmian w sitemap — nic do zgłoszenia.");
    return;
  } else {
    const hubs = [`https://${host}/`, `https://${host}/oferty/`, `https://${host}/nieruchomosci/`];
    toSend = [...new Set([...added, ...removed, ...hubs])];
    log(`nowe: ${added.length}, usunięte: ${removed.length} → zgłaszam ${toSend.length} URL.`);
  }

  if (DRY_RUN) {
    toSend.slice(0, 20).forEach((u) => log(`  ${u}`));
    log("--dry-run: nic nie wysłano, stan bez zmian.");
    return;
  }

  let ok = false;
  try {
    ok = await submit(host, toSend);
  } catch (err) {
    log(`błąd sieci: ${err?.message ?? err}`);
  }
  if (!ok) {
    log("zgłoszenie nieudane — stan bez zmian, spróbuję przy następnym deployu.");
    return;
  }

  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify({ updatedAt: new Date().toISOString(), urls }, null, 2) + "\n");
  log("stan zapisany.");
}

main().catch((err) => {
  log(`nieoczekiwany błąd: ${err?.message ?? err}`);
});
