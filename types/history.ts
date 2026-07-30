import { Work } from "@/types/work";

// A single reading-history entry, as returned inside GET /history's
// "items" array.
//
// ASSUMPTION (not confirmed against a real API response — same caveat as
// types/bookmark.ts): "work" is populated into the full Work shape.
export interface HistoryEntry {
  id: string;
  work: Work;
  last_read_at: string;
  createdAt: string;
  updatedAt: string;
}
