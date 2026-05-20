# Audyt SEO + AEO i plan — wmajchrzak.pl (20.05.2026)

Strona: Wojciech Majchrzak — ekspert / doradca kredytowy. One-page,
vanilla HTML, hosting Zenbox. Bez Google Ads.

OCENA OGÓLNA: 72/100 (technika ~88, treść/AEO ~58)

## PODSUMOWANIE
Dobrze zbudowany landing page z solidnym fundamentem technicznym:
lang="pl", viewport, kanoniczny URL, Open Graph + Twitter Card,
sitemap, robots.txt, jeden H1, alt na obrazach, bogaty JSON-LD
(LocalBusiness+FinancialService, Person, aggregateRating, recenzje,
FAQPage). To powyżej większości konkurencji. Główne ograniczenie:
jedna strona = wąski zestaw fraz, treść marketingowa zamiast
bogatej w odpowiedzi na pytania klientów. Drugi problem: niespójność
domeny www/bez-www i drobne braki schematu.

## KRYTYCZNE PROBLEMY

1. CIENKA TREŚĆ / JEDNA STRONA — sufit widoczności
Cała witryna to jeden URL. Brak osobnych stron pod intencje:
"kredyt hipoteczny Wągrowiec", "kredyt na budowę domu",
"refinansowanie", "kredyt dla firm". Największe ograniczenie.

2. NIESPÓJNOŚĆ DOMENY www/bez-www
Podwójny redirect: http://wmajchrzak.pl → https://wmajchrzak.pl →
https://www.wmajchrzak.pl. Naprawić w .htaccess: każdy wariant
jednym skokiem 301 na https://www.wmajchrzak.pl/.

3. BRAK SCHEMATU Service jako osobnych węzłów
Usługi są tylko jako tekstowa tablica serviceType w LocalBusiness.
Dodać do @graph osobne węzły @type:"Service" dla 4 usług —
name, description, provider (@id #business), areaServed, serviceType.

4. BRAK schematu WebSite i WebPage
Dodać węzeł WebSite (name, url, inLanguage:"pl") i WebPage,
powiązane przez @id.

## QUICK WINS

1. Naprawić podwójny redirect — .htaccess, ~4 linijki, 15 min.
2. Zoptymalizować obrazy: budynek.jpg (936 KB → ~100 KB WebP),
   zdjęcie LCP wojciech-majchrzak... (265 KB → ~130 KB). Wpływ na LCP.
3. Dodać do FAQ pytania kosztowe/procesowe: "Ile kosztuje doradca
   kredytowy?", "Czy pomoc doradcy jest płatna?", "Jak wziąć kredyt
   hipoteczny krok po kroku?", "Ile trwa proces kredytowy?" —
   zsynchronizować z FAQPage w JSON-LD.
4. Aktualizować lastmod w sitemap.xml.
5. Dodać sameAs do schematu (Facebook, wizytówka Google) — sygnał
   E-E-A-T, łączy stronę z opiniami Google.
6. Poprawić datePublished recenzji na pełne daty ISO (2026-03-15
   zamiast 2026-03).
7. Podłączyć Google Search Console + zweryfikować/uzupełnić
   wizytówkę Google (kategoria "Doradca kredytowy", godziny,
   zdjęcia, opis, link). 202 opinie ★5.0 to ogromny atut —
   wizytówka jest dla lokalnego doradcy ważniejsza niż sama strona.

## DŁUGOFALOWE

1. Podstrony usługowe (najważniejsze dla SEO) — osobne indeksowalne
   strony, każda z title/meta/H1/treść 600-1000 słów/Service schema:
   /kredyt-hipoteczny-wagrowiec, /kredyt-na-budowe-domu,
   /refinansowanie-kredytu, /kredyt-dla-firm.
2. Sekcja blogowa — silnik AEO. 1-2 artykuły/mc: "Jak obliczyć
   zdolność kredytową 2026", "Wkład własny — ile potrzeba",
   "Kredyt hipoteczny przy B2B", "BIK a kredyt". Schema Article+FAQPage.
3. Strony lokalne dla okolicznych miejscowości (Rogoźno, Skoki) —
   z UNIKALNĄ treścią (nie kopią).
4. Rozbudowa schematu po dodaniu podstron (BreadcrumbList, spójne @id).
5. Więcej treści "cytowalnej" przez AI na stronie głównej — konkrety
   w pełnych zdaniach: wymienić 7 banków partnerskich w zdaniu
   tekstowym (obecnie tylko pasek dekoracyjny), czas procesu,
   wymagane dokumenty.
6. Linki lokalne — katalogi Wągrowca, współpraca z pośrednikami
   nieruchomości (np. Dan-Dom!), lokalne portale.

## PLAN DZIAŁAŃ — kolejność

ETAP 1 — Quick wins techniczne (1 dzień):
- .htaccess: jeden redirect 301 wszystkich wariantów na www
- Kompresja obrazów (budynek.jpg, zdjęcie LCP) do WebP
- Aktualizacja lastmod w sitemap.xml

ETAP 2 — Dane strukturalne (1 dzień):
- Węzły Service dla 4 usług
- Węzły WebSite i WebPage
- sameAs (Facebook + Google) do #business i #person
- Pełne daty ISO recenzji
- Weryfikacja w Google Rich Results Test

ETAP 3 — Treść i AEO strony głównej (1-2 dni):
- 3-4 nowe pytania FAQ + sync z FAQPage
- Zdanie tekstowe z 7 bankami partnerskimi
- Rozbudowa opisów usług o konkrety

ETAP 4 — Narzędzia (1 dzień):
- Google Search Console + sitemap
- Wizytówka Google Business Profile — uzupełnienie
- Opcjonalnie Bing Webmaster Tools (zasila Copilot)

ETAP 5 — Rozbudowa długofalowa (ciągłe):
- 4 podstrony usługowe z Service schema
- Sekcja blogowa, 1-2 artykuły/mc
- BreadcrumbList + rozszerzenie sitemap
- Linki lokalne

## PLIKI DO EDYCJI
- Główny plik HTML — sekcja <head> (meta), JSON-LD, sekcja FAQ,
  sekcja banków
- .htaccess na Zenboxie — reguły redirect (Etap 1)
- sitemap.xml — lastmod + rozbudowa po dodaniu podstron
