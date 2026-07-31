// The complete list of categories a work can be tagged with. Users pick
// from this list only — there's no way to type in a custom category (see
// components/category-select.tsx). To add or remove a category, this is
// the only place to change.
//
// This is a placeholder list based on categories seen in example data —
// replace it with your actual taxonomy.
export const CATEGORIES = [
  "fiction",
  "non-fiction",
  "poetry",
  "fantasy",
  "adventure",
  "mystery",
  "romance",
  "horror",
  "sci-fi",
  "essay",
  "opinion",
  "article",
  "biography",
  "history",
] as const;

export type Category = (typeof CATEGORIES)[number];
