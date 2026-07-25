import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractWorkId(slug: string): string {
  if (!slug) return "";

  // 1. Check if slug contains or ends with a UUID (8-4-4-4-12 hex format)
  const uuidMatch = slug.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/);
  if (uuidMatch) {
    return uuidMatch[1];
  }

  // 2. Check if double hyphen '--' delimiter exists
  if (slug.includes("--")) {
    const parts = slug.split("--");
    return parts.pop() || slug;
  }

  // 3. Fallback: split with '-'
  const slugParts = slug.split("-");
  return slugParts.pop() || slug;
}

export function getWorkUrl(point: string, rawTitle?: string, id?: string) {
  const safeTitle = typeof rawTitle === "string" ? rawTitle : "";
  const cleanedTitle = safeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const safeId = id || "";
  const titlePart = cleanedTitle ? `${cleanedTitle}--` : "";
  return `/${titlePart}${safeId}/${point}`;
}
