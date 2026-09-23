import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Boxes, ChartNoAxesCombined, FileBarChart, FlaskConical, Gauge, Plus, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const pages: Record<string, { title: string; description: string; icon: LucideIcon; label: string }> = {
  '/': { title: 'Operations overview', description: 'Monitor your water network from a single operational workspace.', icon: Gauge, label: 'Dashboard' },
  '/digital-twins': { title: 'Digital Twins', description: 'Explore virtual representations of connected water assets.', icon: Boxes, label: 'Models' },
  '/simulations': { title: 'Simulations', description: 'Create and review scenario-based network simulations.', icon: FlaskConical, label: 'Scenarios' },
  '/analytics': { title: 'Analytics', description: 'Explore performance signals and operational trends.', icon: ChartNoAxesCombined, label: 'Insights' },
  '/reports': { title: 'Reports', description: 'Organize and export reporting across your organization.', icon: FileBarChart, label: 'Documents' },
  '/settings': { title: 'Settings', description: 'Configure your workspace, team, and platform preferences.', icon: Settings, label: 'Configuration' },
}

export function ShellPage() {
  const page = pages[useLocation().pathname] ?? pages['/']
  const navigate = useNavigate()
  const Icon = page.icon
  return <motion.div key={page.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-primary"><Icon className="size-4" />{page.label}</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{page.title}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{page.description}</p></div><button onClick={() => page.title === 'Digital Twins' && navigate('/digital-twins/new')} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:brightness-95"><Plus className="size-4" />Create new</button></div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{['Active resources', 'Recent activity', 'Team coverage'].map((label, index) => <div key={label} className="rounded-xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-muted-foreground">{label}</p><ArrowUpRight className="size-4 text-muted-foreground" /></div><div className="mt-7 h-7 w-24 animate-pulse rounded bg-muted" /><div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary/60" style={{ width: `${72 - index * 14}%` }} /></div></div>)}</div>
    <div className="mt-6 min-h-[340px] rounded-xl border border-dashed bg-card/60 p-6 sm:p-8"><div className="flex min-h-[280px] flex-col items-center justify-center text-center"><span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><Icon className="size-5" /></span><h2 className="mt-4 text-base font-semibold">{page.title} workspace</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">This page is ready for feature content. Navigation and application shell interactions are fully available.</p></div></div>
  </motion.div>
}
