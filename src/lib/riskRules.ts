import type { TreeAnalysisResponse } from '@/types/trees'
import type { WeatherResponse } from '@/types/weather'

/**
 * Risk flag types
 */
export type RiskType = 'wind_vulnerability' | 'water_stress' | 'frost_risk'

/**
 * Risk severity levels
 */
export type RiskSeverity = 'low' | 'medium' | 'high'

/**
 * A risk flag produced by the correlation engine
 */
export interface RiskFlag {
  type: RiskType
  severity: RiskSeverity
  message: string
  recommendation: string
}

/**
 * Configurable thresholds for risk detection
 * All in metric units (°C, km/h, mm)
 */
export const RISK_THRESHOLDS = {
  wind: {
    speedKph: 25,          // Threshold for high wind
    needsReplacementMin: 1, // Min trees needing replacement to flag
  },
  water: {
    canopyCoverageMin: 40,  // Minimum healthy canopy %
    tempMax: 32,            // High temp threshold (°C)
    precipMax: 2,           // Max precipitation to consider "dry" (mm)
    dryDaysMin: 3,          // Consecutive dry days to flag
  },
  frost: {
    tempMin: 5,             // Low temp threshold (°C)
    needsCareMin: 1,        // Min trees needing care to flag
  },
} as const

/**
 * Correlate tree canopy analysis with weather forecast to identify risks
 * @param analysis - Tree canopy analysis result
 * @param forecast - Weather forecast data
 * @returns Array of risk flags sorted by severity (high first)
 */
export function correlateRisk(
  analysis: TreeAnalysisResponse | undefined,
  forecast: WeatherResponse | undefined
): RiskFlag[] {
  // Handle undefined inputs gracefully
  if (!analysis || !forecast) {
    return []
  }

  const risks: RiskFlag[] = []

  // Check for wind vulnerability
  const windRisk = checkWindRisk(analysis, forecast)
  if (windRisk) risks.push(windRisk)

  // Check for water stress
  const waterRisk = checkWaterStress(analysis, forecast)
  if (waterRisk) risks.push(waterRisk)

  // Check for frost risk
  const frostRisk = checkFrostRisk(analysis, forecast)
  if (frostRisk) risks.push(frostRisk)

  // Sort by severity: high > medium > low
  const severityOrder: Record<RiskSeverity, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return risks.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
}

/**
 * Check for wind vulnerability
 * Trigger: needs_replacement > 0 AND forecasted wind above threshold
 */
function checkWindRisk(
  analysis: TreeAnalysisResponse,
  forecast: WeatherResponse
): RiskFlag | null {
  const { needs_replacement } = analysis.tree_health
  const { wind } = RISK_THRESHOLDS

  if (needs_replacement < wind.needsReplacementMin) {
    return null
  }

  // Check if any day in forecast has high wind or severe weather
  // Weather codes 80+ = rain showers, 95+ = thunderstorm
  const hasHighWind = forecast.daily?.some(
    (day) => day.weathercode >= 80 || day.weathercode >= 95 // storms and thunderstorms
  ) || forecast.hourly?.some(
    (hour) => hour.weathercode >= 80 || hour.weathercode >= 95
  )

  if (!hasHighWind) {
    return null
  }

  return {
    type: 'wind_vulnerability',
    severity: needs_replacement > 10 ? 'high' : 'medium',
    message: `${needs_replacement} trees need replacement and high wind/storm weather is forecasted this week.`,
    recommendation: 'Secure loose branches and consider staking young trees before storms arrive.',
  }
}

/**
 * Check for water stress
 * Trigger: canopy_coverage_pct below threshold AND forecasted heat/low precip
 */
function checkWaterStress(
  analysis: TreeAnalysisResponse,
  forecast: WeatherResponse
): RiskFlag | null {
  const { canopy_coverage_pct } = analysis
  const { needs_care, needs_replacement } = analysis.tree_health
  const { water } = RISK_THRESHOLDS

  if (canopy_coverage_pct >= water.canopyCoverageMin) {
    return null
  }

  // Check for hot, dry streak
  const daily = forecast.daily
  if (!daily || daily.length === 0) {
    return null
  }

  const dryDays = daily.filter(
    (day) => day.precipitation <= water.precipMax && day.temp_max >= water.tempMax
  )

  if (dryDays.length < water.dryDaysMin) {
    return null
  }

  const totalAtRisk = needs_care + needs_replacement

  return {
    type: 'water_stress',
    severity: canopy_coverage_pct < 30 || totalAtRisk > 15 ? 'high' : 'medium',
    message: `Canopy coverage is ${canopy_coverage_pct.toFixed(1)}% (below healthy threshold) with ${dryDays.length} hot, dry days forecasted. Risk of water stress.`,
    recommendation: 'Implement irrigation for at-risk trees and apply mulch to retain soil moisture.',
  }
}

/**
 * Check for frost risk
 * Trigger: needs_care > 0 AND forecasted frost/low temp
 */
function checkFrostRisk(
  analysis: TreeAnalysisResponse,
  forecast: WeatherResponse
): RiskFlag | null {
  const { needs_care } = analysis.tree_health
  const { frost } = RISK_THRESHOLDS

  if (needs_care < frost.needsCareMin) {
    return null
  }

  // Check if any day has low temps
  const hasColdWeather = forecast.daily?.some(
    (day) => day.temp_min <= frost.tempMin
  )

  if (!hasColdWeather) {
    return null
  }

  return {
    type: 'frost_risk',
    severity: needs_care > 15 ? 'high' : 'medium',
    message: `${needs_care} trees need care and frost/cold temperatures (below ${frost.tempMin}°C) are forecasted.`,
    recommendation: 'Consider frost protection measures: mulch, covers, or irrigation before cold spell.',
  }
}