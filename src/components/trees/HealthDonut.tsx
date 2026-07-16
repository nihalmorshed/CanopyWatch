import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface HealthDonutProps {
  healthy: number
  needsCare: number
  needsReplacement: number
}

const COLORS = {
  healthy: '#22c55e',     // green-500
  needsCare: '#f59e0b',   // amber-500
  needsReplacement: '#ef4444', // red-500
}

export default function HealthDonut({ healthy, needsCare, needsReplacement }: HealthDonutProps) {
  const data = [
    { name: 'Healthy', value: healthy, color: COLORS.healthy },
    { name: 'Needs Care', value: needsCare, color: COLORS.needsCare },
    { name: 'Needs Replacement', value: needsReplacement, color: COLORS.needsReplacement },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Canopy Health</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #1e293b)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--tooltip-color, #e2e8f0)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
        <div>
          <div className="font-semibold text-green-500">{healthy}</div>
          <div className="text-slate-500">Healthy</div>
        </div>
        <div>
          <div className="font-semibold text-amber-500">{needsCare}</div>
          <div className="text-slate-500">Needs Care</div>
        </div>
        <div>
          <div className="font-semibold text-red-500">{needsReplacement}</div>
          <div className="text-slate-500">Replace</div>
        </div>
      </div>
    </div>
  )
}