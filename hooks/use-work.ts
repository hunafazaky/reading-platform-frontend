"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorkById } from "@/lib/work.api";
import { ApiError } from "@/types/api";
import { Work } from "@/types/work";

interface UseWorkResult {
  work: Work | null;
  isLoading: boolean;
  error: string | null;
  // Re-fetches this work from the server.
  refetch: () => void;
  // Lets a later step (e.g. after a successful edit) update the work in
  // place, without needing a full refetch. Exposed here so this hook
  // doesn't need to change when that feature is added.
  setWork: (work: Work) => void;
}

// Fetches a single work from GET /api/works/:id.
//
// Note: calling this endpoint also increments the work's reader_count
// and (if signed in) records reading history on the backend — that
// happens automatically as a side effect of viewing the work.
export function useWork(id: string): UseWorkResult {
  const { accessToken } = useAuth();

  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWork = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getWorkById(id, accessToken);
      setWork(result);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load this work. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, accessToken]);

  // Remembers which (id, accessToken) pair we've already auto-fetched, so
  // React Strict Mode's dev-only "mount, cleanup, mount again" behavior
  // doesn't fire this request twice. That matters here specifically
  // because this GET request isn't side-effect-free — the backend
  // increments reader_count on every call.
  //
  // accessToken is part of the key (not just id) so that signing in while
  // already viewing a work still triggers a real refetch — the backend
  // only records reading history when a token is sent. (This guard only
  // affects the automatic fetch-on-mount below; calling refetch()
  // manually, e.g. from a "Try again" button, always fetches for real.)
  const autoFetchedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchKey = `${id}:${accessToken ?? ""}`;
    if (autoFetchedKeyRef.current === fetchKey) return;
    autoFetchedKeyRef.current = fetchKey;
    fetchWork();
  }, [id, accessToken, fetchWork]);

  return { work, isLoading, error, refetch: fetchWork, setWork };
}
