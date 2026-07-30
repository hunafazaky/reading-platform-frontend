"use client";

import { Suspense } from "react";
import { WorkListSection } from "@/components/work-list-section";
import { SiteLoader } from "@/components/site-loader";
import { useHistoryWorks } from "@/hooks/use-history-works";

export default function HistoryPage() {
  return (
    <Suspense fallback={<SiteLoader />}>
      <WorkListSection
        title="History"
        emptyMessage="You haven't read anything yet."
        useListData={useHistoryWorks}
        requireAuth
      />
    </Suspense>
  );
}
