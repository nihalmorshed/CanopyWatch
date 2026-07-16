export type ApiErrorCode =
  | 'UNAUTHORIZED'      // 401 - bad/revoked key
  | 'FORBIDDEN'         // 403 - plan doesn't include feature
  | 'RATE_LIMITED'      // 429 - quota exceeded
  | 'BAD_REQUEST'       // 400 - invalid request
  | 'SERVER_ERROR'      // 500 - server error
  | 'SERVICE_UNAVAILABLE' // 503 - upstream down
  | 'TIMEOUT'           // 0 - request timed out
  | 'NETWORK_ERROR'     // 0 - network error
  | 'UNKNOWN'           // catch-all

export interface ApiError {
  status: number
  message: string
  code?: ApiErrorCode
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

// Map status codes to user-friendly messages per §5
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  UNAUTHORIZED: 'Service unavailable. Please contact support.',
  FORBIDDEN: 'Access denied. This feature may require a paid plan.',
  RATE_LIMITED: 'Rate limit exceeded. Please try again later.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  SERVER_ERROR: 'Server error. Please try again.',
  SERVICE_UNAVAILABLE: 'Weather service is temporarily down. Try again shortly.',
  TIMEOUT: 'Request timed out. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN: 'An unexpected error occurred.',
}

export function getErrorMessage(error: ApiError): string {
  return error.code ? ERROR_MESSAGES[error.code] : error.message
}