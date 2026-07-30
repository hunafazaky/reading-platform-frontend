import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import {
  Rating,
  RatingInput,
  RatingMutationResponse,
  WorkRatingsSummary,
} from "@/types/rating";

// ==================================================
// Rate a work (1-5). If you've already rated it, this updates your
// existing rating instead of creating a duplicate (the backend upserts by
// user+work — see app/models/rating.model.js's unique index).
// Backend route: POST /api/ratings (must be signed in)
// ==================================================
export function rateWork(
  input: RatingInput,
  accessToken: string,
): Promise<RatingMutationResponse> {
  return apiFetch<RatingMutationResponse>("/ratings", {
    method: "POST",
    body: input,
    accessToken,
  });
}

// ==================================================
// List the signed-in user's own ratings, newest first.
// Backend route: GET /api/ratings (must be signed in)
// ==================================================
export function getUserRatings(
  params: { page?: number; limit?: number } = {},
  accessToken: string,
): Promise<PaginatedResponse<Rating>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const queryString = searchParams.toString();

  return apiFetch<PaginatedResponse<Rating>>(
    `/ratings${queryString ? `?${queryString}` : ""}`,
    { accessToken },
  );
}

// ==================================================
// Get the average rating for a work. Public, no sign-in required.
// We only actually need "averageRating" (it's computed across ALL
// ratings, not just the current page), so we ask for the smallest
// possible page to keep the request light.
// Backend route: GET /api/ratings/work/:workId
// ==================================================
export function getWorkRatingsSummary(
  workId: string,
): Promise<PaginatedResponse<Rating> & WorkRatingsSummary> {
  return apiFetch<PaginatedResponse<Rating> & WorkRatingsSummary>(
    `/ratings/work/${workId}?limit=1`,
  );
}
