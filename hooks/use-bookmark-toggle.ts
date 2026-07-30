"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toggleBookmark } from "@/lib/bookmark.api";
import { ApiError } from "@/types/api";

interface UseBookmarkToggleResult {
  bookmarked: boolean;
  isToggling: boolean;
  error: string | null;
  toggle: () => void;
}

// Optimistic update: flips "bookmarked" the instant you click, before the
// server has actually responded, then quietly undoes the flip if the
// request turns out to have failed. This is what makes the bookmark icon
// feel instant instead of waiting on a network round trip.
//
// "onToggled" fires only after a *successful* toggle, with the new state.
// It's used by the Bookmarked page to remove a work from its own list the
// moment it's un-bookmarked, without needing to refetch the whole list.
export function useBookmarkToggle(
  workId: string,
  initialBookmarked: boolean,
  onToggled?: (bookmarked: boolean) => void,
): UseBookmarkToggleResult {
  const { accessToken } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the underlying data changes from outside (e.g. this work's bookmark
  // status changed elsewhere and the list refetched), stay in sync —
  // unless we're in the middle of our own toggle, which already reflects
  // the latest intent.
  useEffect(() => {
    if (!isToggling) {
      setBookmarked(initialBookmarked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workId, initialBookmarked]);

  async function toggle() {
    if (!accessToken || isToggling) return;

    const nextBookmarked = !bookmarked;

    // 1. Update the UI right away, before we know the request will succeed.
    setBookmarked(nextBookmarked);
    setError(null);
    setIsToggling(true);

    try {
      await toggleBookmark(workId, accessToken);
      // 2a. Success — the optimistic update was correct. Let the caller
      //     know in case it needs to react (e.g. remove this card).
      onToggled?.(nextBookmarked);
    } catch (err) {
      // 2b. Failure — undo the optimistic update so the UI matches reality.
      setBookmarked(!nextBookmarked);
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to update bookmark. Please try again.",
      );
    } finally {
      setIsToggling(false);
    }
  }

  return { bookmarked, isToggling, error, toggle };
}
