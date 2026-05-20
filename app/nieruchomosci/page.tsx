import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import FilteredOffersGrid from "@/components/nieruchomosci/FilteredOffersGrid";
import NieruchomosciListingHeading from "@/components/nieruchomosci/NieruchomosciListingHeading";
import OfferCard from "@/components/offers/OfferCard";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { toCard } from "@/lib/asari/mapOffer";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { canonicalUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Nieruchomości Wągrowiec i Rogoźno — aktualne oferty",
  description:
    "Aktualne oferty sprzedaży i wynajmu mieszkań, domów, działek i lokali komercyjnych. Biuro nieruchomości Dan-Dom — Wągrowiec i Rogoźno.",
  alternates: { canonical: canonicalUrl("nieruchomosci") },
  openGraph: { url: canonicalUrl("nieruchomosci") },
};

const nieruchomosciBreadcrumbJsonLd = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Nieruchomości", route: "nieruchomosci" },
]);

export default async function NieruchomosciPage() {
  const { offers, error } = await loadAsariOffers();
  const cards = offers.map(toCard);

  const offersItemListJsonLd =
    cards.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Oferty nieruchomości Dan-Dom — Wągrowiec i Rogoźno",
          numberOfItems: cards.length,
          itemListElement: cards.map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: canonicalUrl(`oferty/${o.slug}`),
          })),
        }
      : null;

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nieruchomosciBreadcrumbJsonLd) }}
      />
      {offersItemListJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offersItemListJsonLd) }}
        />
      ) : null}
      <Navbar />

      <main className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-4 py-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
            Biuro Dan-Dom
          </p>
          <Suspense
            fallback={
              <h1 className="mt-3 font-[var(--font-playfair)] text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold leading-tight text-black lg:text-4xl">
                Nieruchomości na sprzedaż
              </h1>
            }
          >
            <NieruchomosciListingHeading />
          </Suspense>
          <div className="mt-4 h-px w-28 bg-burgundy/80" />

          {error ? (
            <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </p>
          ) : null}

          {!error && cards.length === 0 ? (
            <p className="mt-10 text-zinc-600">Brak ofert w aktualnym eksporcie.</p>
          ) : null}

          {!error && cards.length > 0 ? (
            <Suspense
              fallback={
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((o) => (
                    <OfferCard
                      key={o.signature}
                      offer={o}
                      href={`/oferty/${o.slug}/`}
                    />
                  ))}
                </div>
              }
            >
              <FilteredOffersGrid offers={cards} />
            </Suspense>
          ) : null}
        </div>

        <section className="mt-20" aria-label="Kontakt i nasze dane">
          <ContactDetailsSection />
        </section>
      </main>
    </div>
  );
}
