import { Work } from "@/types/work";

// A single rating, as returned inside GET /ratings' "items" array (the
// signed-in user's own ratings).
//
// ASSUMPTION (not confirmed against a real response — same caveat as
// types/bookmark.ts and types/history.ts): "work" is populated into the
// full Work shape.
export interface Rating {
  id: string;
  work: Work;
  score: number;
  createdAt: string;
  updatedAt: string;
}

// What POST /ratings accepts.
export interface RatingInput {
  workId: string;
  score: number;
}

// Response shape for POST /ratings. Not confirmed against a real
// response — assumed to follow the same { message } pattern the other
// mutation endpoints use.
export interface RatingMutationResponse {
  message: string;
}

// The extra fields GET /ratings/work/:workId adds on top of the normal
// paginated list shape — confirmed from app/docs/rating.docs.js.
export interface WorkRatingsSummary {
  averageRating: number;
}
