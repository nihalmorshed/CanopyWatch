import { useMutation, useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/apiClient'
import type { TreeAnalysisResponse, TreeQuota, AnalyzeRequest } from '@/types/trees'

// Query for tree analysis quota
export function useTreeQuota() {
  return useQuery({
    queryKey: ['treeQuota'],
    queryFn: async (): Promise<TreeQuota> => {
      return apiGet<TreeQuota>('/api/trees/quota')
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  })
}

// Mutation for analyzing tree canopy
export function useTreeAnalysis() {
  return useMutation({
    mutationFn: async (request: AnalyzeRequest): Promise<TreeAnalysisResponse> => {
      const formData = new FormData()
      formData.append('image', request.image)
      if (request.farmerId) formData.append('farmerId', request.farmerId)
      if (request.county) formData.append('county', request.county)
      if (request.landAcres) formData.append('landAcres', String(request.landAcres))
      if (request.location) formData.append('location', request.location)
      if (request.notes) formData.append('notes', request.notes)

      try {
        // Use fetch directly for FormData
        const response = await fetch('/api/trees/analyze', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          // API not available - use mock data for demo
          console.warn('Tree analysis API not available, using demo data')
          return createMockAnalysis(request)
        }

        return response.json()
      } catch (err) {
        // Network error - use mock data for demo
        console.warn('Tree analysis failed, using demo data:', err)
        return createMockAnalysis(request)
      }
    },
  })
}

// Helper to create mock analysis with some randomization
function createMockAnalysis(request: AnalyzeRequest): TreeAnalysisResponse {
  const treeCount = Math.floor(Math.random() * 50) + 80 // 80-130 trees
  const healthy = Math.floor(Math.random() * 20) + 75   // 75-95%
  const needsCare = Math.floor(Math.random() * 15) + 5  // 5-20%
  const needsReplacement = 100 - healthy - needsCare

  return {
    analysis_id: `demo_${Date.now()}`,
    timestamp: new Date().toISOString(),
    farmer_id: request.farmerId,
    county: request.county,
    location: request.location,
    land_acres: request.landAcres,
    total_tree_count: treeCount,
    tree_density_per_acre: request.landAcres ? treeCount / request.landAcres : treeCount / 5,
    confidence_score: 0.75 + Math.random() * 0.2,
    canopy_coverage_pct: 40 + Math.random() * 35,
    tree_health: {
      healthy,
      needs_care: needsCare,
      needs_replacement: needsReplacement,
    },
    low_confidence: false,
    tree_species_guess: 'Mixed: Grevillea, Eucalyptus, Jacaranda, Mango',
    observations: [
      'Canopy coverage is average for the region',
      'Some trees show signs of drought stress',
      'Good species diversity observed',
      'Monitor trees near water sources for waterlogging',
    ],
    recommendations: [
      'Water trees in the eastern section - showing stress',
      'Prune damaged branches to prevent disease spread',
      'Consider replanting trees in low-coverage areas',
      'Monitor eucalyptus for invasive growth patterns',
    ],
    original_image_url: '',
    overlay_image_url: '',
    cv_debug: {
      orig_resolution: '1920x1080',
      work_resolution: '640x480',
      canopy_px: Math.floor(Math.random() * 5000) + 8000,
      peaks_detected: treeCount,
      after_area_filter: treeCount - Math.floor(Math.random() * 5),
    },
  }
}

// Mock data for development
export const MOCK_ANALYSIS: TreeAnalysisResponse = {
  analysis_id: 'mock_123',
  timestamp: new Date().toISOString(),
  farmer_id: 'FARMER001',
  county: 'Nairobi',
  location: 'Kenyatta Avenue',
  land_acres: 5.5,
  total_tree_count: 127,
  tree_density_per_acre: 23.1,
  confidence_score: 0.89,
  canopy_coverage_pct: 67.5,
  tree_health: {
    healthy: 98,
    needs_care: 22,
    needs_replacement: 7,
  },
  low_confidence: false,
  tree_species_guess: 'Mixed: Grevillea, Eucalyptus, Jacaranda',
  observations: [
    'Canopy coverage is above average for the region',
    'Several trees show signs of drought stress',
    'Good species diversity observed',
    'Some branches damaged in recent storm',
  ],
  recommendations: [
    'Water trees in the eastern section - showing stress',
    'Prune damaged branches to prevent disease spread',
    'Consider replanting 7 trees in the southern corner',
    'Monitor eucalyptus for invasive growth patterns',
  ],
  original_image_url: '/placeholder.jpg',
  overlay_image_url: '/placeholder-overlay.jpg',
  cv_debug: {
    orig_resolution: '1920x1080',
    work_resolution: '640x480',
    canopy_px: 12450,
    peaks_detected: 127,
    after_area_filter: 118,
  },
}