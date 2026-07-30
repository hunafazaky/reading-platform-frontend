"use client";

import { Suspense } from "react";
import { WorkListSection } from "@/components/work-list-section";
import { SiteLoader } from "@/components/site-loader";
import { usePublishedWorks } from "@/hooks/use-published-works";

// Note: "published" (this user's own works) is filtered client-side —
// see hooks/use-published-works.ts for why, and its limitations.
export default function PublishedPage() {
  return (
    <Suspense fallback={<SiteLoader />}>
      <WorkListSection
        title="Published"
        emptyMessage="You haven't published anything yet."
        useListData={usePublishedWorks}
        requireAuth
      />
    </Suspense>
  );
}
