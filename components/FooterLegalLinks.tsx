import Link from "next/link";

export default function FooterLegalLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-white/45">
      <Link
        href="/czeste-pytania/"
        className="font-medium text-white/60 underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-white"
      >
        Częste pytania
      </Link>
      <Link
        href="/polityka-prywatnosci/"
        className="font-medium text-white/60 underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-white"
      >
        Polityka prywatności
      </Link>
    </div>
  );
}
