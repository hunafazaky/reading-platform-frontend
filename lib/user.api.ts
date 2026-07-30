import { apiFetch } from "@/lib/api";
import { User } from "@/types/user";

// ==================================================
// Get a single user's public profile by id.
// Backend route: GET /api/users/:id (public, no sign-in required)
//
// We use this right after signing in/up/refreshing, since those auth
// endpoints only return an access token — not the full user profile.
// See AuthContext.tsx for how the two are combined.
// ==================================================
export function getUserById(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}
