// The backend returns errors in two slightly different shapes:
//
// 1. Validation errors (from validationMiddleware.js):
//    { success: false, message: "Data validation error.", details: [{ field, message }] }
//
// 2. Generic errors (from the error handler in server.js):
//    { success: false, statusCode, message }
//
// This type covers both, with the extra fields optional.
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
  details?: { field: string; message: string }[];
}

// Thrown by our fetch wrapper whenever the backend responds with an error.
// We extend the built-in Error so normal try/catch and error.message still work,
// but we also attach the extra info in case a component wants to show
// field-specific validation messages.
export class ApiError extends Error {
  statusCode: number;
  details?: { field: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Every paginated list endpoint in this API (works, users, bookmarks,
// ratings, history) returns this exact shape — see
// app/utils/pagination.js -> buildListResponse on the backend.
// "T" is whatever type is inside "items", e.g. PaginatedResponse<Work>.
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
