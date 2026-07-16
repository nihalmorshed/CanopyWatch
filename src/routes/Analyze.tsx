import { useState, useMemo, useCallback } from 'react'
import { useTreeAnalysis, useTreeQuota } from '@/hooks/useTreeAnalysis'
import { useWeather, MOCK_WEATHER } from '@/hooks/useWeather'
import { cacheForecast } from '@/hooks/useTreeHistory'
import { correlateRisk } from '@/lib/riskRules'
import ImageUploader from '@/components/trees/ImageUploader'
import AnalysisResult from '@/components/trees/AnalysisResult'
import RiskPanel from '@/components/risk/RiskPanel'
import type { AnalyzeRequest } from '@/types/trees'

export default function Analyze() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    farmerId: '',
    county: '',
    landAcres: '',
    location: '',
    notes: '',
  })

  const { data: quota, isLoading: quotaLoading } = useTreeQuota()
  const { mutate: analyze, isPending, error, data: result } = useTreeAnalysis()
  // Use cached weather data if available - don't refetch on mount
  const { data: weather } = useWeather({ days: 7, ai: false })

  // Compute risks only when we have actual analysis result
  const risks = useMemo(() => {
    if (!result || !weather?.current) return []
    return correlateRisk(result, weather)
  }, [result, weather])

  const handleAnalyze = () => {
    if (!selectedFile) return

    const request: AnalyzeRequest = {
      image: selectedFile,
      farmerId: formData.farmerId || undefined,
      county: formData.county || undefined,
      landAcres: formData.landAcres ? Number(formData.landAcres) : undefined,
      location: formData.location || undefined,
      notes: formData.notes || undefined,
    }

    analyze(request, {
      onSuccess: (data) => {
        // Clear the selected file to show result view
        setSelectedFile(null)
        // Cache the current forecast for future reference
        const weatherData = weather?.current ? weather : MOCK_WEATHER
        cacheForecast(data.analysis_id, weatherData)
      },
    })
  }

  const remainingQuota = quota?.remaining ?? 5

  // Only show result if we have an actual API response, not mock
  const hasResult = result != null

  const handleNewAnalysis = () => {
    // Reset state to allow new upload
    setSelectedFile(null)
    setImagePreview(null)
  }

  const handlePreviewCreated = useCallback((previewUrl: string) => {
    setImagePreview(previewUrl)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tree Canopy Analysis</h2>
        {hasResult && (
          <button
            onClick={handleNewAnalysis}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + New Analysis
          </button>
        )}
      </div>

      {/* Quota Banner */}
      {quotaLoading ? (
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
      ) : remainingQuota <= 2 && remainingQuota > 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-3 rounded-lg text-sm">
          ⚠️ Only {remainingQuota} analysis{remainingQuota !== 1 ? 'ies' : ''} remaining this month
        </div>
      ) : null}

      {/* Show result if available - only after real analysis, not mock */}
      {hasResult && !selectedFile ? (
        <div className="space-y-6">
          <AnalysisResult result={result} originalImage={imagePreview} />
          <RiskPanel risks={risks} />
        </div>
      ) : (
        <>
          {/* Upload Section */}
          <ImageUploader
            onImageSelect={setSelectedFile}
            onPreviewCreated={handlePreviewCreated}
            remainingQuota={remainingQuota}
          />

          {/* Optional Form Fields */}
          {selectedFile && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-4">
              <h3 className="font-medium">Additional Details (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Farmer ID</label>
                  <input
                    type="text"
                    value={formData.farmerId}
                    onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                    placeholder="FARMER001"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">County</label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    placeholder="Nairobi"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Land (Acres)</label>
                  <input
                    type="number"
                    value={formData.landAcres}
                    onChange={(e) => setFormData({ ...formData, landAcres: e.target.value })}
                    placeholder="5.5"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Kenyatta Avenue"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific concerns or observations..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg">
              {(error as Error).message}
            </div>
          )}

          {/* Analyze Button */}
          {selectedFile && (
            <button
              onClick={handleAnalyze}
              disabled={isPending || remainingQuota === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Analyzing...' : 'Analyze Canopy'}
            </button>
          )}
        </>
      )}

      {/* Info Card */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
        <p>Upload a photo of your tree canopy to get AI-powered analysis including:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Tree count and density</li>
          <li>Canopy health assessment</li>
          <li>Weather risk correlation</li>
          <li>Actionable recommendations</li>
        </ul>
      </div>
    </div>
  )
}