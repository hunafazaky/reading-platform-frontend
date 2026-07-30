"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookmarks } from "@/lib/bookmark.api";
import { ApiError } from "@/types/api";
import { WorkListResult } from "@/types/work";

// Fetches the signed-in user's bookmarked works from GET /api/bookmarks,
// and unwraps each Bookmark record down to just its "work" — so this hook
// returns the same shape as useWorks(), and can be used interchangeably
// with it (see components/work-list-section.tsx).
export function useBookmarkedWorks(
  params: { page?: number; limit?: number } = {},
): WorkListResult {
  const { accessToken } = useAuth();

  const [works, setWorks] = useState<WorkListResult["works"]>([]);
  const [pagination, setPagination] =
    useState<WorkListResult["pagination"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit } = params;

  const fetchBookmarks = useCallback(async () => {
    if (!accessToken) {
      // Bookmarks require being signed in — the page itself should
      // redirect before this ever matters, but we guard here too rather
      // than send a request that's guaranteed to fail.
      setWorks([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getBookmarks({ page, limit }, accessToken);
      // Every item on this page is bookmarked by definition, so we can
      // set that explicitly rather than depending on the "work" object
      // itself having a "bookmarked" field (which isn't confirmed here —
      // see types/bookmark.ts).
      setWorks(result.items.map((bookmark) => ({ ...bookmark.work, bookmarked: true })));
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load your bookmarks. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, accessToken]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const removeWork = useCallback((id: string) => {
    setWorks((current) => current.filter((work) => work.id !== id));
  }, []);

  return {
    works,
    pagination,
    isLoading,
    error,
    refetch: fetchBookmarks,
    removeWork,
  };
}
