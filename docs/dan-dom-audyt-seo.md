# Audyt SEO + AEO — dan-dom.pl (20.05.2026)

Ocena ogólna: ~84/100. Strona w bardzo dobrej kondycji, powyżej średniej
lokalnego biura nieruchomości. Brak błędów krytycznych — to lista doszlifowania.

## CO DZIAŁA DOBRZE (nie ruszać)
- Renderowanie treści w HTML (statyczny eksport Next.js) — fundament widoczności w AI
- JSON-LD RealEstateAgent — kompletny: adres, telefon, foundingDate 1996, godziny, aggregateRating 4.9/60, dwie lokalizacje
- FAQPage schema — 9 pytań transakcyjnych, wzorzec dla AEO
- Meta tagi — unikalne lokalne tytuły/opisy, pełny Open Graph, Twitter Card
- Atrybuty alt na obrazach, wydajność (next/image, lazy, WebP), dostępność (lang pl, skip-link, aria)
- robots.txt + sitemap poprawne, HTTPS, kanoniczne URL-e

## KRYTYCZNE (najwyższy priorytet — choć to raczej quick winy)

### 1. Brak współrzędnych geo w schema RealEstateAgent
Schema ma adres, telefon, godziny, ocenę — ale brak pola `geo` (GeoCoordinates).
Google Maps i AI przy zapytaniach "biuro nieruchomości w pobliżu" premiują dokładne współrzędne.
Poprawka: dodać do RealEstateAgent i obu obiektów Place:
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... }
+ pole hasMap z linkiem do wizytówki Google.

### 2. /nieruchomosci/ — oferty tylko w JS, brak w HTML; duplikat z /oferty/
Strona /nieruchomosci/ ma 0 linków do ofert w surowym HTML (dociągane JS).
Strona /oferty/ jest OK — 51 ofert w HTML. Dwie strony list ofert = ryzyko kanibalizacji.
Poprawka: wyrenderować oferty statycznie na /nieruchomosci/ ALBO 301 jedną na drugą.
Dodać schema ItemList na stronę listy.

### 3. Niespójność liczby ofert: sitemap 52 vs strona /oferty/ 51
Generator sitemap zdesynchronizowany z listą ofert. Ryzyko ofert-sierot.
Poprawka: sitemap z tego samego źródła co strona /oferty/.

## QUICK WINS
- Strona główna ma 2x H1 ("Nieruchomości w Wągrowcu i Rogoźnie" + nadtytuł "Biuro... od 1996"). Nadtytuł zmienić na p/span.
- Tytuły usług mają podwójną markę: "...Dan-Dom Wągrowiec i Rogoźno — Dan-Dom Nieruchomości". Jeden suffix.
- Tytuły/opisy ofert ubogie (wersaliki + kropki, np. "DZIAŁKA · GARBATKA"). Generować naturalny język + cena za m² + telefon w description.
- Brak BreadcrumbList na stronie pojedynczej oferty (usługi i miasta mają). Dodać.
- og:type oferty = "website" → zmienić na produktowy + product:price:amount/currency.
- Strony miast /nieruchomosci-wagrowiec/ i /nieruchomosci-rogozno/ — 0 ofert w HTML. Dodać 6-9 statycznych kart.
- Linkowanie wewnętrzne: usługi nie linkują do ofert; miasta nie linkują do ofert. Dodać linki kontekstowe (cel: max 2 kliknięcia od strony głównej).

## DŁUGOFALOWE
- Schema Person dla 4 agentów + employee w organizacji. Dodać licencję pośrednika 577 jako hasCredential.
- Rozbudować schema Service o provider, serviceType, areaServed (Wągrowiec, Rogoźno, powiaty).
- Schema ofert: dodać additionalProperty (metraż, pokoje, cena/m²) + geo oferty.
- Treść AEO: artykuły "Jak sprzedać mieszkanie w Wągrowcu krok po kroku", "Ceny nieruchomości Wągrowiec i Rogoźno 2026" — magnes na cytowania w Perplexity/AI Overviews.
- sitemap lastmod: realna data zmiany strony zamiast daty buildu.
- sameAs w schema: rozszerzyć o Facebook i pełne URL-e wizytówek Google (zamiast skróconych share.google).

## NAP — spójność potwierdzona na stronie
ul. Kościuszki 28, 62-100 Wągrowiec, tel. 501 769 166
ul. Wielka Poznańska 29, 64-610 Rogoźno, tel. 506 541 111
(Uwaga osobna: katalogi firmy.net i oferteo mają stary telefon 797 806 046 — do poprawy.)

## NASTĘPNE KROKI (priorytetowo)
1. Dodać geo (GeoCoordinates) do schema — największy efekt, minimalny nakład
2. Rozwiązać duplikat /nieruchomosci/ vs /oferty/ + ItemList schema
3. Poprawić szablon tytułów/opisów ofert + og:type + BreadcrumbList na ofercie
4. Naprawić jeden H1 + podwójna marka w tytułach usług
5. Statyczne karty ofert na strony miast + linkowanie wewnętrzne

Repo strony: majchrzak10/Strona-Dan-Dom (lokalnie C:\Users\janma\Desktop\Strona-Dan-Dom)
