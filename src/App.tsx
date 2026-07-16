import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './routes/Home'
import Analyze from './routes/Analyze'
import History from './routes/History'
import Settings from './routes/Settings'
import UsageBanner from './components/quota/UsageBanner'

function App() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Weather', icon: '🌤️' },
    { path: '/analyze', label: 'Analyze', icon: '🌳' },
    { path: '/history', label: 'History', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            Canopy Watch
          </h1>
        </div>
      </header>

      {/* Usage Banner - hidden on very small screens */}
      <div className="hidden sm:block max-w-4xl mx-auto w-full px-4 pt-4">
        <UsageBanner />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <nav className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 safe-area-pb">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg transition-colors min-w-[64px] ${
                  location.pathname === item.path
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App