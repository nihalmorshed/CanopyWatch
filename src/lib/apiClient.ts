import type { ApiError } from '@/types/api'

interface FetchOptions extends RequestInit {
  timeout?: number
}

const DEFAULT_TIMEOUT = 10000

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle API errors per §5
    if (response.status === 401) {
      throw {
        status: 401,
        message: 'Service unavailable. Please contact support.',
        code: 'UNAUTHORIZED',
      } as ApiError
    }

    if (response.status === 403) {
      throw {
        status: 403,
        message: 'Access denied. This feature may require a paid plan.',
        code: 'FORBIDDEN',
      } as ApiError
    }

    if (response.status === 429) {
      // Could parse resetHeader for more precise retry timing
      // const resetHeader = response.headers.get('X-RateLimit-Reset')
      throw {
        status: 429,
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMITED',
      } as ApiError
    }

    if (response.status === 400) {
      const data = await response.json().catch(() => ({}))
      throw {
        status: 400,
        message: data.error || 'Invalid request',
        code: 'BAD_REQUEST',
      } as ApiError
    }

    if (response.status === 500) {
      throw {
        status: 500,
        message: 'Server error. Please try again.',
        code: 'SERVER_ERROR',
      } as ApiError
    }

    if (response.status === 503) {
      throw {
        status: 503,
        message: 'Weather service is temporarily down. Try again shortly.',
        code: 'SERVICE_UNAVAILABLE',
      } as ApiError
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: 'An unexpected error occurred',
        code: 'UNKNOWN',
      } as ApiError
    }

    return response.json() as Promise<T>
  } catch (error) {
    clearTimeout(timeoutId)

    if ((error as ApiError).code) {
      throw error
    }

    if ((error as Error).name === 'AbortError') {
      throw {
        status: 0,
        message: 'Request timed out',
        code: 'TIMEOUT',
      } as ApiError
    }

    throw {
      status: 0,
      message: (error as Error).message || 'Network error',
      code: 'NETWORK_ERROR',
    } as ApiError
  }
}

// Helper for GET requests
export function apiGet<T>(url: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(url, { ...options, method: 'GET' })
}

// Helper for POST requests
export function apiPost<T>(
  url: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: body ? JSON.stringify(body) : undefined,
  })
}