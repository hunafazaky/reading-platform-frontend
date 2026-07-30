"use client";

import { Suspense } from "react";
import { WorkListSection } from "@/components/work-list-section";
import { SiteLoader } from "@/components/site-loader";
import { useWorks } from "@/hooks/use-works";

// Public list of all works — signing in just adds bookmark status to
// each card, it isn't required to view this page.
export default function HomePage() {
  return (
    <Suspense fallback={<SiteLoader />}>
      <WorkListSection
        title="Home"
        emptyMessage="No works found"
        useListData={useWorks}
      />
    </Suspense>
  );
}
