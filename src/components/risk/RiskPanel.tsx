import type { RiskFlag } from '@/lib/riskRules'

interface RiskPanelProps {
  risks: RiskFlag[]
}

const SEVERITY_STYLES = {
  high: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: '🔴',
    text: 'text-red-700 dark:text-red-300',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
    icon: '🟡',
    text: 'text-amber-700 dark:text-amber-300',
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: '🔵',
    text: 'text-blue-700 dark:text-blue-300',
  },
}

const RISK_TYPE_LABELS = {
  wind_vulnerability: 'Wind Risk',
  water_stress: 'Water Stress',
  frost_risk: 'Frost Risk',
}

export default function RiskPanel({ risks }: RiskPanelProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <p className="text-emerald-700 dark:text-emerald-300 font-medium">
            No weather risks detected for your canopy
          </p>
        </div>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
          Your tree canopy looks good against the forecasted weather.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Weather Risk Assessment</h3>

      {risks.map((risk, index) => {
        const style = SEVERITY_STYLES[risk.severity]
        const label = RISK_TYPE_LABELS[risk.type]

        return (
          <div
            key={`${risk.type}-${index}`}
            className={`${style.bg} ${style.border} border rounded-xl p-4`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{style.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium uppercase ${style.text}`}>
                    {risk.severity}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {risk.message}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">Recommendation:</span> {risk.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}