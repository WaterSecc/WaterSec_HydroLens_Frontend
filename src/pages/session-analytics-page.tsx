import { AlertTriangle, ArrowLeft, Clock3, Droplets, Hotel, RefreshCcw, WalletCards } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDigitalTwinSession } from '@/features/digital-twin/api'
import type { DigitalTwinSession } from '@/features/digital-twin/types'

const money = (value: number) => new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 2 }).format(value)

export function SessionAnalyticsPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<DigitalTwinSession>()
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    const id = sessionStorage.getItem('hydrolens:digital-twin-session-id')
    if (!id) { navigate('/'); return }
    setError('')
    try { setSession(await getDigitalTwinSession(id)) }
    catch { sessionStorage.removeItem('hydrolens:digital-twin-session-id'); setError('This temporary Digital Twin session has expired. Generate a new hotel.') }
  }, [navigate])
  useEffect(() => { void load() }, [load])
  if (error) return <div className="grid min-h-[70vh] place-items-center px-4"><div className="max-w-md rounded-2xl border bg-card p-8 text-center"><AlertTriangle className="mx-auto size-8 text-amber-500" /><p className="mt-4 text-sm">{error}</p><button onClick={() => navigate('/')} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Generate hotel</button></div></div>
  if (!session) return <div className="grid min-h-[70vh] place-items-center text-sm text-muted-foreground">Loading session impact…</div>
  const event = session.currentScenario
  const baseline = session.baseline
  const repeatedDaily = event?.lostWaterCost ?? 0
  return <main className="mx-auto min-h-[calc(100vh-68px)] max-w-[1400px] space-y-6 bg-background px-4 py-8 sm:px-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Business impact · Temporary session</p><h1 className="mt-2 text-2xl font-semibold">{session.hotelSpecification.hotelName}</h1><p className="mt-1 text-sm text-muted-foreground">{session.archetype.replaceAll('_', ' ')} · expires after 60 minutes of inactivity</p></div><div className="flex gap-2"><button onClick={() => navigate('/digital-twins')} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"><ArrowLeft className="size-4" />Digital twin</button><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"><RefreshCcw className="size-4" />Refresh</button></div></header>
    {!event ? <section className="rounded-2xl border border-dashed bg-card p-12 text-center"><Droplets className="mx-auto size-9 text-primary" /><h2 className="mt-4 text-lg font-semibold">No event generated yet</h2><p className="mt-2 text-sm text-muted-foreground">Run the deterministic baseline and an event from the Digital Twin page.</p></section> : <>
      <section className="rounded-2xl border border-amber-400/30 bg-amber-400/[.06] p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-amber-600">Latest generated incident</p><h2 className="mt-2 text-xl font-semibold">{event.eventType.replaceAll('_', ' ')}</h2><p className="mt-1 text-sm text-muted-foreground">Affected: {event.affectedAssets.join(', ') || 'water network'}</p></section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Droplets} label="Lost water in this event" value={`${event.lostWaterLiters.toLocaleString()} L`} detail="Deterministic baseline difference" /><Metric icon={WalletCards} label="Cost of this event" value={money(event.lostWaterCost)} detail="Using the session water tariff" /><Metric icon={Clock3} label="Monthly exposure" value={money(repeatedDaily * 30)} detail="If this event repeats daily" /><Metric icon={Hotel} label="Annual exposure" value={money(repeatedDaily * 365)} detail="If this event repeats daily" /></section>
      <section className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-card p-6"><h3 className="font-semibold">Baseline versus event</h3><div className="mt-5 space-y-4"><Row label="Normal daily consumption" value={`${((baseline?.totalConsumptionLiters ?? event.baselineConsumptionLiters) / 1000).toFixed(2)} m³`} /><Row label="Daily consumption with event" value={`${(event.eventConsumptionLiters / 1000).toFixed(2)} m³`} /><Row label="Difference" value={`${event.absoluteDifferenceLiters.toLocaleString()} L (${event.percentageDifference.toFixed(2)}%)`} /></div></div><div className="rounded-2xl border bg-card p-6"><h3 className="font-semibold">Session information</h3><div className="mt-5 space-y-4"><Row label="Generation" value={session.generation.mode === 'LLAMA' ? 'Llama 3 via Hugging Face' : 'Deterministic fallback'} /><Row label="Prompt profile" value={session.generation.promptProfile.replaceAll('_', ' ')} /><Row label="Events generated" value={String(session.eventHistory.length)} /></div></div></section>
    </>}
  </main>
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Droplets; label: string; value: string; detail: string }) { return <article className="rounded-2xl border bg-card p-5"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-2 text-sm font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></article> }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 border-b pb-3 text-sm last:border-0"><span className="text-muted-foreground">{label}</span><strong className="text-right">{value}</strong></div> }
