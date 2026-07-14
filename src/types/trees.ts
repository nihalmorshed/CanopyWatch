// Tree analysis response types

export interface TreeAnalysisResponse {
  analysis_id: string
  timestamp: string
  farmer_id?: string
  county?: string
  location?: string
  land_acres?: number
  total_tree_count: number
  tree_density_per_acre?: number
  confidence_score: number
  canopy_coverage_pct: number
  tree_health: {
    healthy: number
    needs_care: number
    needs_replacement: number
  }
  low_confidence: boolean
  tree_species_guess: string
  observations: string[]
  recommendations: string[]
  original_image_url: string
  overlay_image_url: string
  cv_debug: {
    orig_resolution: string
    work_resolution: string
    canopy_px: number
    peaks_detected: number
    after_area_filter: number
  }
}

export interface TreeQuota {
  plan: 'free' | 'pro' | 'scale'
  used: number
  limit: number
  remaining: number
  unlimited: boolean
  resets_at: string
}

export interface TreeHistoryEntry {
  analysis_id: string
  timestamp: string
  total_tree_count: number
  canopy_coverage_pct: number
  tree_health: {
    healthy: number
    needs_care: number
    needs_replacement: number
  }
  location?: string
}

export interface AnalyzeRequest {
  image: File
  farmerId?: string
  county?: string
  landAcres?: number
  location?: string
  notes?: string
}