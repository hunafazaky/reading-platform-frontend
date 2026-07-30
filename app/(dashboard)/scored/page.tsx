"use client";

import { Suspense } from "react";
import { WorkListSection } from "@/components/work-list-section";
import { SiteLoader } from "@/components/site-loader";
import { useRatedWorks } from "@/hooks/use-rated-works";

export default function ScoredPage() {
  return (
    <Suspense fallback={<SiteLoader />}>
      <WorkListSection
        title="Scored"
        emptyMessage="You haven't rated anything yet."
        useListData={useRatedWorks}
        requireAuth
      />
    </Suspense>
  );
}
