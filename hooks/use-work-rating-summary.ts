"use client";

import { useState, useEffect, useCallback } from "react";
import { getWorkRatingsSummary } from "@/lib/rating.api";

interface UseWorkRatingSummaryResult {
  averageRating: number | null;
  isLoading: boolean;
  refetch: () => void;
}

// Fetches just the average rating for a work. GET /ratings/work/:id is
// technically a paginated list of individual ratings — we only care about
// its "averageRating" field, so this is intentionally a small, separate
// hook rather than something bolted onto useWork().
//
// Deliberately does NOT call useWork()'s refetch after a new rating is
// submitted: GET /works/:id increments reader_count as a side effect on
// the backend (see hooks/use-work.ts), so re-fetching the work just to
// refresh its rating would incorrectly count as an extra "view". This
// hook's own refetch only hits the ratings endpoint, which has no such
// side effect.
export function useWorkRatingSummary(workId: string): UseWorkRatingSummaryResult {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getWorkRatingsSummary(workId);
      setAverageRating(result.averageRating);
    } catch {
      // This is a "nice to have" number, not something worth showing a
      // full error state for — if it fails, we just don't display it.
      setAverageRating(null);
    } finally {
      setIsLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    fetchSummary(); // error in this line, also happened in other codes with similar situation
  }, [fetchSummary]);

  return { averageRating, isLoading, refetch: fetchSummary };
}
