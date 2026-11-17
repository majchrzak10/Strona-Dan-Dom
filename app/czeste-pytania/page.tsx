import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactFormWithBoundary from "@/components/ContactFormWithBoundary";
import HomeContactFooter from "@/components/HomeContactFooter";
import { breadcrumbJsonLd } from "@/lib/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/lib/seo/faqJsonLd";
import { canonicalUrl } from "@/lib/seo/site";
import { FAQ_GROUPS, FAQ_UPDATED } from "@/lib/faq/czestePytania";

const PAGE_URL = canonicalUrl("czeste-pytania");

export const metadata: Metadata = {
  title: "Częste pytania o sprzedaż nieruchomości — spadek, koszty, czas",
  description:
    "Odpowiedzi biura Dan-Dom z Wągrowca i Rogoźna: jak sprzedać mieszkanie po spadku, kto płaci notariusza, ile kosztuje sprzedaż i ile trwa. Stan przepisów: listopad 2026.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    url: PAGE_URL,
    title: "Częste pytania o sprzedaż nieruchomości — Dan-Dom",
    description: "Spadek, koszty i czas sprzedaży mieszkania lub domu — konkretne odpowiedzi biura z Wągrowca i Rogoźna.",
    images: [{ url: "/hero-biuro.jpg", width: 1200, height: 800, alt: "Dan-Dom Nieruchomości" }],
  },
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Strona główna", route: "" },
  { name: "Częste pytania", route: "czeste-pytania" },
]);

const faq = faqJsonLd(
  "czeste-pytania",
  FAQ_GROUPS.flatMap((g) => g.items),
);

export default function CzestePytaniaPage() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4] text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <Navbar />

      <main id="main-content" className="min-w-0 px-3 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
          {/* ── Nagłówek ── */}
          <section className="rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <nav aria-label="Ścieżka nawigacji" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/" className="hover:text-brand-primary">Strona główna</Link>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-700">Częste pytania</span>
            </nav>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Poradnik</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Częste pytania o sprzedaż nieruchomości
            </h1>
            <div className="mt-4 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-600">
              Zebraliśmy pytania, które najczęściej słyszymy od klientów w Wągrowcu, Rogoźnie i okolicy: o sprzedaż po
              spadku, koszty i czas sprzedaży. Przepisy i stawki sprawdziliśmy na stan: {FAQ_UPDATED}. Każda sprawa jest
              trochę inna — jeśli nie znajdziesz tu odpowiedzi, zadzwoń:{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary hover:underline">501 769 166</a>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {FAQ_GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-brand-primary/40 hover:text-brand-primary"
                >
                  {g.title}
                </a>
              ))}
            </div>
          </section>

          {/* ── Grupy pytań ── */}
          {FAQ_GROUPS.map((g) => (
            <section
              key={g.id}
              id={g.id}
              className="scroll-mt-24 rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14"
            >
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">{g.title}</h2>
              <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
              <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">{g.intro}</p>
              <div className="mt-6 divide-y divide-zinc-100 border-y border-zinc-100">
                {g.items.map((item) => (
                  <details key={item.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-zinc-900 marker:hidden [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-xl leading-none text-brand-primary transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* ── Formularz ── */}
          <section id="kontakt" className="scroll-mt-20 rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Bezpłatna rozmowa</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl">
              Masz pytanie o swoją nieruchomość?
            </h2>
            <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
            <p className="mt-4 text-sm text-zinc-600">
              Zadzwoń na{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary hover:underline">501 769 166</a>
              {" "}lub napisz przez formularz. Pierwsza rozmowa i sprawdzenie, od czego zacząć, nic nie kosztują.
            </p>
            <ContactFormWithBoundary />
          </section>

          <HomeContactFooter />
        </div>
      </main>
    </div>
  );
}
