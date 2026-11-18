import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import OfferCard from "@/components/offers/OfferCard";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { toCard } from "@/lib/asari/mapOffer";
import type { ServiceAreaPageConfig } from "@/lib/seo/serviceAreaPages";

const card =
  "rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14";
const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary";
const h2 = "mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl";
const primaryBtn =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2";
const secondaryBtn =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2";

const steps = [
  {
    title: "Oględziny i wycena",
    desc: "Przyjeżdżamy na miejsce, oglądamy nieruchomość i dokumenty. Przy zleceniu sprzedaży wycena jest bezpłatna.",
  },
  {
    title: "Zdjęcia i ogłoszenie",
    desc: "Robimy zdjęcia, przygotowujemy opis i publikujemy ofertę na naszej stronie oraz na portalach ogłoszeniowych.",
  },
  {
    title: "Prezentacje i negocjacje",
    desc: "Pokazujemy nieruchomość kupującym na miejscu i prowadzimy rozmowy o cenie i warunkach.",
  },
  {
    title: "Formalności i notariusz",
    desc: "Kompletujemy dokumenty, pomagamy przy kredycie kupującego i doprowadzamy do aktu notarialnego.",
  },
];

export function serviceAreaJsonLd(cfg: ServiceAreaPageConfig) {
  return {
    breadcrumb: breadcrumbJsonLd([
      { name: "Strona główna", route: "" },
      { name: `Nieruchomości ${cfg.city}`, route: cfg.route },
    ]),
    faq: faqJsonLd(cfg.slug, cfg.faq),
  };
}

export default async function ServiceAreaPage({ cfg }: { cfg: ServiceAreaPageConfig }) {
  const { breadcrumb, faq } = serviceAreaJsonLd(cfg);
  const { offers } = await loadAsariOffers();
  const cards = offers.map(toCard);
  const matches = (keywords: string[]) => (o: (typeof cards)[number]) => {
    const loc = (o.locationLabel ?? "").toLowerCase();
    return keywords.some((k) => loc.includes(k));
  };
  const localOffers = cards.filter(matches(cfg.primaryKeywords));
  const nearbyOffers = cards.filter(
    (o) => matches(cfg.nearbyKeywords)(o) && !localOffers.includes(o),
  );
  const shown = [...localOffers, ...nearbyOffers].slice(0, 6);
  const offersHeading =
    localOffers.length > 0
      ? `Aktualne oferty w ${cfg.cityLocative} i okolicy`
      : `Najbliższe aktualne oferty w okolicy`;

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <Navbar />

      <main className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
          <section className={`${card} sm:py-14 lg:py-16`}>
            <nav aria-label="Ścieżka nawigacji" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="hover:text-brand-primary">Strona główna</Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-700">Nieruchomości {cfg.city}</span>
            </nav>

            <p className={eyebrow}>Biuro Dan-Dom · od 1996 roku</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Nieruchomości w {cfg.cityLocative}
            </h1>
            <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">{cfg.intro}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Pomagamy sprzedać, kupić i wynająć domy, mieszkania, działki i lokale w {cfg.cityLocative}{" "}
              i okolicy. Biuro prowadzi licencjonowany pośrednik (licencja nr 577).
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${cfg.office.phoneTel}`} className={primaryBtn}>
                Zadzwoń: {cfg.office.phoneDisplay}
              </a>
              <Link href="/uslugi/wycena-nieruchomosci/" className={secondaryBtn}>
                Bezpłatna wycena przy zleceniu
              </Link>
            </div>
          </section>

          <section className={card}>
            <p className={eyebrow}>Sprzedaż z nami</p>
            <h2 className={h2}>Jak sprzedajemy nieruchomość w {cfg.cityLocative}</h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-xl border border-zinc-100 bg-brand-primary/[0.02] p-5">
                  <p className="text-xs font-semibold text-brand-primary">Krok {i + 1}</p>
                  <h3 className="mt-1 font-semibold text-zinc-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{s.desc}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-zinc-600">
              Sprzedaż trwa zwykle 3–6 miesięcy od wystawienia oferty do podpisania aktu notarialnego.
            </p>
          </section>

          {shown.length > 0 ? (
            <section className={card}>
              <p className={eyebrow}>Oferty</p>
              <h2 className={h2}>{offersHeading}</h2>
              <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((o) => (
                  <OfferCard key={o.signature} offer={o} href={`/oferty/${o.slug}/`} />
                ))}
              </div>
              <div className="mt-8">
                <Link href="/nieruchomosci/" className={primaryBtn}>
                  Zobacz wszystkie oferty
                </Link>
              </div>
            </section>
          ) : null}

          <section className={card}>
            <p className={eyebrow}>Skąd działamy</p>
            <h2 className={h2}>Najbliższe biuro: {cfg.office.city}</h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              {cfg.city} obsługujemy z biura w {cfg.office.cityLocative}, {cfg.office.street},{" "}
              {cfg.office.postalCode} {cfg.office.city} — około {cfg.distanceKm} km. Biuro jest czynne od
              poniedziałku do piątku w godzinach 9:00–16:00, a na spotkania w {cfg.cityLocative} umawiamy się
              telefonicznie.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cfg.nearbyPlaces.map((place) => (
                <span key={place} className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700">
                  {place}
                </span>
              ))}
              <span className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-500">
                i okolice
              </span>
            </div>
            <div className="mt-8">
              <Link href={`/${cfg.office.pageRoute}/`} className={secondaryBtn}>
                Biuro w {cfg.office.cityLocative}
              </Link>
            </div>
          </section>

          <section className={card}>
            <p className={eyebrow}>Najczęstsze pytania</p>
            <h2 className={h2}>Nieruchomości {cfg.city} — pytania i odpowiedzi</h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <dl className="mt-8 divide-y divide-zinc-100">
              {cfg.faq.map((item) => (
                <div key={item.question} className="py-5">
                  <dt className="font-semibold text-zinc-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-7 text-zinc-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <Link href="/czeste-pytania/" className="text-sm font-semibold text-brand-primary hover:underline">
                Więcej pytań o sprzedaż, spadek i koszty
              </Link>
            </div>
          </section>

          <section className="mt-4" aria-label="Kontakt i nasze dane">
            <ContactDetailsSection />
          </section>
        </div>
      </main>
    </div>
  );
}
