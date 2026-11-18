/**
 * Strony miast obsługiwanych dojazdowo (bez własnego biura na miejscu).
 *
 * Zasada: każda strona mówi wprost, z którego biura obsługujemy dane miasto.
 * Nie podajemy tu adresu w obsługiwanym mieście — DAN-DOM nie ma tam biura.
 * Treść ma być konkretna (nie kopia strony Rogoźna/Wągrowca z podmienioną nazwą).
 */

export type ServiceAreaOffice = {
  city: string;
  cityLocative: string;
  street: string;
  postalCode: string;
  phoneDisplay: string;
  phoneTel: string;
  pageRoute: string;
};

export type ServiceAreaFaq = { question: string; answer: string };

export type ServiceAreaPageConfig = {
  slug: string;
  route: string;
  city: string;
  cityLocative: string;
  countyLocative: string;
  distanceKm: number;
  office: ServiceAreaOffice;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  primaryKeywords: string[];
  nearbyKeywords: string[];
  nearbyPlaces: string[];
  faq: ServiceAreaFaq[];
};

export const OFFICE_ROGOZNO: ServiceAreaOffice = {
  city: "Rogoźno",
  cityLocative: "Rogoźnie",
  street: "ul. Wielka Poznańska 29",
  postalCode: "64-610",
  phoneDisplay: "506 541 111",
  phoneTel: "506541111",
  pageRoute: "nieruchomosci-rogozno",
};

export const OFFICE_WAGROWIEC: ServiceAreaOffice = {
  city: "Wągrowiec",
  cityLocative: "Wągrowcu",
  street: "ul. Kościuszki 28",
  postalCode: "62-100",
  phoneDisplay: "501 769 166",
  phoneTel: "501769166",
  pageRoute: "nieruchomosci-wagrowiec",
};

export const OBORNIKI: ServiceAreaPageConfig = {
  slug: "oborniki",
  route: "nieruchomosci-oborniki",
  city: "Oborniki",
  cityLocative: "Obornikach",
  countyLocative: "powiecie obornickim",
  distanceKm: 20,
  office: OFFICE_ROGOZNO,
  metaTitle: "Nieruchomości Oborniki — sprzedaż domu, mieszkania, działki",
  metaDescription:
    "Sprzedajesz dom, mieszkanie lub działkę w Obornikach? Biuro Dan-Dom z Rogoźna (ok. 20 km) — od 1996 roku, licencja nr 577, bezpłatna wycena przy zleceniu sprzedaży. Tel. 506 541 111.",
  intro:
    "Obsługujemy Oborniki i okolice z naszego biura w Rogoźnie, około 20 km dalej. Przyjeżdżamy na oględziny, robimy zdjęcia i prezentujemy nieruchomość kupującym na miejscu — nie musisz jeździć do nas.",
  primaryKeywords: ["oborniki"],
  nearbyKeywords: ["oborniki", "ryczywół", "rogoźno", "parkowo", "budziszewko", "garbatka", "nienawiszcz", "tarnowo", "boguniewo", "studzieniec"],
  nearbyPlaces: ["Oborniki", "Ryczywół", "Rogoźno", "Parkowo", "Budziszewko", "Murowana Goślina"],
  faq: [
    {
      question: "Czy Dan-Dom ma biuro w Obornikach?",
      answer:
        "Nie, Oborniki obsługujemy z biura w Rogoźnie przy ul. Wielkiej Poznańskiej 29 (ok. 20 km). Na oględziny, sesję zdjęciową i prezentacje dla kupujących przyjeżdżamy do Ciebie. Kontakt: 506 541 111.",
    },
    {
      question: "Ile kosztuje wycena nieruchomości w Obornikach?",
      answer:
        "Przy zleceniu sprzedaży wycena jest bezpłatna. Opieramy ją na cenach transakcyjnych z Obornik i powiatu obornickiego, a nie na cenach ofertowych z portali.",
    },
    {
      question: "Ile trwa sprzedaż domu lub mieszkania w Obornikach?",
      answer:
        "Zwykle 3–6 miesięcy od wystawienia oferty do podpisania aktu notarialnego. Najwięcej czasu zajmuje znalezienie kupca; formalności, czyli kredyt kupującego i akt, to zwykle 1–2 miesiące.",
    },
    {
      question: "Czy pomożecie sprzedać nieruchomość w Obornikach po spadku?",
      answer:
        "Tak. Pomagamy uporządkować dokumenty (stwierdzenie nabycia spadku lub akt poświadczenia dziedziczenia, księga wieczysta) i przeprowadzamy sprzedaż do aktu notarialnego. Szczegóły kosztów i terminów są w zakładce Częste pytania.",
    },
  ],
};

export const SKOKI: ServiceAreaPageConfig = {
  slug: "skoki",
  route: "nieruchomosci-skoki",
  city: "Skoki",
  cityLocative: "Skokach",
  countyLocative: "gminie Skoki",
  distanceKm: 20,
  office: OFFICE_WAGROWIEC,
  metaTitle: "Nieruchomości Skoki — sprzedaż i wynajem domu, mieszkania, działki",
  metaDescription:
    "Sprzedajesz lub wynajmujesz nieruchomość w Skokach? Biuro Dan-Dom z Wągrowca (ok. 20 km) — od 1996 roku, licencja nr 577, bezpłatna wycena przy zleceniu sprzedaży. Tel. 501 769 166.",
  intro:
    "Skoki i okoliczne wsie obsługujemy z naszego biura w Wągrowcu, około 20 km dalej. Przyjeżdżamy na oględziny, robimy zdjęcia i prezentujemy nieruchomość kupującym lub najemcom na miejscu.",
  primaryKeywords: ["skoki"],
  nearbyKeywords: ["skoki", "wągrowiec", "kobylec", "ochodza", "łaziska", "runowo"],
  nearbyPlaces: ["Skoki", "Rejowiec", "Potrzanowo", "Pawłowo Skockie", "Lechlin", "Wągrowiec"],
  faq: [
    {
      question: "Czy Dan-Dom ma biuro w Skokach?",
      answer:
        "Nie, Skoki obsługujemy z biura w Wągrowcu przy ul. Kościuszki 28 (ok. 20 km). Na oględziny, zdjęcia i prezentacje przyjeżdżamy na miejsce. Kontakt: 501 769 166.",
    },
    {
      question: "Czy pośredniczycie też w wynajmie mieszkań w Skokach?",
      answer:
        "Tak. Pośredniczymy w wynajmie mieszkań i domów w Skokach: pomagamy znaleźć i sprawdzić najemcę, przygotowujemy umowę i protokół zdawczo-odbiorczy.",
    },
    {
      question: "Ile trwa sprzedaż nieruchomości w Skokach?",
      answer:
        "Zwykle 3–6 miesięcy od wystawienia oferty do podpisania aktu notarialnego. Najwięcej czasu zajmuje znalezienie kupca; formalności to zwykle 1–2 miesiące.",
    },
    {
      question: "Ile kosztuje wycena nieruchomości w Skokach?",
      answer:
        "Przy zleceniu sprzedaży wycena jest bezpłatna. Opieramy ją na cenach transakcyjnych ze Skoków i powiatu wągrowieckiego.",
    },
  ],
};
