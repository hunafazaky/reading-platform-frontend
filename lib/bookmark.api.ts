import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Bookmark, ToggleBookmarkResponse } from "@/types/bookmark";

// ==================================================
// List the signed-in user's bookmarks.
// Backend route: GET /api/bookmarks (must be signed in)
// ==================================================
export function getBookmarks(
  params: { page?: number; limit?: number } = {},
  accessToken: string,
): Promise<PaginatedResponse<Bookmark>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const queryString = searchParams.toString();

  return apiFetch<PaginatedResponse<Bookmark>>(
    `/bookmarks${queryString ? `?${queryString}` : ""}`,
    { accessToken },
  );
}

// ==================================================
// Add or remove a bookmark for a work — whichever applies. The backend
// decides which one happens; we don't tell it which.
// Backend route: POST /api/bookmarks/toggle/:workId (must be signed in)
// ==================================================
export function toggleBookmark(
  workId: string,
  accessToken: string,
): Promise<ToggleBookmarkResponse> {
  return apiFetch<ToggleBookmarkResponse>(`/bookmarks/toggle/${workId}`, {
    method: "POST",
    accessToken,
  });
}
