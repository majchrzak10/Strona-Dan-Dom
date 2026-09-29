"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/client/analytics";

/** First load is already a page_view from gtag config. Later client navigations are not. */
export default function GaRouteTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === null || lastPath.current === pathname) {
      lastPath.current = pathname;
      return;
    }
    lastPath.current = pathname;
    const timer = window.setTimeout(() => {
      trackEvent("page_view", {
        send_to: gaId,
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 200);
    return () => window.clearTimeout(timer);
  }, [gaId, pathname]);

  return null;
}
