import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/apiClient'

export interface UsageResponse {
  plan: string
  used: number
  limit: number
  remaining: number
  unlimited: boolean
  resets_at?: string
}

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: async (): Promise<UsageResponse> => {
      return apiGet<UsageResponse>('/api/usage')
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

// Mock for development
export const MOCK_USAGE: UsageResponse = {
  plan: 'free',
  used: 42,
  limit: 1000,
  remaining: 958,
  unlimited: false,
  resets_at: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
}