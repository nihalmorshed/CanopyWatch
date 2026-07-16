import { useState } from 'react'
import type { ApiError, ApiErrorCode } from '@/types/api'
import { getErrorMessage } from '@/types/api'

interface ErrorDisplayProps {
  error: ApiError | Error | string | null
  onRetry?: () => void
}

function getErrorCode(error: ApiError | Error | string): ApiErrorCode {
  if (typeof error === 'string') return 'UNKNOWN'
  if ('code' in error && error.code) return error.code as ApiErrorCode
  if ('status' in error) {
    const status = error.status
    if (status === 401) return 'UNAUTHORIZED'
    if (status === 403) return 'FORBIDDEN'
    if (status === 429) return 'RATE_LIMITED'
    if (status === 400) return 'BAD_REQUEST'
    if (status === 500) return 'SERVER_ERROR'
    if (status === 503) return 'SERVICE_UNAVAILABLE'
  }
  if ('message' in error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('timeout')) return 'TIMEOUT'
    if (msg.includes('network') || msg.includes('fetch')) return 'NETWORK_ERROR'
  }
  return 'UNKNOWN'
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  if (!error) return null

  const code = getErrorCode(error as ApiError | Error | string)
  const message = getErrorMessage(error as ApiError)

  // Styles based on error type
  const styles: Record<ApiErrorCode, { bg: string; border: string; icon: string }> = {
    UNAUTHORIZED: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200', icon: '🔒' },
    FORBIDDEN: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200', icon: '🚫' },
    RATE_LIMITED: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200', icon: '⏳' },
    BAD_REQUEST: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200', icon: '⚠️' },
    SERVER_ERROR: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200', icon: '💥' },
    SERVICE_UNAVAILABLE: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200', icon: '🔧' },
    TIMEOUT: { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200', icon: '⏱️' },
    NETWORK_ERROR: { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200', icon: '📡' },
    UNKNOWN: { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200', icon: '❓' },
  }

  const style = styles[code]

  const handleRetry = async () => {
    if (!onRetry) return
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{style.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {message}
          </p>
          {code === 'RATE_LIMITED' && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Too many requests. Please wait a moment before trying again.
            </p>
          )}
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="mt-3 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm rounded-lg transition-colors"
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}