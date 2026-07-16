interface OverlayToggleProps {
  showOverlay: boolean
  onToggle: (show: boolean) => void
}

export default function OverlayToggle({ showOverlay, onToggle }: OverlayToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm ${!showOverlay ? 'font-semibold text-emerald-600' : 'text-slate-500'}`}>
        Original
      </span>
      <button
        onClick={() => onToggle(!showOverlay)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          showOverlay ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
        role="switch"
        aria-checked={showOverlay}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            showOverlay ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm ${showOverlay ? 'font-semibold text-emerald-600' : 'text-slate-500'}`}>
        AI Overlay
      </span>
    </div>
  )
}