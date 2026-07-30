"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHistory } from "@/lib/history.api";
import { ApiError } from "@/types/api";
import { WorkListResult } from "@/types/work";

// Fetches the signed-in user's reading history from GET /api/history, and
// unwraps each entry down to just its "work" — same shape as useWorks(),
// so it plugs into the same list page component.
export function useHistoryWorks(
  params: { page?: number; limit?: number } = {},
): WorkListResult {
  const { accessToken } = useAuth();

  const [works, setWorks] = useState<WorkListResult["works"]>([]);
  const [pagination, setPagination] =
    useState<WorkListResult["pagination"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit } = params;

  const fetchHistory = useCallback(async () => {
    if (!accessToken) {
      setWorks([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getHistory({ page, limit }, accessToken);
      setWorks(result.items.map((entry) => entry.work));
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
          : "Failed to load your reading history. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, accessToken]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const removeWork = useCallback((id: string) => {
    setWorks((current) => current.filter((work) => work.id !== id));
  }, []);

  return {
    works,
    pagination,
    isLoading,
    error,
    refetch: fetchHistory,
    removeWork,
  };
}
