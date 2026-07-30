import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { HistoryEntry } from "@/types/history";

// ==================================================
// List the signed-in user's reading history, most recently read first.
// Backend route: GET /api/history (must be signed in)
//
// Note: a history entry is created/updated automatically just by viewing
// a work (see GET /works/:id on the backend) — there's no separate
// "mark as read" action anywhere in this app.
// ==================================================
export function getHistory(
  params: { page?: number; limit?: number } = {},
  accessToken: string,
): Promise<PaginatedResponse<HistoryEntry>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const queryString = searchParams.toString();

  return apiFetch<PaginatedResponse<HistoryEntry>>(
    `/history${queryString ? `?${queryString}` : ""}`,
    { accessToken },
  );
}
