import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTreeHistory, MOCK_HISTORY, type TrendDataPoint } from '@/hooks/useTreeHistory'
import { formatShortDate } from '@/lib/formatters'
import ErrorDisplay from '@/components/ui/ErrorDisplay'

function History() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTreeHistory({ limit: 10 })

  // Combine pages into single array, using mock data if API fails or has error
  const allAnalyses = useMemo(() => {
    if (error) {
      // API failed, use mock data
      return MOCK_HISTORY.analyses
    }
    const pages = data?.pages || []
    const analyses = pages.flatMap(page => page.analyses) || []
    return analyses.length > 0 ? analyses : MOCK_HISTORY.analyses
  }, [data, error])

  // Transform data for trend chart
  const trendData = useMemo((): TrendDataPoint[] => {
    return allAnalyses
      .slice() // copy
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(entry => ({
        date: formatShortDate(entry.timestamp),
        canopyCoverage: entry.canopy_coverage_pct,
        healthy: entry.tree_health.healthy,
        needsCare: entry.tree_health.needs_care,
        needsReplacement: entry.tree_health.needs_replacement,
        treeCount: entry.total_tree_count,
      }))
  }, [allAnalyses])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Analysis History</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Analysis History</h2>

      {/* Show error only for unexpected errors (not 404s which mean no history) */}
      {error && !(error as Error).message.includes('Not found') && (
        <ErrorDisplay error={error} />
      )}

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Canopy Health Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#E5E7EB',
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      canopyCoverage: 'Canopy Coverage',
                      healthy: 'Healthy',
                      needsCare: 'Needs Care',
                      needsReplacement: 'Needs Replacement',
                    }
                    return [value, labels[name] || name]
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="canopyCoverage"
                  name="Canopy Coverage"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="healthy"
                  name="Healthy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 3 }}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="needsCare"
                  name="Needs Care"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="needsReplacement"
                  name="Needs Replacement"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 3 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Past Analyses</h3>

        {allAnalyses.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-4">📊</span>
            <p className="text-slate-600 dark:text-slate-400">
              No analyses yet
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Upload your first tree canopy image to start tracking history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allAnalyses
              .slice()
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((entry, index) => (
                <div
                  key={entry.analysis_id + index}
                  className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="text-2xl">🌳</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {entry.total_tree_count} trees • {entry.canopy_coverage_pct.toFixed(1)}% cover
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-green-600">{entry.tree_health.healthy} ✓</span>
                        <span className="text-amber-600 ml-2">{entry.tree_health.needs_care} ⚠</span>
                        <span className="text-red-600 ml-2">{entry.tree_health.needs_replacement} ✕</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}

      {/* Info Card */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Track your canopy health over time. Each analysis is stored with its
          timestamp, letting you visualize trends and correlate with weather patterns.
          The forecast at the time of each analysis is cached for reference.
        </p>
      </div>
    </div>
  )
}

export default History