function History() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Analysis History</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <span className="text-4xl block mb-4">📊</span>
          <p className="text-slate-600 dark:text-slate-400">
            No analyses yet
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Upload your first tree canopy image to start tracking history
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Track your canopy health over time. Each analysis is stored with its
          timestamp, letting you visualize trends and correlate with weather patterns.
        </p>
      </div>
    </div>
  )
}

export default History