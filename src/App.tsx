import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './routes/Home'
import Analyze from './routes/Analyze'
import History from './routes/History'
import Settings from './routes/Settings'
import UsageBanner from './components/quota/UsageBanner'

function App() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Weather', icon: 'weather' },
    { path: '/analyze', label: 'Analyze', icon: 'leaf' },
    { path: '/history', label: 'History', icon: 'chart' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ]

  const getIcon = (icon: string, isActive: boolean) => {
    const colorClass = isActive
      ? 'text-[var(--color-forest-500)]'
      : 'text-[var(--color-soil-400)] group-hover:text-[var(--color-forest-500)]'

    switch (icon) {
      case 'weather':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
          </svg>
        )
      case 'leaf':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        )
      case 'chart':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.75c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.75A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.75C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        )
      case 'settings':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.07.344.16.723.39.982.225.255.56.478.876.631.323.154.646.288.977.401.324.118.629.192.977.192h.35c.347 0 .688-.074.977-.192.315-.115.65-.32.875-.631.23-.259.32-.638.39-.982l.213-1.281zM12 16.5a.75.75 0 110-1.5.75.75 0 010 1.5zM4.5 8.125a.75.75 0 110-1.5.75.75 0 010 1.5zM4.5 12a.75.75 0 110-1.5.75.75 0 010 1.5zM4.5 15.625a.75.75 0 110-1.5.75.75 0 010 1.5zM9.5 8.125a.75.75 0 110-1.5.75.75 0 010 1.5zM9.5 12a.75.75 0 110-1.5.75.75 0 010 1.5zM9.5 15.625a.75.75 0 110-1.5.75.75 0 010 1.5zM14.5 8.125a.75.75 0 110-1.5.75.75 0 010 1.5zM14.5 12a.75.75 0 110-1.5.75.75 0 010 1.5zM14.5 15.625a.75.75 0 110-1.5.75.75 0 010 1.5zM19.5 8.125a.75.75 0 110-1.5.75.75 0 010 1.5zM19.5 12a.75.75 0 110-1.5.75.75 0 010 1.5zM19.5 15.625a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-50)] dark:bg-[var(--color-loam-900)]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-[var(--color-loam-800)]/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[var(--color-forest-700)] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)] leading-tight">
                  Canopy Watch
                </h1>
                <p className="text-xs text-[var(--color-soil-500)] dark:text-[var(--color-soil-400)]">
                  Smart agriculture
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Usage Banner - hidden on very small screens */}
      <div className="hidden sm:block max-w-4xl mx-auto w-full px-4 pt-4">
        <UsageBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white/90 dark:bg-[var(--color-loam-800)]/90 backdrop-blur-md border-t border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)] safe-area-pb">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex flex-col items-center px-3 sm:px-4 py-3 rounded-xl transition-all min-w-[64px] ${
                    isActive
                      ? 'text-[var(--color-forest-600)] dark:text-[var(--color-forest-300)]'
                      : 'text-[var(--color-soil-400)] hover:text-[var(--color-forest-500)]'
                  }`}
                >
                  {getIcon(item.icon, isActive)}
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-[var(--color-forest-600)] dark:text-[var(--color-forest-300)]' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App