/**
 * Treść strony „Częste pytania” (/czeste-pytania/).
 * Stan przepisów i stawek: listopad 2026 (taksa notarialna wg zmian od 5.11.2026).
 * Odpowiedzi są czystym tekstem — trafiają też do JSON-LD FAQPage.
 */

export type FaqEntry = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  intro: string;
  items: FaqEntry[];
};

export const FAQ_UPDATED = "listopad 2026";

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "spadek",
    title: "Sprzedaż nieruchomości po spadku",
    intro: "Formalności, podatki i najczęstsze sytuacje, gdy sprzedajesz mieszkanie lub dom odziedziczony po bliskich.",
    items: [
      {
        question: "Czy mogę sprzedać mieszkanie po rodzicach od razu po ich śmierci?",
        answer:
          "Nie od razu. Najpierw trzeba potwierdzić dziedziczenie: u notariusza aktem poświadczenia dziedziczenia albo w sądzie postanowieniem o stwierdzeniu nabycia spadku. U notariusza zwykle wystarcza jedna wizyta, jeśli nie ma wątpliwości, kto i w jakich częściach dziedziczy.",
      },
      {
        question: "Ile kosztuje potwierdzenie dziedziczenia?",
        answer:
          "W sądzie opłata wynosi 100 zł plus 5 zł za wpis do Rejestru Spadkowego, a jeśli sprawa toczy się przed upływem 6 miesięcy od śmierci, dochodzi po 100 zł od każdego spadkobiercy za oświadczenie o przyjęciu lub odrzuceniu spadku. Sąd jest tańszy, ale czeka się zwykle kilka miesięcy. U notariusza jest szybciej, ale drożej.",
      },
      {
        question: "Co to jest SD-Z2 i dlaczego termin 6 miesięcy jest tak ważny?",
        answer:
          "SD-Z2 to zgłoszenie spadku do urzędu skarbowego. Najbliższa rodzina (małżonek, dzieci, wnuki, rodzice, rodzeństwo) jest zwolniona z podatku od spadku, jeśli złoży je w ciągu 6 miesięcy od uprawomocnienia się postanowienia sądu lub zarejestrowania aktu poświadczenia dziedziczenia. Po terminie zwolnienie przepada i podatek liczy się według stawek dla I grupy. Wyjątek: jeśli o składniku spadku dowiedziałeś się później, 6 miesięcy liczy się od tej chwili, ale trzeba to uprawdopodobnić.",
      },
      {
        question: "Czy zapłacę podatek dochodowy, jeśli sprzedam odziedziczony dom w pierwszym roku?",
        answer:
          "Często nie. Przy spadku 5 lat liczy się od końca roku, w którym nieruchomość nabyła osoba zmarła. Jeśli rodzice kupili dom wcześniej niż 5 lat przed sprzedażą, podatku dochodowego nie ma.",
      },
      {
        question: "Czy muszę zaktualizować księgę wieczystą przed sprzedażą?",
        answer:
          "Tak, spadkobierca ma obowiązek ujawnić się w księdze wieczystej. Za zwłokę grozi grzywna od 500 do 10 000 zł. Od 17 marca 2026 r. wniosek może złożyć za Ciebie notariusz, jeśli dziedziczenie potwierdzono aktem poświadczenia dziedziczenia. Przy postanowieniu sądu wniosek składasz sam.",
      },
      {
        question: "Czy brat mieszkający w Niemczech musi przyjechać do notariusza?",
        answer:
          "Nie musi. Potrzebne jest pełnomocnictwo w formie aktu notarialnego, najpewniej sporządzone u polskiego konsula. Z naszej praktyki: osoba z zagranicy najczęściej daje pełnomocnictwo komuś z rodziny w Polsce albo przyjeżdża tylko raz, na podpisanie aktu. Resztę prowadzimy telefonicznie i mailowo.",
      },
      {
        question: "Czy jeden ze spadkobierców może sprzedać dom bez zgody pozostałych?",
        answer:
          "Nie. Sprzedaż całego domu wymaga zgody wszystkich współwłaścicieli. Każdy może sprzedać tylko swój udział. Gdy porozumienia nie ma, zostaje sądowy dział spadku.",
      },
    ],
  },
  {
    id: "koszty",
    title: "Koszty sprzedaży mieszkania lub domu",
    intro: "Kto płaci notariusza, podatki i opłaty — i ile realnie zostaje po stronie sprzedającego.",
    items: [
      {
        question: "Jakie koszty ponosi sprzedający mieszkanie lub dom?",
        answer:
          "Zwykle niewielkie: świadectwo charakterystyki energetycznej, zaświadczenia potrzebne do aktu (np. o braku osób zameldowanych, o braku zaległości w spółdzielni lub wspólnocie), wykreślenie hipoteki, jeśli była, oraz prowizja biura, jeśli sprzedajesz z pośrednikiem. Podatek dochodowy płacisz tylko przy sprzedaży przed upływem 5 lat.",
      },
      {
        question: "Kto płaci notariusza przy sprzedaży mieszkania?",
        answer:
          "Przepisy tego nie przesądzają. W praktyce zwykle kupujący, ale strony mogą się umówić inaczej, np. na podział po połowie. Kupujący płaci też zwykle 2% podatku PCC i opłaty sądowe za wpisy w księdze wieczystej.",
      },
      {
        question: "Ile kosztuje notariusz przy sprzedaży mieszkania za 300 000 zł?",
        answer:
          "Maksymalna taksa notarialna za umowę sprzedaży mieszkania to połowa stawki podstawowej, czyli przy cenie 300 000 zł do 985 zł netto (około 1 212 zł z VAT). Przy domu stawka jest pełna: do 1 970 zł netto. Do tego dochodzą wypisy aktu, wniosek do księgi wieczystej i opłaty sądowe. Notariusz może wziąć mniej, ale nie więcej.",
      },
      {
        question: "Czy muszę mieć świadectwo energetyczne, jeśli sprzedaję stare mieszkanie?",
        answer:
          "Tak. Obowiązek dotyczy także starszych mieszkań i domów, a za nieprzekazanie świadectwa kupującemu grozi grzywna do 5 000 zł. W naszej okolicy świadectwo kosztuje zwykle 400–600 zł, zależnie od nieruchomości.",
      },
      {
        question: "Czy zapłacę podatek, jeśli sprzedam mieszkanie kupione 3 lata temu?",
        answer:
          "Prawdopodobnie tak: 19% od dochodu, czyli różnicy między ceną sprzedaży a udokumentowanymi kosztami zakupu i nakładów. Rozliczasz się w PIT-39 do 30 kwietnia następnego roku. Podatku unikniesz, jeśli w ciągu 3 lat przeznaczysz pieniądze na własne cele mieszkaniowe (ulga mieszkaniowa). Przed decyzją warto sprawdzić aktualne przepisy z doradcą podatkowym.",
      },
      {
        question: "Czy mogę sprzedać mieszkanie z kredytem hipotecznym?",
        answer:
          "Tak. Kredyt spłaca się zwykle z pieniędzy kupującego w dniu aktu lub zaraz po nim, a bank wydaje zgodę na wykreślenie hipoteki. Wykreślenie kosztuje 100 zł opłaty sądowej. Przy kredycie ze zmiennym oprocentowaniem bank może pobrać prowizję za wcześniejszą spłatę tylko w pierwszych 3 latach, maksymalnie 3% spłacanej kwoty.",
      },
      {
        question: "Ile wynosi prowizja biura DAN-DOM i kiedy się ją płaci?",
        answer:
          "Prowizję ustalamy indywidualnie, a to, kto ją płaci, zależy od umowy. Płatna jest dopiero po podpisaniu aktu notarialnego. W jej cenie są: zdjęcia i film z drona, ogłoszenia na portalach, prezentacje kupującym i pomoc przy dokumentach.",
      },
    ],
  },
  {
    id: "czas",
    title: "Ile trwa sprzedaż",
    intro: "Realny czas sprzedaży w Wągrowcu, Rogoźnie i okolicy — oraz co go wydłuża.",
    items: [
      {
        question: "Ile trwa sprzedaż mieszkania lub domu w Wągrowcu i Rogoźnie?",
        answer:
          "U nas zwykle 3–6 miesięcy od wystawienia oferty do podpisania aktu notarialnego. Najwięcej czasu zajmuje znalezienie kupca; same formalności, czyli kredyt kupującego i akt, to zwykle 1–2 miesiące.",
      },
      {
        question: "Ile czeka się na kredyt kupującego?",
        answer:
          "Ustawa daje bankom 21 dni na decyzję kredytową, ale w praktyce wielu kupujących czeka 4–6 tygodni. Dlatego umowę przedwstępną warto podpisywać z zapasem czasu na akt.",
      },
      {
        question: "Ile trwa sprzedaż mieszkania po spadku?",
        answer:
          "Dłużej, bo najpierw trzeba potwierdzić dziedziczenie i zaktualizować księgę wieczystą. Gdy rodzina jest zgodna, wychodzi zwykle około 4–7 miesięcy. Przy sporze, sprawie w sądzie lub spadkobiercy za granicą około 6–12 miesięcy.",
      },
      {
        question: "Jak przyspieszyć sprzedaż nieruchomości?",
        answer:
          "Najbardziej pomagają: cena oparta na lokalnych transakcjach, a nie na ofertach sąsiadów, komplet dokumentów od pierwszego dnia, opróżnione i czyste wnętrza na zdjęciach oraz ustalona w rodzinie jedna cena i jedna osoba do kontaktu.",
      },
      {
        question: "Kiedy muszę wydać klucze kupującemu?",
        answer:
          "W terminie ustalonym w umowie: w dniu aktu albo później, jeśli potrzebujesz czasu na przeprowadzkę.",
      },
    ],
  },
];
