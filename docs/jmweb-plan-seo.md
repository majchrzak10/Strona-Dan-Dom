# Audyt SEO + AEO i plan — jmweb.pl (20.05.2026)

Strona: JMweb — Jan Majchrzak, tworzenie stron internetowych dla firm.
Astro 5 SSG, hosting Cyberfolks. Bez Google Ads.

OCENA OGÓLNA: 62/100 (technika ~85, treść SEO ~40, AEO ~60)

## PODSUMOWANIE
Strona technicznie solidna i czysto zbudowana (Astro 5 SSG, statyczny
HTML, lang="pl", kanoniczne URL, kompletne OG+Twitter, dedykowany
OG-image, HTTPS+301, jeden H1, obrazy WebP z srcset, FAQPage JSON-LD).
Najpoważniejszy problem jest architektoniczny: cała witryna to JEDNA
strona (single-page z kotwicami) — nie ma czego pozycjonować pod
konkretne frazy. Treść dobra jakościowo, ale za płytka i za mała na
konkurencyjną niszę.

## KRYTYCZNE PROBLEMY

1. ARCHITEKTURA SINGLE-PAGE — brak osobnych podstron
Jeden URL, sitemap ma 1 adres. Główna bariera wzrostu.
Rozbić na: /redesign-stron, /nowe-strony, /cennik, /realizacje
(+ case studies /realizacje/dan-dom, /realizacje/wmajchrzak),
/o-mnie, /kontakt, /blog. Każda z własnym title/meta/H1/schema.

2. BRAK schematu Person i Organization
Jest ProfessionalService i WebSite, brak Person (Jan Majchrzak jako
twórca — kluczowe dla E-E-A-T i AI) i Organization z logo.
Dodać Person (name, jobTitle:"Web Developer", worksFor, sameAs do
GitHub majchrzak10/LinkedIn). Rozbudować ProfessionalService o
priceRange, sameAs, founder, areaServed.

3. BRAK schematu Service, BreadcrumbList, Review/AggregateRating
4 usługi i opinia klienta bez znaczników. Po dodaniu podstron —
Service dla każdej usługi, Review dla opinii, BreadcrumbList.

4. BRAK danych lokalnych (NAP) i LocalBusiness
areaServed="Polska", brak adresu/lokalizacji/profilu Google.
Strona reklamuje "Google Business" jako usługę, a sama go nie używa.
Założyć wizytówkę Google, dodać address (miasto, region), rozważyć
LocalBusiness.

5. TRACKING GOOGLE ADS na stronie bez kampanii Ads
W <head> jest gtag.js z AW-18165131830 (Ads conversion tracking).
Skoro brak kampanii — martwy skrypt (obciążenie, prywatność).
Usunąć tag Ads albo zamienić na GA4. Podłączyć Search Console.

## QUICK WINS

1. H1 vs title — H1 "Twoja firma zasługuje na lepszą stronę" bez
   frazy kluczowej. Upewnić się że "strony internetowe dla firm"
   pada w pierwszym akapicie (pada — OK) lub wpleść w H1.
2. Nazwisko twórcy nie pada w treści — dodać "Jan Majchrzak"
   widocznie w sekcji "O JMweb" i stopce. Kluczowe dla AEO/E-E-A-T.
3. Brak stopki z NAP — dodać semantyczny <footer> z nazwą,
   telefonem, mailem, lokalizacją, sameAs.
4. Sekcja darmowego audytu ukryta — dodać link "Audyt" do
   nawigacji, rozważyć osobny URL /darmowy-audyt.
5. Cache-Control max-age=3600 (1h) — ustawić długi cache (1 rok,
   immutable) dla /_astro/ na Cyberfolks.
6. Linki portfolio — jeśli target="_blank", dodać rel="noopener".
7. Brak lastmod w sitemap — włączyć w Astro sitemap integration.

## DŁUGOFALOWE

1. Treść pod intencje klienta (najważniejsze) — strona /cennik z
   widełkami ("wizytówka od X zł", "strona firmowa od Y zł",
   "redesign od Z zł"). AI cytuje konkrety. Rozbudować FAQ do
   12-15 pytań.
2. Blog / baza wiedzy — brak /blog, największa utracona szansa.
   8-12 artykułów: "Ile kosztuje strona internetowa dla firmy 2026",
   "Redesign WordPress — kiedy się opłaca", "Astro czy WordPress",
   "Jak zamówić stronę WWW krok po kroku". Schema BlogPosting+author.
3. Rozbudowa case studies — osobna podstrona per realizacja:
   problem → rozwiązanie → efekt (z liczbami).
4. Ściana opinii — zbierać po każdym projekcie, Review +
   docelowo aggregateRating.
5. Strona /o-mnie z prawdziwą historią — biogram Jana, zdjęcie,
   stack, GitHub. Schema Person + ProfilePage.

## PLAN DZIAŁAŃ — kolejność

ETAP 1 — fundament pomiarowy i czyszczenie (1 dzień):
- Usunąć tag Google Ads (AW-18165131830) z <head>
- Podłączyć GA4 + Google Search Console, przesłać sitemap
- Dodać semantyczny <footer> z pełnym NAP + sameAs
- Dopisać "Jan Majchrzak" w widocznej treści "O JMweb"

ETAP 2 — dane strukturalne (1-2 dni):
- Schema Person (Jan Majchrzak, jobTitle, sameAs)
- Rozbudowa ProfessionalService/LocalBusiness (priceRange,
  address, founder, sameAs, logo)
- Review dla opinii klienta
- Profil Google Business + sameAs

ETAP 3 — architektura wielostronowa (1-2 tygodnie):
- Rozbić single-page na podstrony (/redesign-stron, /nowe-strony,
  /cennik, /realizacje + case studies, /o-mnie, /kontakt,
  /darmowy-audyt)
- Każda: unikalny title/meta/H1, BreadcrumbList, Service schema
- Sitemap wiele URL + lastmod, kotwice na stronie głównej jako skróty

ETAP 4 — treść i AEO (ciągłe):
- /cennik z widełkami cenowymi
- FAQ do 12-15 pytań
- /blog — 8-12 artykułów, BlogPosting + autor Person
- Case studies o kontekst i wyniki liczbowe
- Kolejne opinie, docelowo aggregateRating

ETAP 5 — wydajność (przy okazji):
- Długi cache (immutable, 1 rok) dla /_astro/
- Core Web Vitals w PageSpeed/Search Console po zmianach

## CO DZIAŁA DOBRZE (nie ruszać)
- Statyczny HTML Astro SSG — treść w pełni czytelna dla AI/botów
- Kompletne OG + Twitter + dedykowany OG-image
- lang="pl", kanoniczny URL, jeden H1, hierarchia H2/H3
- Obrazy WebP z srcset, width/height, lazy, alt
- HTTPS, 301, nagłówki bezpieczeństwa
- FAQPage wdrożony i spójny z treścią
- robots.txt + sitemap-index OK
