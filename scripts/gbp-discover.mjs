// Diagnostyka Google Business Profile: autoryzacja OAuth (refresh -> access),
// lista kont i lokalizacji wizytówki. Z retry/backoff na 429/503 (niskie quota GBP).
// Wymaga env: GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN.
const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN } = process.env;
if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN) {
  console.error("Brak wymaganych sekretów GBP_*");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getAccessToken() {
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
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function gbpGet(url, access) {
  for (let i = 0; i < 7; i++) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${access}` } });
    if (res.status === 429 || res.status === 503) {
      const wait = Math.min(64000, 2000 * 2 ** i);
      console.log(`  ${res.status} (quota/rate) — czekam ${wait / 1000}s, próba ${i + 1}/7`);
      await sleep(wait);
      continue;
    }
    const body = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${url}\n${body}`);
    return JSON.parse(body);
  }
  throw new Error(`Po 7 próbach wciąż 429/503: ${url}`);
}

const access = await getAccessToken();
console.log("OAuth: access_token OK\n");

console.log("== KONTA (mybusinessaccountmanagement) ==");
const accounts = await gbpGet(
  "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
  access,
);
console.log(JSON.stringify(accounts, null, 2));

for (const acc of accounts.accounts || []) {
  console.log(`\n== LOKALIZACJE: ${acc.name} ==`);
  const loc = await gbpGet(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${acc.name}/locations?readMask=name,title,storefrontAddress&pageSize=100`,
    access,
  );
  console.log(JSON.stringify(loc, null, 2));
}

console.log("\nGotowe. Skopiuj nazwy 'accounts/.../locations/...' do auto-postów.");
