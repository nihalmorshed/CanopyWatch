import { useUsage, MOCK_USAGE } from '@/hooks/useUsage'

export default function UsageBanner() {
  const { data: usage, isLoading, error } = useUsage()

  // Use mock data if API fails
  const displayUsage = usage || MOCK_USAGE

  const percentUsed = (displayUsage.used / displayUsage.limit) * 100
  const isLow = percentUsed > 80
  const isCritical = percentUsed > 95

  // Handle missing resets_at
  const resetDate = displayUsage.resets_at
    ? new Date(displayUsage.resets_at)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  if (isLoading) {
    return (
      <div className="h-16 bg-[#F5F0D6] dark:bg-[#283618] rounded-xl animate-pulse" />
    )
  }

  if (error) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-[#283618] rounded-xl p-4 shadow-sm ${isCritical ? 'border-2 border-red-400' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.75c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.75A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.75c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span className="text-sm font-semibold text-[#1B4332] dark:text-[#FEFAE0]">
            API Usage
          </span>
        </div>
        <span className="text-xs text-[#78716C]">
          Resets {resetDate.toLocaleDateString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[#E8E2C9] dark:bg-[#3A4A22] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${Math.min(percentUsed, 100)}%`,
            backgroundColor: isCritical ? '#DC2626' : isLow ? '#F59E0B' : '#2D6A4F'
          }}
        />
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className="text-[#44403C] dark:text-[#E7E5E4] font-medium">
          {displayUsage.used.toLocaleString()} / {displayUsage.limit.toLocaleString()} used
        </span>
        <span className="font-medium" style={{ color: isCritical ? '#DC2626' : isLow ? '#F59E0B' : '#2D6A4F' }}>
          {displayUsage.remaining.toLocaleString()} remaining
        </span>
      </div>
    </div>
  )
}