interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700'
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

// Pre-built skeleton components for common patterns
export function WeatherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
      <Skeleton className="h-4 w-1/4 mx-auto" />
      <div className="flex justify-center gap-4">
        <Skeleton variant="circular" width={96} height={96} />
        <div className="space-y-2">
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  )
}

export function ForecastStripSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-20 flex-shrink-0" />
        ))}
      </div>
    </div>
  )
}

export function AnalysisResultSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-32" />
    </div>
  )
}

export function HistoryListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}