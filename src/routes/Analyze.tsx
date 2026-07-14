function Analyze() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Tree Canopy Analysis</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
          <span className="text-4xl block mb-4">📷</span>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Drag & drop an image here, or click to select
          </p>
          <p className="text-sm text-slate-500">
            Supports JPEG, PNG, WebP (max 20MB)
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Select Image
          </label>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Upload a photo of your tree canopy to get AI-powered analysis including:
        </p>
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

export default Analyze