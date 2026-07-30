"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { WorkCard } from "@/components/work-card";
import { WorkCardSkeleton } from "@/components/work-card-skeleton";
import { Button } from "@/components/ui/button";
import { WorkPagination } from "@/components/work-pagination";
import { SiteHeader } from "@/components/site-header";
import { usePageParam } from "@/hooks/use-page-param";
import { WorkListResult } from "@/types/work";

interface WorkListSectionProps {
  title: string;
  emptyMessage: string;
  // Which hook feeds this page its data — useWorks, useBookmarkedWorks,
  // useHistoryWorks, usePublishedWorks, or useRatedWorks. They all return
  // the same WorkListResult shape, so any of them works here.
  useListData: (params: { page: number; limit: number }) => WorkListResult;
  // Bookmarked/History/Published/Scored all require being signed in; the
  // all-works list on Home doesn't (it's public — sign-in just adds
  // bookmark status to each item).
  requireAuth?: boolean;
  // Only true on the Bookmarked page: un-bookmarking a work there should
  // remove its card immediately, since it no longer belongs on that page.
  // Everywhere else, un-bookmarking should just flip the icon in place.
  removeOnUnbookmark?: boolean;
}

const LIMIT = 12;

// This is the one place that handles: fetching a list, and showing the
// right state (loading / error / empty / data), plus pagination and an
// auth guard when needed. Previously, Home/Bookmarked/History/Published/
// Scored were five separate files that all still called useWorks() (all
// works) regardless of which page you were on — this component is what
// actually fixes that, alongside each page passing in its own hook below.
export function WorkListSection({
  title,
  emptyMessage,
  useListData,
  requireAuth,
  removeOnUnbookmark,
}: WorkListSectionProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = usePageParam();

  const { works, pagination, isLoading, error, refetch, removeWork } =
    useListData({ page, limit: LIMIT });

  useEffect(() => {
    if (requireAuth && !isAuthLoading && !user) {
      router.replace("/auth/signin");
    }
  }, [requireAuth, isAuthLoading, user, router]);

  // While we're still checking auth state, or about to redirect, render
  // nothing rather than flashing a page that requires sign-in.
  if (requireAuth && (isAuthLoading || !user)) {
    return null;
  }

  return (
    <>
      <SiteHeader title={title} />
      <section className="p-8">
        {/* Loading state */}
        {isLoading && (
          <section className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <WorkCardSkeleton key={index} />
            ))}
          </section>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <section className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-xl text-destructive font-bold">{error}</h3>
            <Button onClick={refetch}>Try again</Button>
          </section>
        )}

        {/* Empty state */}
        {!isLoading && !error && works.length === 0 && (
          <section className="flex justify-center">
            <h2 className="text-2xl text-muted-foreground font-bold">
              {emptyMessage}
            </h2>
          </section>
        )}

        {/* Data state */}
        {!isLoading && !error && works.length > 0 && (
          <section className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                data={work}
                isOwner={!!user && work.writer.id === user.id}
                onDeleted={() => removeWork(work.id)}
                onUnbookmarked={
                  removeOnUnbookmark ? () => removeWork(work.id) : undefined
                }
              />
            ))}
          </section>
        )}

        {pagination && (
          <WorkPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </section>
    </>
  );
}
