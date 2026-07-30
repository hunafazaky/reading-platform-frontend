// The "writer" info embedded inside a Work. Note this is NOT the same as
// the full User type (types/user.ts) — the backend only sends a small
// subset of the writer's public info here, and it's slightly different
// depending on which endpoint you call:
//   - GET /works (list):      { id, pen_name, photo }
//   - GET /works/:id (single): { id, pen_name, photo, bio }
// So "bio" is marked optional here to cover both cases safely.
export interface WorkWriter {
  id: string;
  pen_name: string;
  photo: string;
  bio?: string;
}

// Only present if the work has an attached file/link (it's optional on
// the backend — see app/models/work.model.js).
export interface WorkAttachment {
  title?: string;
  link?: string;
}

// A single work, as returned by both GET /works (inside "items") and
// GET /works/:id.
export interface Work {
  id: string;
  title: string;
  body: string;
  writer: WorkWriter;
  // Optional because the backend simply omits these fields entirely from
  // the JSON when they were never set (no default value in the schema) —
  // rather than sending them as "" or null.
  cover?: string;
  attachment?: WorkAttachment;
  categories: string[];
  reader_count: number;
  rating_count: number;
  createdAt: string;
  updatedAt: string;
  // Only present when GET /works was called while signed in
  // (optionalAuthMiddleware adds this). Absent entirely on GET /works/:id
  // and on GET /works when signed out.
  bookmarked?: boolean;
}

// Filters/sorting options accepted by GET /works.
// See app/utils/validationSchemas.js -> workQuerySchema.
export interface WorkQueryParams {
  page?: number;
  limit?: number;
  title?: string;
  categories?: string[];
}

// What POST /works and PATCH /works/:id accept as a request body.
// See app/utils/validationSchemas.js -> workCreateSchema / workUpdateSchema.
export interface WorkFormInput {
  title: string;
  body: string;
  cover?: string;
  categories?: string[];
  attachment?: WorkAttachment;
}

// The "work" object returned by POST /works and PATCH /works/:id.
//
// IMPORTANT: this is NOT the same shape as the "Work" type above.
// Here, "writer" is just the writer's id as a plain string — it is NOT
// populated into a { id, pen_name, photo } object like GET /works and
// GET /works/:id return. Confirmed from real API responses.
//
// Because of this difference, we don't try to reuse this for display —
// after a successful create/update, we redirect to the work's detail page
// and let GET /works/:id fetch the properly populated version instead.
export interface WorkMutationResult {
  id: string;
  title: string;
  body: string;
  writer: string;
  cover?: string;
  attachment?: WorkAttachment;
  categories: string[];
  reader_count: number;
  rating_count: number;
  createdAt: string;
  updatedAt: string;
}

// Response shape shared by POST /works and PATCH /works/:id.
export interface WorkMutationResponse {
  message: string;
  work: WorkMutationResult;
}

// Response shape for DELETE /works/:id.
export interface DeleteWorkResponse {
  message: string;
}

// The shape returned by every "list of works" hook — useWorks (all works),
// and the bookmarked/history/published/rated variants added later. Keeping
// them all identical means any of them can be plugged into the same list
// page component (see components/work-list-section.tsx).
export interface WorkListResult {
  works: Work[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  // Re-runs the fetch from scratch.
  refetch: () => void;
  // Removes a work from the local list immediately, without waiting for a
  // refetch. Used after deleting a work (it should disappear from every
  // list showing it), and after un-bookmarking one on the Bookmarked page
  // specifically (it should disappear from THAT list, but nowhere else).
  removeWork: (id: string) => void;
}
