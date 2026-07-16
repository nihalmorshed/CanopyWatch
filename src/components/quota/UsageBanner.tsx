import { useUsage, MOCK_USAGE } from '@/hooks/useUsage'

export default function UsageBanner() {
  const { data: usage, isLoading, error } = useUsage()

  // Use mock data if API fails
  const displayUsage = usage || MOCK_USAGE
  const isDemo = !usage?.used || !usage?.limit

  const percentUsed = (displayUsage.used / displayUsage.limit) * 100
  const isLow = percentUsed > 80

  // Handle missing resets_at
  const resetDate = displayUsage.resets_at
    ? new Date(displayUsage.resets_at)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days

  if (isLoading) {
    return (
      <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
    )
  }

  if (error) {
    return null // Silently fail - not critical
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="text-sm font-medium">API Usage</span>
          {isDemo && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              Demo
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">
          Resets {resetDate.toLocaleDateString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isLow ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="flex justify-between mt-1 text-xs text-slate-500">
        <span>{displayUsage.used} / {displayUsage.limit} used</span>
        <span>{displayUsage.remaining} remaining</span>
      </div>
    </div>
  )
}