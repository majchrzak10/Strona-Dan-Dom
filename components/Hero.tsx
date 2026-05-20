/**
 * Hero
 * - Mobile: duotone zespołu (pełny kadr 3:2) zlewa się gradientem z bordowym tłem,
 *   pod spodem duży nagłówek (Playfair) + CTA.
 * - Desktop (md+): szeroki baner 16/7 ze zdjęciem zespołu — bez zmian.
 */
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* ===== MOBILE — duotone u góry + wielki nagłówek ===== */}
      <section className="bg-[#800020] md:hidden">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src="/hero-zespol-duotone.jpg"
            alt="Zespół Dan-Dom Nieruchomości"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          {/* dół zdjęcia rozpływa się w bordowe tło — ten sam kolor, bez twardej linii */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(128,0,32,0.6)_82%,#800020_100%)]" />
        </div>

        <div className="flex flex-col gap-4 px-6 pb-9 pt-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/65">
            Biuro Nieruchomości · od 1996
          </p>
          <h1 className="font-[var(--font-playfair)] text-[2.1rem] font-extrabold leading-[1.08] text-white">
            Nieruchomości w Wągrowcu i Rogoźnie
          </h1>
          <span aria-hidden="true" className="h-[3px] w-11 rounded-sm bg-[#F6F1E9]" />
          <p className="text-[0.9rem] font-light leading-relaxed text-white/85">
            Kompleksowa obsługa sprzedaży, zakupu i wynajmu nieruchomości.
          </p>
          <Link
            href="/#oferty"
            className="mt-1 inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold uppercase tracking-wide text-[#800020] shadow-sm transition-colors hover:bg-[#F6F1E9] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#800020] active:scale-[0.99]"
            aria-label="Przejdź do listy nieruchomości — najnowsze oferty"
          >
            Zobacz najnowsze oferty
            <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== DESKTOP (md+) — dotychczasowy baner, bez zmian ===== */}
      <section className="relative hidden overflow-hidden bg-[#2f0811] md:block">
        {/* Warstwa obrazu: na md+ szeroki baner 16/7 */}
        <div className="relative w-full md:aspect-[16/7]">
          <Image
            src="/hero-biuro.jpg"
            alt="Zespół Dan-Dom Nieruchomości"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/35 to-transparent" />
        </div>

        {/* Treść — oddech od nawigacji */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-start justify-start">
          <div
            className="pointer-events-auto flex w-full flex-col items-start justify-start px-[max(1rem,env(safe-area-inset-left))] pt-[max(4rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 md:pt-20"
          >
            <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,28rem)] flex-col items-center text-center pb-8 md:pb-12">
              <p className="text-[clamp(0.625rem,2.5vw,0.6875rem)] font-semibold uppercase tracking-[0.25em] text-white/70">
                Biuro Nieruchomości · od 1996 roku
              </p>

              <h1 className="mt-3 max-w-sm text-[clamp(0.8125rem,2.8vw,0.9375rem)] leading-relaxed text-white/80 drop-shadow-sm md:max-w-md">
                Kompleksowa obsługa sprzedaży, zakupu i wynajmu nieruchomości w Wągrowcu i Rogoźnie.
              </h1>

              <div className="mt-4 flex justify-center">
                <Link
                  href="/#oferty"
                  className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-[1px] transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f0811] active:scale-[0.98]"
                  aria-label="Przejdź do listy nieruchomości — najnowsze oferty"
                >
                  Zobacz najnowsze oferty
                  <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
