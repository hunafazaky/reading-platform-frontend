import { ApiError } from "@/types/api";

export interface UploadResult {
  url: string;
}

// ==================================================
// Uploads a file to Cloudflare R2 via our own /api/upload route.
//
// Note: this deliberately does NOT use lib/api.ts's apiFetch() — that
// function targets the external backend API (NEXT_PUBLIC_API_URL). This
// hits our own Next.js server instead (app/api/upload/route.ts), which
// is the only place that holds the R2 credentials.
// ==================================================
export async function uploadFile(
  file: File,
  kind: "cover" | "attachment",
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || "Upload failed. Please try again.",
      response.status,
    );
  }

  return data as UploadResult;
}
