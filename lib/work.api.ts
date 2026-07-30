import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import {
  DeleteWorkResponse,
  Work,
  WorkFormInput,
  WorkMutationResponse,
  WorkQueryParams,
} from "@/types/work";

// ==================================================
// Turn a WorkQueryParams object into a query string like
// "?page=2&limit=12&title=fiction&categories=fiction&categories=poetry"
//
// Kept as its own small function so it's easy to test/read on its own,
// separate from the actual fetch call below.
// ==================================================
function buildWorksQueryString(params: WorkQueryParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.title) searchParams.set("title", params.title);

  // categories can be filtered by more than one value at once, so each
  // one gets its own "categories=" entry in the query string.
  if (params.categories) {
    for (const category of params.categories) {
      searchParams.append("categories", category);
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// ==================================================
// List works, with optional pagination/filtering.
// Backend route: GET /api/works (public, optional auth)
//
// Passing an accessToken is optional. If provided, the backend includes
// a "bookmarked" field on each work showing whether the signed-in user
// has bookmarked it.
// ==================================================
export function getWorks(
  params?: WorkQueryParams,
  accessToken?: string | null,
): Promise<PaginatedResponse<Work>> {
  const queryString = buildWorksQueryString(params);
  return apiFetch<PaginatedResponse<Work>>(`/works${queryString}`, {
    accessToken,
  });
}

// ==================================================
// Get a single work by id.
// Backend route: GET /api/works/:id (public, optional auth)
//
// Note: calling this also increments the work's reader_count on the
// backend, and (if signed in) records reading history — that's normal
// backend behavior triggered just by viewing the work, not something we
// need to handle here.
// ==================================================
export function getWorkById(
  id: string,
  accessToken?: string | null,
): Promise<Work> {
  return apiFetch<Work>(`/works/${id}`, { accessToken });
}

// ==================================================
// Create a new work.
// Backend route: POST /api/works (must be signed in)
// ==================================================
export function createWork(
  input: WorkFormInput,
  accessToken: string,
): Promise<WorkMutationResponse> {
  return apiFetch<WorkMutationResponse>("/works", {
    method: "POST",
    body: input,
    accessToken,
  });
}

// ==================================================
// Update a work you own. Only send the fields that changed — the backend
// only requires at least one field to be present.
// Backend route: PATCH /api/works/:id (must be signed in AND own the work)
// ==================================================
export function updateWork(
  id: string,
  input: Partial<WorkFormInput>,
  accessToken: string,
): Promise<WorkMutationResponse> {
  return apiFetch<WorkMutationResponse>(`/works/${id}`, {
    method: "PATCH",
    body: input,
    accessToken,
  });
}

// ==================================================
// Delete a work you own, along with its bookmarks, ratings, and history.
// Backend route: DELETE /api/works/:id (must be signed in AND own the work)
// ==================================================
export function deleteWork(
  id: string,
  accessToken: string,
): Promise<DeleteWorkResponse> {
  return apiFetch<DeleteWorkResponse>(`/works/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
