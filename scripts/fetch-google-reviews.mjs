// Pobiera aktualną liczbę opinii i ocenę z Google (Places API New)
// i zapisuje do lib/data/reviewStats.json. Uruchamiane w `prebuild`.
//
// Klucz: env GOOGLE_MAPS_KEY (GitHub Secret w CI).
// Brak klucza lub błąd API → zostawia istniejący plik i NIE przerywa buildu
// (lokalny `npm run build` bez klucza działa normalnie, używa wartości z repo).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Place ID wizytówki Dan-Dom (Wągrowiec, Danuta Majchrzak) — identyfikator publiczny.
const PLACE_ID = "ChIJ50LcPWt4BEcRPM9RnbAayDs";
const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "data",
  "reviewStats.json",
);

const key = process.env.GOOGLE_MAPS_KEY;
if (!key) {
  console.warn("[reviews] Brak GOOGLE_MAPS_KEY — pomijam, zostaje istniejący reviewStats.json");
  process.exit(0);
}

try {
  const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);

  const data = await res.json();
  const count = data.userRatingCount;
  const rating = data.rating;
  if (typeof count !== "number" || typeof rating !== "number") {
    throw new Error(`Nieoczekiwana odpowiedź: ${JSON.stringify(data)}`);
  }

  writeFileSync(OUT, JSON.stringify({ count, rating }, null, 2) + "\n");
  console.log(`[reviews] Zaktualizowano: ${count} opinii ★${rating}`);
} catch (e) {
  console.warn(`[reviews] Błąd (${e.message}) — zostaje istniejący reviewStats.json`);
  process.exit(0);
}
