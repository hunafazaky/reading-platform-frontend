"use client";

import { Suspense } from "react";
import { WorkListSection } from "@/components/work-list-section";
import { SiteLoader } from "@/components/site-loader";
import { useBookmarkedWorks } from "@/hooks/use-bookmarked-works";

export default function BookmarkedPage() {
  return (
    <Suspense fallback={<SiteLoader />}>
      <WorkListSection
        title="Bookmarked"
        emptyMessage="You haven't bookmarked anything yet."
        useListData={useBookmarkedWorks}
        requireAuth
        removeOnUnbookmark
      />
    </Suspense>
  );
}
