import { describe, it, expect } from 'vitest'
import { correlateRisk, RISK_THRESHOLDS, type RiskFlag } from '../../src/lib/riskRules'
import type { TreeAnalysisResponse } from '../../src/types/trees'
import type { WeatherResponse } from '../../src/types/weather'

// Test data helpers
const createMockTreeAnalysis = (overrides: Partial<TreeAnalysisResponse> = {}): TreeAnalysisResponse => ({
  analysis_id: 'test_123',
  timestamp: '2026-07-14T10:00:00Z',
  total_tree_count: 100,
  tree_density_per_acre: 20,
  confidence_score: 0.9,
  canopy_coverage_pct: 65,
  tree_health: {
    healthy: 85,
    needs_care: 10,
    needs_replacement: 5,
  },
  low_confidence: false,
  tree_species_guess: 'Mixed',
  observations: [],
  recommendations: [],
  original_image_url: '',
  overlay_image_url: '',
  cv_debug: {
    orig_resolution: '1920x1080',
    work_resolution: '640x480',
    canopy_px: 10000,
    peaks_detected: 100,
    after_area_filter: 95,
  },
  ...overrides,
})

const createMockWeather = (overrides: Partial<WeatherResponse> = {}): WeatherResponse => ({
  lat: -1.2921,
  lon: 36.8219,
  units: 'metric',
  days: 7,
  current: {
    time: '2026-07-14T12:00',
    interval: 900,
    temperature: 22,
    windspeed: 10,
    winddirection: 90,
    is_day: 1,
    weathercode: 3,
  },
  daily: [
    { date: '2026-07-14', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
    { date: '2026-07-15', temp_max: 26, temp_min: 14, precipitation: 0, weathercode: 3 },
    { date: '2026-07-16', temp_max: 27, temp_min: 13, precipitation: 0, weathercode: 3 },
    { date: '2026-07-17', temp_max: 28, temp_min: 12, precipitation: 0, weathercode: 3 },
    { date: '2026-07-18', temp_max: 29, temp_min: 11, precipitation: 0, weathercode: 3 },
    { date: '2026-07-19', temp_max: 25, temp_min: 14, precipitation: 0, weathercode: 3 },
    { date: '2026-07-20', temp_max: 24, temp_min: 15, precipitation: 0, weathercode: 3 },
  ],
  hourly: [],
  ai_summary: null,
  ...overrides,
})

describe('correlateRisk', () => {
  it('should return empty array when no risks detected', () => {
    const tree = createMockTreeAnalysis({
      tree_health: { healthy: 100, needs_care: 0, needs_replacement: 0 },
      canopy_coverage_pct: 70,
    })
    const weather = createMockWeather()

    const result = correlateRisk(tree, weather)

    expect(result).toHaveLength(0)
  })

  describe('wind vulnerability', () => {
    it('should flag wind risk when needs_replacement > 0 AND high wind forecasted', () => {
      const tree = createMockTreeAnalysis({
        tree_health: { healthy: 90, needs_care: 5, needs_replacement: 5 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-15', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-16', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-17', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-18', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-19', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
          { date: '2026-07-20', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 }, // High wind
        ],
      })

      const result = correlateRisk(tree, weather)
      const windRisk = result.find(r => r.type === 'wind_vulnerability')

      expect(windRisk).toBeDefined()
      expect(windRisk?.severity).toBe('medium')
      expect(windRisk?.message).toContain('wind')
    })

    it('should not flag wind risk when no trees need replacement', () => {
      const tree = createMockTreeAnalysis({
        tree_health: { healthy: 95, needs_care: 5, needs_replacement: 0 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-15', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-16', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-17', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-18', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-19', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
          { date: '2026-07-20', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 80 },
        ],
      })

      const result = correlateRisk(tree, weather)
      const windRisk = result.find(r => r.type === 'wind_vulnerability')

      expect(windRisk).toBeUndefined()
    })
  })

  describe('water stress', () => {
    it('should flag water stress when low canopy coverage AND dry/hot forecast', () => {
      const tree = createMockTreeAnalysis({
        canopy_coverage_pct: 25, // Below threshold
        tree_health: { healthy: 80, needs_care: 15, needs_replacement: 5 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 }, // Hot + dry
          { date: '2026-07-15', temp_max: 36, temp_min: 21, precipitation: 0, weathercode: 1 },
          { date: '2026-07-16', temp_max: 37, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-17', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 },
          { date: '2026-07-18', temp_max: 36, temp_min: 21, precipitation: 0, weathercode: 1 },
          { date: '2026-07-19', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 },
          { date: '2026-07-20', temp_max: 34, temp_min: 19, precipitation: 0, weathercode: 1 },
        ],
      })

      const result = correlateRisk(tree, weather)
      const waterRisk = result.find(r => r.type === 'water_stress')

      expect(waterRisk).toBeDefined()
      expect(waterRisk?.severity).toBe('high')
      expect(waterRisk?.message).toContain('water')
    })

    it('should not flag water stress when canopy coverage is healthy', () => {
      const tree = createMockTreeAnalysis({
        canopy_coverage_pct: 70, // Above threshold
        tree_health: { healthy: 80, needs_care: 15, needs_replacement: 5 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 },
          { date: '2026-07-15', temp_max: 36, temp_min: 21, precipitation: 0, weathercode: 1 },
          { date: '2026-07-16', temp_max: 37, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-17', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 },
          { date: '2026-07-18', temp_max: 36, temp_min: 21, precipitation: 0, weathercode: 1 },
          { date: '2026-07-19', temp_max: 35, temp_min: 20, precipitation: 0, weathercode: 1 },
          { date: '2026-07-20', temp_max: 34, temp_min: 19, precipitation: 0, weathercode: 1 },
        ],
      })

      const result = correlateRisk(tree, weather)
      const waterRisk = result.find(r => r.type === 'water_stress')

      expect(waterRisk).toBeUndefined()
    })
  })

  describe('frost protection', () => {
    it('should flag frost risk when needs_care > 0 AND cold temps forecasted', () => {
      const tree = createMockTreeAnalysis({
        tree_health: { healthy: 85, needs_care: 10, needs_replacement: 5 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 15, temp_min: 5, precipitation: 0, weathercode: 3 },
          { date: '2026-07-15', temp_max: 14, temp_min: 4, precipitation: 0, weathercode: 3 },
          { date: '2026-07-16', temp_max: 13, temp_min: 3, precipitation: 0, weathercode: 3 },
          { date: '2026-07-17', temp_max: 15, temp_min: 5, precipitation: 0, weathercode: 3 },
          { date: '2026-07-18', temp_max: 14, temp_min: 4, precipitation: 0, weathercode: 3 },
          { date: '2026-07-19', temp_max: 15, temp_min: 5, precipitation: 0, weathercode: 3 },
          { date: '2026-07-20', temp_max: 16, temp_min: 6, precipitation: 0, weathercode: 3 },
        ],
      })

      const result = correlateRisk(tree, weather)
      const frostRisk = result.find(r => r.type === 'frost_risk')

      expect(frostRisk).toBeDefined()
      expect(frostRisk?.severity).toBe('medium')
      expect(frostRisk?.message).toContain('frost')
    })

    it('should not flag frost risk when no trees need care', () => {
      const tree = createMockTreeAnalysis({
        tree_health: { healthy: 100, needs_care: 0, needs_replacement: 0 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 10, temp_min: 2, precipitation: 0, weathercode: 3 },
          { date: '2026-07-15', temp_max: 9, temp_min: 1, precipitation: 0, weathercode: 3 },
          { date: '2026-07-16', temp_max: 8, temp_min: 0, precipitation: 0, weathercode: 3 },
          { date: '2026-07-17', temp_max: 10, temp_min: 2, precipitation: 0, weathercode: 3 },
          { date: '2026-07-18', temp_max: 9, temp_min: 1, precipitation: 0, weathercode: 3 },
          { date: '2026-07-19', temp_max: 10, temp_min: 2, precipitation: 0, weathercode: 3 },
          { date: '2026-07-20', temp_max: 11, temp_min: 3, precipitation: 0, weathercode: 3 },
        ],
      })

      const result = correlateRisk(tree, weather)
      const frostRisk = result.find(r => r.type === 'frost_risk')

      expect(frostRisk).toBeUndefined()
    })
  })

  describe('priority ordering', () => {
    it('should return high severity risks first', () => {
      const tree = createMockTreeAnalysis({
        canopy_coverage_pct: 25,
        tree_health: { healthy: 70, needs_care: 20, needs_replacement: 10 },
      })
      const weather = createMockWeather({
        daily: [
          { date: '2026-07-14', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-15', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 95 }, // Storm
          { date: '2026-07-16', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-17', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-18', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-19', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
          { date: '2026-07-20', temp_max: 38, temp_min: 22, precipitation: 0, weathercode: 1 },
        ],
      })

      const result = correlateRisk(tree, weather)

      expect(result.length).toBeGreaterThan(1)
      // First result should be high severity
      expect(result[0].severity).toBe('high')
    })
  })
})

describe('RISK_THRESHOLDS', () => {
  it('should have all required threshold values', () => {
    expect(RISK_THRESHOLDS.wind.speedKph).toBeGreaterThan(0)
    expect(RISK_THRESHOLDS.water.canopyCoverageMin).toBeGreaterThan(0)
    expect(RISK_THRESHOLDS.water.tempMax).toBeGreaterThan(0)
    expect(RISK_THRESHOLDS.water.dryDaysMin).toBeGreaterThan(0)
    expect(RISK_THRESHOLDS.frost.tempMin).toBeLessThan(20)
  })
})