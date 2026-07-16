import { useState } from 'react'
import type { TreeAnalysisResponse } from '@/types/trees'
import HealthDonut from './HealthDonut'
import OverlayToggle from './OverlayToggle'

interface AnalysisResultProps {
  result: TreeAnalysisResponse
  originalImage?: string | null
}

export default function AnalysisResult({ result, originalImage }: AnalysisResultProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  const {
    total_tree_count,
    tree_density_per_acre,
    canopy_coverage_pct,
    confidence_score,
    tree_health,
    tree_species_guess,
    observations,
    recommendations,
    overlay_image_url,
  } = result

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{total_tree_count}</div>
          <div className="text-sm text-slate-500">Trees Detected</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{tree_density_per_acre?.toFixed(1)}</div>
          <div className="text-sm text-slate-500">Trees/Acre</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{canopy_coverage_pct.toFixed(1)}%</div>
          <div className="text-sm text-slate-500">Canopy Cover</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{(confidence_score * 100).toFixed(0)}%</div>
          <div className="text-sm text-slate-500">Confidence</div>
        </div>
      </div>

      {/* Health Breakdown */}
      <HealthDonut
        healthy={tree_health.healthy}
        needsCare={tree_health.needs_care}
        needsReplacement={tree_health.needs_replacement}
      />

      {/* Image Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Canopy Analysis</h3>
          {overlay_image_url && (
            <OverlayToggle showOverlay={showOverlay} onToggle={setShowOverlay} />
          )}
        </div>
        <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
          {showOverlay && overlay_image_url ? (
            <img
              src={overlay_image_url}
              alt="AI overlay showing detected trees"
              className="w-full h-full object-cover"
            />
          ) : originalImage ? (
            <img
              src={originalImage}
              alt="Uploaded canopy image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <span className="text-4xl block">🌳</span>
                <p className="text-sm mt-2">Original image</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Species Guess */}
      {tree_species_guess && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-2">Species Detected</h3>
          <p className="text-slate-600 dark:text-slate-300">{tree_species_guess}</p>
        </div>
      )}

      {/* Observations */}
      {observations && observations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Observations</h3>
          <ul className="space-y-2">
            {observations.map((obs, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-500 mt-1">•</span>
                <span className="text-slate-600 dark:text-slate-300">{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3 text-emerald-800 dark:text-emerald-200">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-600 mt-1">✓</span>
                <span className="text-emerald-700 dark:text-emerald-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}