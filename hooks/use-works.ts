"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorks } from "@/lib/work.api";
import { ApiError } from "@/types/api";
import { Work, WorkListResult, WorkQueryParams } from "@/types/work";

// Fetches a page of works from GET /api/works.
//
// If the user is signed in, their access token is sent automatically so
// the backend can include each work's "bookmarked" status.
export function useWorks(params: WorkQueryParams = {}): WorkListResult {
  const { accessToken } = useAuth();

  const [works, setWorks] = useState<Work[]>([]);
  const [pagination, setPagination] =
    useState<WorkListResult["pagination"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pull out individual primitives from "params" for the dependency array
  // below. Passing the whole object directly would cause the effect to
  // re-run on every render, since a brand new object is created each time
  // (even with the exact same values inside it).
  const { page, limit, title, categories } = params;
  // Arrays have the same problem as objects, so we turn "categories" into
  // a single comparable string just for dependency-checking purposes.
  const categoriesKey = categories?.join(",") ?? "";

  const fetchWorks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getWorks(
        { page, limit, title, categories },
        accessToken,
      );
      setWorks(result.items);
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
          : "Failed to load works. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
    // "categories" itself is left out of the dependency array on purpose —
    // "categoriesKey" (a plain string) is used instead so this doesn't
    // re-run just because a new array instance was passed in with the
    // same values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, title, categoriesKey, accessToken]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  // Drops a work from the local list right away (e.g. after deleting it),
  // without waiting for a full refetch from the server.
  const removeWork = useCallback((id: string) => {
    setWorks((current) => current.filter((work) => work.id !== id));
  }, []);

  return { works, pagination, isLoading, error, refetch: fetchWorks, removeWork };
}
