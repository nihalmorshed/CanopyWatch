import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/apiClient'
import type { TreeHistoryEntry } from '@/types/trees'
import type { WeatherResponse } from '@/types/weather'

interface TreeHistoryResponse {
  analyses: TreeHistoryEntry[]
  next_cursor?: string
  has_more: boolean
}

/**
 * Get paginated tree history
 */
export function useTreeHistory(options: { limit?: number } = {}) {
  const { limit = 10 } = options

  return useInfiniteQuery({
    queryKey: ['treeHistory', limit],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: String(limit),
      })
      if (pageParam) {
        params.append('cursor', pageParam)
      }
      return apiGet<TreeHistoryResponse>(`/api/trees/history?${params}`)
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.next_cursor : undefined,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Get cached forecast for a specific analysis
 * The forecast is cached at analysis time to avoid re-fetching historical weather
 */
export function getCachedForecast(analysisId: string): WeatherResponse | null {
  try {
    const cached = localStorage.getItem(`forecast_${analysisId}`)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

/**
 * Cache the current forecast when an analysis is performed
 */
export function cacheForecast(analysisId: string, forecast: WeatherResponse): void {
  try {
    localStorage.setItem(`forecast_${analysisId}`, JSON.stringify(forecast))
  } catch {
    // Ignore storage errors (quota, private browsing)
  }
}

/**
 * Get all cached forecasts for history view
 */
export function getAllCachedForecasts(analysisIds: string[]): Record<string, WeatherResponse> {
  const forecasts: Record<string, WeatherResponse> = {}
  for (const id of analysisIds) {
    const forecast = getCachedForecast(id)
    if (forecast) {
      forecasts[id] = forecast
    }
  }
  return forecasts
}

// Mock data for development with more entries for trend chart
export const MOCK_HISTORY: TreeHistoryResponse = {
  analyses: [
    {
      analysis_id: 'hist_001',
      timestamp: '2026-07-10T10:30:00Z',
      total_tree_count: 120,
      canopy_coverage_pct: 65.2,
      tree_health: { healthy: 95, needs_care: 18, needs_replacement: 7 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_002',
      timestamp: '2026-07-03T14:15:00Z',
      total_tree_count: 118,
      canopy_coverage_pct: 63.8,
      tree_health: { healthy: 90, needs_care: 20, needs_replacement: 8 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_003',
      timestamp: '2026-06-25T09:00:00Z',
      total_tree_count: 115,
      canopy_coverage_pct: 62.1,
      tree_health: { healthy: 88, needs_care: 19, needs_replacement: 8 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_004',
      timestamp: '2026-06-15T11:00:00Z',
      total_tree_count: 112,
      canopy_coverage_pct: 60.5,
      tree_health: { healthy: 85, needs_care: 20, needs_replacement: 7 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_005',
      timestamp: '2026-06-05T10:00:00Z',
      total_tree_count: 110,
      canopy_coverage_pct: 58.2,
      tree_health: { healthy: 82, needs_care: 21, needs_replacement: 7 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_006',
      timestamp: '2026-05-25T09:30:00Z',
      total_tree_count: 108,
      canopy_coverage_pct: 56.8,
      tree_health: { healthy: 80, needs_care: 22, needs_replacement: 6 },
      location: 'Kenyatta Avenue',
    },
    {
      analysis_id: 'hist_007',
      timestamp: '2026-05-15T14:00:00Z',
      total_tree_count: 105,
      canopy_coverage_pct: 55.1,
      tree_health: { healthy: 78, needs_care: 21, needs_replacement: 6 },
      location: 'Kenyatta Avenue',
    },
  ],
  has_more: false,
}

// Type for trend chart data
export interface TrendDataPoint {
  date: string
  canopyCoverage: number
  healthy: number
  needsCare: number
  needsReplacement: number
  treeCount: number
}