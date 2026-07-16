import type { RiskFlag } from '@/lib/riskRules'

interface RiskPanelProps {
  risks: RiskFlag[]
}

const SEVERITY_STYLES = {
  high: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    text: 'text-red-800 dark:text-red-200',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    text: 'text-amber-800 dark:text-amber-200',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m14.347-1.535A7.481 7.481 0 0121 12a7.481 7.481 0 01-3.898 2.167M12 15.75a3.75 3.75 0 000-7.5m0 7.5a3.75 3.75 0 010-7.5m0 7.5v.008A2.25 2.25 0 0112 18.75 2.25 2.25 0 019.75 16.5v-.008" />
      </svg>
    ),
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    text: 'text-blue-800 dark:text-blue-200',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.912a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
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
      <div className="card p-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-forest-100)] dark:bg-[var(--color-forest-700)] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-forest-600)] dark:text-[var(--color-forest-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)] font-medium">
            No weather risks detected for your canopy
          </p>
        </div>
        <p className="text-sm text-[var(--color-soil-500)] mt-2 ml-13">
          Your tree canopy looks good against the forecasted weather.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <h3 className="text-lg font-display font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
        Weather Risk Assessment
      </h3>

      {risks.map((risk, index) => {
        const style = SEVERITY_STYLES[risk.severity]
        const label = RISK_TYPE_LABELS[risk.type]

        return (
          <div
            key={`${risk.type}-${index}`}
            className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${style.bg} ${style.border}`}>
                {style.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${style.badge}`}>
                    {risk.severity}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-soil-700)] dark:text-[var(--color-cream-100)]">
                    {label}
                  </span>
                </div>
                <p className={`text-sm ${style.text}`}>
                  {risk.message}
                </p>
                <div className="mt-3 pt-3 border-t border-[var(--color-soil-200)] dark:border-[var(--color-loam-700)]">
                  <p className="text-xs text-[var(--color-soil-500)] dark:text-[var(--color-soil-400)]">
                    <span className="font-semibold">Recommendation:</span> {risk.recommendation}
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