import { ApiError, ApiErrorResponse } from "@/types/api";

// Base URL comes from an environment variable so it's easy to change
// between local development and production without touching the code.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // This only throws during development if someone forgets to set up .env.local.
  // It's better to fail loudly here than to get confusing "fetch failed" errors later.
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Copy .env.local.example to .env.local and fill it in.",
  );
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  // The request body, as a plain JS object. We stringify it for you.
  body?: unknown;
  // The current access token, if the user is signed in and this route needs auth.
  accessToken?: string | null;
}

// A single helper function used for every request to the backend.
//
// It takes care of:
// - Building the full URL (API_URL + path)
// - Sending cookies (needed for the refresh token cookie)
// - Setting JSON headers and stringifying the body
// - Attaching the "Authorization: Bearer <token>" header when we have one
// - Reading the JSON response
// - Throwing a typed ApiError when the response is not ok (status >= 400)
export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, accessToken } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    // "include" tells the browser to send/receive cookies even though
    // the frontend and backend are on different origins. This is required
    // for the HttpOnly refresh token cookie to work.
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // The backend always returns JSON, even for errors, so we can safely parse it.
  // (If parsing fails, something is very wrong — e.g. the API is down — and we
  // let that error bubble up naturally.)
  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new ApiError(
      errorData.message || "Something went wrong. Please try again.",
      response.status,
      errorData.details,
    );
  }

  return data as TResponse;
}
