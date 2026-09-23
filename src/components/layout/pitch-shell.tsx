import { BarChart3, Building2, Droplets, Menu, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { deleteDigitalTwinSession } from '@/features/digital-twin/api'

const journey = [
  { label: '1. Hotel', short: 'Hotel', path: '/', icon: Building2 },
  { label: '2. Simulate leak', short: 'Leak', path: '/digital-twins', icon: Droplets },
  { label: '3. Business impact', short: 'Impact', path: '/analytics', icon: BarChart3 },
]

export function PitchShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ready, setReady] = useState(() => Boolean(sessionStorage.getItem('hydrolens:digital-twin-session-id')))

  useEffect(() => {
    const refresh = () => setReady(Boolean(sessionStorage.getItem('hydrolens:digital-twin-session-id')))
    window.addEventListener('storage', refresh)
    window.addEventListener('hydrolens:session-status', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('hydrolens:session-status', refresh)
    }
  }, [])

  const resetDemo = async () => {
    const sessionId = sessionStorage.getItem('hydrolens:digital-twin-session-id')
    if (sessionId) await deleteDigitalTwinSession(sessionId).catch(() => undefined)
    for (const key of Object.keys(localStorage)) if (key.startsWith('hydrolens:')) localStorage.removeItem(key)
    for (const key of Object.keys(sessionStorage)) if (key.startsWith('hydrolens:')) sessionStorage.removeItem(key)
    setReady(false)
    window.dispatchEvent(new Event('hydrolens:session-status'))
    navigate('/')
  }

  const nav = <>
    {journey.map(({ label, path, icon: Icon }) => {
      const locked = path !== '/' && !ready
      return locked ? <span key={path} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground/45" title="Choose or generate a hotel first"><Icon className="size-4" />{label}</span>
        : <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition', isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}><Icon className="size-4" />{label}</NavLink>
    })}
  </>

  const currentStep = Math.max(0, journey.findIndex((item) => item.path === location.pathname))
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
        <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open demo navigation"><Menu className="size-5" /></button>
        <NavLink to="/" className="flex items-center gap-3"><img src="/watersec-logo.png" alt="WaterSec" className="h-11 w-11 object-contain" /><span><strong className="block text-sm">HydroLens Demo</strong><span className="block text-[10px] uppercase tracking-[.16em] text-muted-foreground">Hotel water intelligence</span></span></NavLink>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Pitch journey">{nav}</nav>
        <button onClick={() => void resetDemo()} className="ml-auto inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted lg:ml-2" title="Delete the temporary backend session and return to hotel selection"><RotateCcw className="size-3.5" /><span className="hidden sm:inline">Reset demo</span></button>
      </div>
      <div className="h-1 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${((currentStep + 1) / journey.length) * 100}%` }} /></div>
    </header>

    {mobileOpen && <div className="fixed inset-0 z-[70] bg-slate-950/50" onClick={() => setMobileOpen(false)}><aside className="h-full w-72 bg-background p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><strong>Pitch journey</strong><button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-muted"><X className="size-4" /></button></div><nav className="space-y-2">{nav}</nav></aside></div>}

    <main><Outlet /></main>
    {ready && <footer className="border-t bg-card"><div className="mx-auto max-w-[1500px] px-4 py-4 text-xs text-muted-foreground sm:px-6">Keep the story simple: invisible loss → sensor detection → measurable savings.</div></footer>}
  </div>
}
