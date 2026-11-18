import type { Metadata } from "next";
import ServiceAreaPage from "@/components/city/ServiceAreaPage";
import { canonicalUrl } from "@/lib/seo/site";
import { OBORNIKI } from "@/lib/seo/serviceAreaPages";

const PAGE_URL = canonicalUrl(OBORNIKI.route);

export const metadata: Metadata = {
  title: OBORNIKI.metaTitle,
  description: OBORNIKI.metaDescription,
  alternates: { canonical: PAGE_URL },
  openGraph: { url: PAGE_URL },
};

export default function NieruchomosciObornikiPage() {
  return <ServiceAreaPage cfg={OBORNIKI} />;
}
