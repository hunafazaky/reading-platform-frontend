"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorks } from "@/lib/work.api";
import { ApiError } from "@/types/api";
import { WorkListResult } from "@/types/work";

// GET /works has no way to filter by writer (see
// app/utils/validationSchemas.js -> workQuerySchema, which only supports
// title/categories/page/limit — an unrecognized "writer" param would be
// silently stripped out by validationMiddleware before it even reaches
// the controller). So "published" works (this user's own) can't be
// fetched or paginated on the server.
//
// Workaround: fetch the largest single page the backend allows, and
// filter/paginate it ourselves in memory.
//
// LIMITATION: if there are ever more than MAX_WORKS_TO_SCAN works across
// the whole platform, some of this user's own works could be missed
// entirely if they fall outside that batch. This is a pragmatic
// workaround, not a correct fix — the real fix is adding writer filtering
// to GET /works on the backend (or a dedicated "my works" endpoint).
const MAX_WORKS_TO_SCAN = 120; // the backend's own max page size

export function usePublishedWorks(
  params: { page?: number; limit?: number } = {},
): WorkListResult {
  const { accessToken, user } = useAuth();

  const [allOwnWorks, setAllOwnWorks] = useState<WorkListResult["works"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  const fetchPublished = useCallback(async () => {
    if (!accessToken || !user) {
      setAllOwnWorks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getWorks({ limit: MAX_WORKS_TO_SCAN }, accessToken);
      setAllOwnWorks(
        result.items.filter((work) => work.writer.id === user.id),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load your published works. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    fetchPublished();
  }, [fetchPublished]);

  // Paginate the already-filtered list ourselves, in memory, since the
  // server's pagination has no idea about our client-side filter.
  const total = allOwnWorks.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  const works = allOwnWorks.slice(start, start + limit);

  const removeWork = useCallback((id: string) => {
    setAllOwnWorks((current) => current.filter((work) => work.id !== id));
  }, []);

  return {
    works,
    pagination: { total, page, limit, totalPages },
    isLoading,
    error,
    refetch: fetchPublished,
    removeWork,
  };
}
