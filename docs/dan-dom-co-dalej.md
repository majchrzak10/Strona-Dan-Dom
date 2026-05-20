# Dan-Dom — co jeszcze można poprawić (analiza 20.05.2026)

Stan po sesji: 5 poprawek SEO wdrożonych i wypchniętych na produkcję
(commit f2e4698). Poniżej co zostało do rozważenia — w 3 obszarach.

═══════════════════════════════════════════════════════════
## A. GOOGLE ADS (dandom-ads)
═══════════════════════════════════════════════════════════

Stan: 4 kampanie, ~65 zł/dzień (~1980 zł/mc). Wizytówki ×2 (PMax),
Pozyskaj Oferty–Wycena (Search), Konkurenci (Search).

### A1. Skuteczność reklam „Niska" — PRIORYTET
W panelu Google Ads reklama ma status skuteczności „Niska".
Google: podniesienie do „Świetna" = średnio +6% konwersji.
Co zrobić:
- Dodać więcej nagłówków RSA (cel: 12-15 unikalnych), w tym z frazami
  kluczowymi w nagłówku ("Biuro nieruchomości Wągrowiec", "Sprzedaj
  nieruchomość", "Bezpłatna wycena").
- 4 opisy, zróżnicowane (korzyści, proces, dowód społeczny 4,9★).
- Przypiąć 1-2 kluczowe nagłówki na pozycji 1 (marka / główna fraza).
- Dodać brakujące rozszerzenia jeśli których brak (obraz, promocja).

### A2. Rekomendacja PMax — ulepszanie grup plików (+0.9%)
Google wciąż sugeruje wzmocnienie asset groups w PMax. Mimo
wcześniejszego P0.3 — dorzucić więcej tekstów i grafik, sprawdzić
„siłę zasobu" każdej grupy (cel: Doskonała).

### A3. Zastępcza forma płatności — PILNE, łatwe
TODO Jana z dawna: dodać backup karty w Google Ads. Bez tego ryzyko
wstrzymania wszystkich kampanii przy odrzuceniu płatności.
Konto Google Ads → Płatności → Forma płatności → dodaj zapasową.

### A4. Negatywne słowa kluczowe
Sprawdzić listę wykluczających dla kampanii Search. Typowe do
wykluczenia w nieruchomościach: „praca", „darmowe", „kurs", „za
darmo", „wynajem" (jeśli kampania tylko sprzedaż), nazwy miast spoza
obszaru. Zmniejsza przepalanie budżetu.

### A5. Śledzenie konwersji — weryfikacja
Potwierdzić, że liczone są: połączenia z reklam, wysłanie formularza
kontaktowego na dan-dom.pl, kliknięcie „Zadzwoń". Bez pełnego
śledzenia optymalizacja PMax działa „po omacku".

═══════════════════════════════════════════════════════════
## B. STRONA dan-dom.pl — pozostałe z audytu
═══════════════════════════════════════════════════════════

5 najważniejszych poprawek już zrobione. Zostały punkty długofalowe:

### B1. Schema Person dla zespołu
4 agentów (Danuta, Joanna, Marta, Jan) — dodać schema Person +
powiązanie `employee` w organizacji. Licencja pośrednika nr 577 jako
`hasCredential`. Pomaga, gdy ktoś pyta AI „kto prowadzi Dan-Dom".

### B2. Rozbudowa schema Service
Strony usług mają Service — dorzucić `provider` (@id organizacji),
`areaServed` (Wągrowiec, Rogoźno, oba powiaty), `serviceType`.

### B3. Schema ofert — parametry
Do schematu Offer/Product oferty dodać `additionalProperty`
(metraż, liczba pokoi, cena za m²) + `geo` oferty. AI lepiej dobiera
oferty do zapytań typu „działki do 400 tys. w gminie Rogoźno".

### B4. Treść AEO — blog/poradniki — NAJWIĘKSZY POTENCJAŁ
Dodać 2-3 artykuły, które AI będzie cytować jako źródło:
- „Jak sprzedać mieszkanie w Wągrowcu — krok po kroku"
- „Ceny nieruchomości w Wągrowcu i Rogoźnie [2026]" (z realnymi
  danymi z dandom-market-stats — unikalna przewaga!)
- „Sprzedaż z biurem czy bez pośrednika — co się opłaca"
To zmienia Dan-Dom z „podmiotu zapytań" w „źródło odpowiedzi".

### B5. sitemap lastmod
Obecnie wszystkie URL-e mają datę buildu. Docelowo: realna data
modyfikacji strony/oferty.

### B6. /oferty/ vs /nieruchomosci/ — decyzja
Dwie strony list ofert. Po poprawce obie mają oferty w HTML.
Do rozważenia: czy zostawić obie (różne cele), czy zrobić 301
z /oferty/ na /nieruchomosci/. Decyzja biznesowa — wymaga Twojego zdania.

═══════════════════════════════════════════════════════════
## C. WIZYTÓWKI GOOGLE (Profil Firmy)
═══════════════════════════════════════════════════════════

### C1. Zdjęcia — zaplanowane (najbliższe dni)
10+ zdjęć na każdą wizytówkę: budynek, wnętrze, zespół, logo.

### C2. Wpisy — paczka gotowa
Plik `dan-dom-wpisy-google.md`, rytm co 2 tygodnie.

### C3. Sekcja „Usługi" w wizytówce — do wypełnienia
W panelu wizytówki dodać listę usług: sprzedaż domu/mieszkania/
działki, wynajem, wycena, pośrednictwo kredytowe, doradztwo
inwestycyjne. Każda z krótkim opisem. Karmi AI konkretami.

### C4. Telefon w katalogach — niespójny NAP
firmy.net i oferteo mają stary numer 797 806 046.
Poprawić na: Wągrowiec 501 769 166 / Rogoźno 506 541 111.

### C5. Pytania i odpowiedzi (Q&A) na profilu
Dodać samodzielnie 3-5 własnych pytań z odpowiedziami (jako
właściciel) — np. „Czy wycena jest płatna?", „Jaką pobieracie
prowizję?". Q&A jest widoczne w profilu i czytane przez AI.

### C6. Odpowiedzi na pozostałe opinie
Dokończyć odpowiadanie na starsze opinie bez odpowiedzi
(swoim tempem).

### C7. Atrybuty wizytówki
Uzupełnić atrybuty: parking, dostępność dla niepełnosprawnych,
języki obsługi, „firma rodzinna" itp. — drobne sygnały dla Google.

═══════════════════════════════════════════════════════════
## PRIORYTETY — od czego zacząć
═══════════════════════════════════════════════════════════

1. A3 — zastępcza forma płatności Google Ads (pilne, 5 min)
2. C1 — zdjęcia do wizytówek (zaplanowane)
3. A1 — poprawa skuteczności reklam (realny wzrost konwersji)
4. B4 — pierwszy artykuł blogowy AEO (największy potencjał w AI)
5. C3 + C4 + C5 — uzupełnienie wizytówek (usługi, NAP, Q&A)
6. B1-B3 — rozbudowa schema (przy okazji prac nad stroną)
