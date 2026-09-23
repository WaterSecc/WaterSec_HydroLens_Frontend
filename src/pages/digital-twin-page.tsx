import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Bot, Box, ChevronDown, Circle, Clock3, Database, Layers3, Maximize2, Network, Play, Plus, RotateCcw, ScanLine, X, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComponentPanel } from '@/features/digital-twin/component-panel'
import { adaptDigitalTwin } from '@/features/digital-twin/adapter'
import { hotelTwin, type TwinComponent } from '@/features/digital-twin/model'
import type { DigitalTwinSession } from '@/features/digital-twin/types'
import { deleteDigitalTwinSession, getAiStatus, getDigitalTwinSession, type AiStatus } from '@/features/digital-twin/api'
import { TwinCanvas } from '@/features/digital-twin/twin-canvas'
import { simulationApi, type FlowEventComparison, type FlowEventType, type NormalFlowResult } from '@/features/simulation/api'
import { cn } from '@/lib/utils'

export function DigitalTwinPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<DigitalTwinSession>()
  const activeTwin = useMemo(() => session ? adaptDigitalTwin(session.digitalTwin) : hotelTwin, [session])
  const [selected, setSelected] = useState<TwinComponent>(), [showLegend, setShowLegend] = useState(true)
  const [flow, setFlow] = useState<NormalFlowResult>(), [running, setRunning] = useState(false), [error, setError] = useState('')
  const [eventType, setEventType] = useState<FlowEventType>('CONTINUOUS_LEAK'), [target, setTarget] = useState(''), [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [leakRate, setLeakRate] = useState(100), [startHour, setStartHour] = useState(8), [durationHours, setDurationHours] = useState(8)
  const [eventRunning, setEventRunning] = useState(false), [comparison, setComparison] = useState<FlowEventComparison>()
  const [showEventPanel, setShowEventPanel] = useState(true), [showImpactPrompt, setShowImpactPrompt] = useState(true)
  const [aiStatus, setAiStatus] = useState<AiStatus>()
  useEffect(() => {
    void getAiStatus().then(setAiStatus).catch(() => undefined)
    const sessionId = sessionStorage.getItem('hydrolens:digital-twin-session-id')
    if (!sessionId) { navigate('/'); return }
    void getDigitalTwinSession(sessionId).then((value) => { setSession(value); setFlow(value.baseline); setComparison(value.currentScenario) }).catch(() => {
      sessionStorage.removeItem('hydrolens:digital-twin-session-id')
      window.dispatchEvent(new Event('hydrolens:session-status')); navigate('/')
    })
  }, [navigate])
  const activeFlow = comparison?.event ?? flow
  const displayedTwin = useMemo(() => applyFlow(activeTwin, activeFlow, comparison?.affectedAssets), [activeTwin, activeFlow, comparison])
  const runNormalFlow = async () => {
    setRunning(true); setError('')
    try { const updated = await simulationApi.runSessionBaseline(activeTwin.id, { currentHour: 12 }); setSession(updated); setFlow(updated.baseline); setComparison(undefined) }
    catch { setError('Normal water-flow simulation could not be completed.') }
    finally { setRunning(false) }
  }
  const simulateEvent = async () => {
    if (!flow) return
    setEventRunning(true); setError('')
    try {
      const updated = await simulationApi.simulateSessionEvent(activeTwin.id, {
        eventType, targetComponent: needsTarget(eventType) ? (target || activeTwin.components.find((item) => item.kind !== 'source')?.name) : undefined,
        leakFlowLitersPerHour: eventType === 'CONTINUOUS_LEAK' ? leakRate : undefined,
        startHour,
        durationHours,
        severity: eventType === 'PIPE_BURST' ? severity : undefined,
        highOccupancyRate: eventType === 'HIGH_OCCUPANCY' ? .98 : undefined,
      })
      setSession(updated); setComparison(updated.currentScenario); setShowImpactPrompt(true)
    } catch (caught) { setError(typeof caught === 'object' && caught && 'message' in caught ? String(caught.message) : 'The selected event could not be simulated.') }
    finally { setEventRunning(false) }
  }
  const newTwin = async () => { if (session) await deleteDigitalTwinSession(session.sessionId).catch(() => undefined); sessionStorage.removeItem('hydrolens:digital-twin-session-id'); window.dispatchEvent(new Event('hydrolens:session-status')); navigate('/') }
  if (!session) return <div className="grid min-h-[70vh] place-items-center text-sm text-muted-foreground">Loading temporary Digital Twin session…</div>
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-120px)] min-h-[620px] flex-col overflow-hidden bg-background">
    <div className="flex flex-col gap-4 border-b bg-card px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Box className="size-5" /></span><div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-lg font-semibold">{activeTwin.name}</h1><span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">Generated model</span></div><p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3" />{flow ? `Normal flow · ${flow.currentHour}:00 · ${(flow.totalConsumptionLiters / 1000).toFixed(1)} m³/day` : 'Deterministic baseline definition'}</p></div></div>
      <div className="flex flex-wrap items-center gap-2">{aiStatus && <span title={activeTwin.generationMode === 'LLAMA' ? `This hotel was generated by ${activeTwin.aiModel}` : aiStatus.message} className={cn('inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold', activeTwin.generationMode === 'LLAMA' ? 'border-violet-300 bg-violet-50 text-violet-700' : 'bg-muted text-muted-foreground')}><Bot className="size-4" />{activeTwin.generationMode === 'LLAMA' ? 'Generated by Llama' : 'Deterministic hotel'}</span>}<button onClick={() => setShowLegend((value) => !value)} className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-semibold hover:bg-muted"><Layers3 className="size-4" />Layers<ChevronDown className="size-3" /></button><button className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-semibold hover:bg-muted"><RotateCcw className="size-4" />Reset view</button><button onClick={() => void newTwin()} className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-semibold hover:bg-muted"><Plus className="size-4" />New twin</button><button disabled={running} onClick={() => void runNormalFlow()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60"><Play className="size-4" />{running ? 'Simulating…' : 'Run normal flow'}</button></div>
    </div>

    <div className="relative flex-1 overflow-hidden">
      <TwinCanvas model={displayedTwin} selectedId={selected?.id} onSelect={setSelected} />
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-3 sm:left-6 sm:top-6">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border bg-card/90 p-2 shadow-lg backdrop-blur-xl"><span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><Network className="size-4" /></span><div className="pr-2"><p className="text-xs font-semibold">Water distribution network</p><p className="text-[10px] text-muted-foreground">{activeTwin.components.length} components · {activeTwin.connections.length} connections</p></div></div>
        <AnimatePresence>{showLegend && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="pointer-events-auto rounded-xl border bg-card/90 p-3 shadow-lg backdrop-blur-xl"><p className="mb-2 text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground">Component status</p><div className="space-y-1.5 text-[10px]"><p className="flex items-center gap-2"><Circle className="size-2.5 fill-emerald-500 text-emerald-500" />Operational</p><p className="flex items-center gap-2"><Circle className="size-2.5 fill-amber-400 text-amber-400" />Needs attention</p><p className="flex items-center gap-2"><span className="block h-px w-3 bg-primary" />Water connection</p></div></motion.div>}</AnimatePresence>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 sm:block"><div className="rounded-full border bg-card/90 px-4 py-2 text-[10px] font-medium text-muted-foreground shadow-md backdrop-blur-xl">Drag to pan · Scroll to zoom · Select a component for details</div></div>
      <button className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-lg border bg-card/90 shadow-md backdrop-blur-xl hover:bg-muted sm:right-6 sm:top-6" aria-label="Enter fullscreen"><Maximize2 className="size-4" /></button>
      {flow && !showEventPanel && <button onClick={() => setShowEventPanel(true)} className="absolute right-4 top-16 z-10 inline-flex h-9 items-center gap-2 rounded-lg border bg-card/95 px-3 text-xs font-semibold shadow-md backdrop-blur-xl hover:bg-muted sm:right-6"><Zap className="size-3.5 text-primary" />Generate event</button>}
      {flow && showEventPanel && <div className="absolute right-4 top-16 z-10 w-72 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur-xl sm:right-6"><div className="flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-semibold"><Zap className="size-3.5 text-primary" />Generate an event</p><button onClick={() => setShowEventPanel(false)} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Hide event generator" title="Hide event generator"><X className="size-3.5" /></button></div><select value={eventType} onChange={(event) => { setEventType(event.target.value as FlowEventType); setComparison(undefined) }} className="mt-3 h-9 w-full rounded-lg border bg-background px-2 text-xs">{(['CONTINUOUS_LEAK', 'PIPE_BURST', 'HIGH_OCCUPANCY', 'HEAT_WAVE', 'WATER_SUPPLY_INTERRUPTION'] as FlowEventType[]).map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select>{needsTarget(eventType) && <select value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 h-9 w-full rounded-lg border bg-background px-2 text-xs"><option value="">Select affected branch</option>{activeTwin.components.filter((item) => item.kind !== 'source').map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select>}{eventType === 'PIPE_BURST' && <select value={severity} onChange={(event) => setSeverity(event.target.value as typeof severity)} className="mt-2 h-9 w-full rounded-lg border bg-background px-2 text-xs"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>}<div className="mt-2 grid grid-cols-2 gap-2"><label className="text-[9px] text-muted-foreground">Start hour<input type="number" min="0" max="23" value={startHour} onChange={(event) => setStartHour(Number(event.target.value))} className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground" /></label><label className="text-[9px] text-muted-foreground">Duration (hours)<input type="number" min="1" max="24" value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value))} className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground" /></label></div>{eventType === 'CONTINUOUS_LEAK' && <label className="mt-2 block text-[9px] text-muted-foreground">Leak flow (liters/hour)<input type="number" min="1" max="100000" value={leakRate} onChange={(event) => setLeakRate(Number(event.target.value))} className="mt-1 h-8 w-full rounded-md border bg-background px-2 text-xs text-foreground" /></label>}<button disabled={eventRunning || (needsTarget(eventType) && !target)} onClick={() => void simulateEvent()} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 text-xs font-bold text-white disabled:opacity-45"><AlertTriangle className="size-3.5" />{eventRunning ? 'Recalculating…' : 'Run event'}</button>{comparison && <div className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/[.08] p-3 text-[10px]"><div className="flex justify-between"><span>Normal use</span><strong>{(comparison.baselineConsumptionLiters / 1000).toFixed(2)} m³</strong></div><div className="mt-1 flex justify-between"><span>With event</span><strong>{(comparison.eventConsumptionLiters / 1000).toFixed(2)} m³</strong></div><div className="mt-2 flex justify-between border-t pt-2"><span>Water lost</span><strong className="text-amber-600">{comparison.lostWaterLiters.toLocaleString()} L</strong></div><div className="mt-1 flex justify-between"><span>Financial loss</span><strong className="text-amber-600">{comparison.lostWaterCost.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}</strong></div><p className="mt-2 text-muted-foreground">Affected: {comparison.affectedAssets.join(', ') || 'Source/storage'}</p></div>}</div>}
      {comparison && showImpactPrompt && <div className="absolute bottom-16 right-4 z-10 w-64 rounded-xl border border-primary/25 bg-card/95 p-3 shadow-lg backdrop-blur-xl sm:right-6"><p className="flex items-center gap-2 text-xs font-semibold text-primary"><ScanLine className="size-4" />WaterSec detection opportunity</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Place sensors near {comparison.affectedAssets.join(', ') || 'the supply and storage branches'} to expose this loss early.</p><button onClick={() => { setShowImpactPrompt(false); navigate('/analytics') }} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-primary-foreground">Show business impact<ArrowRight className="size-3.5" /></button></div>}
      <AnimatePresence>{selected && <><button onClick={() => setSelected(undefined)} className="absolute inset-0 z-[15] bg-slate-950/20 backdrop-blur-[1px] md:hidden" aria-label="Close component panel" /><ComponentPanel component={selected} onClose={() => setSelected(undefined)} /></>}</AnimatePresence>
      {error && <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-destructive/30 bg-background px-4 py-2 text-xs text-destructive shadow-lg">{error}</div>}
    </div>

    <div className="flex h-11 items-center justify-between border-t bg-card px-4 text-[10px] text-muted-foreground sm:px-6"><div className="flex items-center gap-4"><span>Renderer: <strong className="text-foreground">2D Graph</strong></span><span>Model: <strong className="text-foreground">{activeTwin.version}</strong></span></div></div>
  </motion.div>
}

function needsTarget(eventType: FlowEventType) {
  return eventType === 'CONTINUOUS_LEAK' || eventType === 'PIPE_BURST'
}

function applyFlow(model: typeof hotelTwin, flow?: NormalFlowResult, affectedAssets: string[] = []): typeof hotelTwin {
  if (!flow) return model
  const mapped = model.components.map((component) => {
    const node = component.kind === 'source'
      ? flow.nodes.find((item) => item.type === 'SOURCE')
      : flow.nodes.find((item) => item.type === 'CONSUMER' && item.label === component.name)
    if (!node) return component
    const daily = formatDailyVolume(node.dailyConsumptionLiters)
    return { ...component, status: affectedAssets.includes(node.label) ? 'attention' as const : component.status, expectedDemand: { value: daily.value, unit: daily.unit, share: Math.round(node.shareOfTotalPercentage) }, simulation: [{ label: 'Current flow', value: formatHourlyFlow(node.currentFlowLitersPerHour), trend: affectedAssets.includes(node.label) ? 'up' as const : 'stable' as const }, { label: 'Daily total', value: daily.label, trend: affectedAssets.includes(node.label) ? 'up' as const : 'stable' as const }] }
  })
  const storageNode = flow.nodes.find((node) => node.type === 'STORAGE')
  const source = mapped.filter((component) => component.kind === 'source')
  const consumers = mapped.filter((component) => component.kind !== 'source')
  const storageDaily = formatDailyVolume(storageNode?.dailyConsumptionLiters ?? 0)
  const storage: TwinComponent = { id: 'main-storage', name: storageNode?.label ?? 'Main Storage Tank', kind: 'utility', status: 'operational', icon: Database, position: { x: 300, y: Math.max(180, consumers.length * 90) }, properties: [{ label: 'Role', value: 'Primary distribution buffer' }], expectedDemand: { value: storageDaily.value, unit: storageDaily.unit, share: 100 }, simulation: [{ label: 'Outlet flow', value: formatHourlyFlow(storageNode?.currentFlowLitersPerHour ?? 0), trend: 'stable' }], recommendations: [], sensors: [] }
  const components = [...source, storage, ...consumers]
  const connections = [{ id: 'source-main-storage', source: source[0]?.id ?? 'source', target: storage.id, label: `${(storageNode?.currentFlowLitersPerHour ?? 0).toFixed(1)} L/h` }, ...consumers.map((target) => { const node = flow.nodes.find((item) => item.type === 'CONSUMER' && item.label === target.name); return { id: `main-storage-${target.id}`, source: storage.id, target: target.id, label: `${(node?.currentFlowLitersPerHour ?? 0).toFixed(1)} L/h` } })]
  return { ...model, components, connections }
}

function formatDailyVolume(liters: number) {
  if (liters < 1000) return { value: Math.round(liters * 10) / 10, unit: 'L/day', label: `${liters.toFixed(1)} L` }
  const cubicMeters = liters / 1000
  return { value: Math.round(cubicMeters * 100) / 100, unit: 'm³/day', label: `${cubicMeters.toFixed(2)} m³` }
}

function formatHourlyFlow(liters: number) {
  return `${liters < 1 ? liters.toFixed(2) : liters.toFixed(1)} L/h`
}
