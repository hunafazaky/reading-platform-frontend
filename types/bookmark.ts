import { Work } from "@/types/work";

// A single bookmark, as returned inside GET /bookmarks' "items" array.
//
// ASSUMPTION (not confirmed against a real API response, unlike the Work
// types): the backend populates "work" into the full Work shape, the same
// way GET /works does. If that turns out to be wrong (e.g. "work" is just
// an id string), this is the one place to fix — see
// lib/bookmark.api.ts / hooks/use-bookmarked-works.ts, which both build on
// this type.
export interface Bookmark {
  id: string;
  work: Work;
  createdAt: string;
  updatedAt: string;
}

// Response shape for POST /bookmarks/toggle/:workId.
// The docs only describe the status codes (201 = added, 200 = removed),
// not the response body — we don't actually rely on its contents, only
// whether the request succeeded or failed, so this is left loose on purpose.
export interface ToggleBookmarkResponse {
  message: string;
}
