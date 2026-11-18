import type { Metadata } from "next";
import ServiceAreaPage from "@/components/city/ServiceAreaPage";
import { canonicalUrl } from "@/lib/seo/site";
import { SKOKI } from "@/lib/seo/serviceAreaPages";

const PAGE_URL = canonicalUrl(SKOKI.route);

export const metadata: Metadata = {
  title: SKOKI.metaTitle,
  description: SKOKI.metaDescription,
  alternates: { canonical: PAGE_URL },
  openGraph: { url: PAGE_URL },
};

export default function NieruchomosciSkokiPage() {
  return <ServiceAreaPage cfg={SKOKI} />;
}
