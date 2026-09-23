import { Building2, Hotel, LoaderCircle, LockKeyhole } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDigitalTwinSession, deleteDigitalTwinSession, getHotelArchetypes } from '@/features/digital-twin/api'
import type { HotelArchetype, HotelArchetypeResponse } from '@/features/digital-twin/types'

const fallbackArchetypes: HotelArchetypeResponse[] = [
  { code: 'CITY_HOTEL', displayName: 'City Hotel', description: 'Compact urban hotel with room-led water demand.' },
  { code: 'BUSINESS_HOTEL', displayName: 'Business Hotel', description: 'Weekday-focused hotel with conference and restaurant demand.' },
  { code: 'RESORT', displayName: 'Resort', description: 'Leisure property with pools, landscaping, restaurants and spa.' },
  { code: 'BOUTIQUE_HOTEL', displayName: 'Boutique Hotel', description: 'Small premium hotel with personalized guest services.' },
  { code: 'APARTHOTEL', displayName: 'Aparthotel', description: 'Long-stay accommodation with higher in-room and kitchen demand.' },
  { code: 'LUXURY_RESORT', displayName: 'Luxury Resort', description: 'Large five-star destination with extensive leisure assets.' },
]

export function FacilityTypeSelectionPage() {
  const navigate = useNavigate()
  const [archetypes, setArchetypes] = useState(fallbackArchetypes)
  const [generating, setGenerating] = useState<HotelArchetype>()
  const [error, setError] = useState('')
  useEffect(() => { void getHotelArchetypes().then(setArchetypes).catch(() => undefined) }, [])
  const generate = async (archetype: HotelArchetype) => {
    setGenerating(archetype); setError('')
    try {
      const previousSessionId = sessionStorage.getItem('hydrolens:digital-twin-session-id')
      const session = await createDigitalTwinSession(archetype)
      sessionStorage.setItem('hydrolens:digital-twin-session-id', session.sessionId)
      if (previousSessionId && previousSessionId !== session.sessionId) void deleteDigitalTwinSession(previousSessionId).catch(() => undefined)
      sessionStorage.removeItem('hydrolens:last-event-impact')
      window.dispatchEvent(new Event('hydrolens:session-status'))
      navigate('/digital-twins')
    } catch (caught) {
      const message = typeof caught === 'object' && caught && 'message' in caught ? String(caught.message) : ''
      setError(message || 'The temporary hotel session could not be generated.')
    } finally { setGenerating(undefined) }
  }
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-background px-4 py-10">
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-3xl border border-primary/15 bg-card p-6 shadow-2xl sm:p-10">
      <div className="text-center"><img src="/watersec-logo.png" alt="WaterSec" className="brand-logo mx-auto mb-5 h-24 w-36 object-contain" /><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Create a temporary hotel twin</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Choose a hotel archetype</h1><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">The generated hotel survives page refreshes but disappears when deleted, expired, or when the backend restarts.</p></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{archetypes.map((item) => <button key={item.code} disabled={Boolean(generating)} onClick={() => void generate(item.code)} className="group min-h-48 rounded-2xl border-2 border-primary/20 bg-primary/[.025] p-5 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg disabled:cursor-wait disabled:opacity-60"><span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">{generating === item.code ? <LoaderCircle className="size-5 animate-spin" /> : <Hotel className="size-5" />}</span><span className="mt-5 block text-base font-semibold">{item.displayName}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{item.description}</span><span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-primary">{generating === item.code ? 'Generating session…' : 'Generate digital twin'}</span></button>)}</div>
      <div className="mt-5 flex items-center gap-3 rounded-xl border bg-muted/35 p-4 opacity-60"><span className="grid size-10 place-items-center rounded-lg bg-muted"><Building2 className="size-5" /></span><div className="flex-1"><p className="text-sm font-semibold">Other facility types</p><p className="text-xs text-muted-foreground">This temporary-session prototype currently supports hotels only.</p></div><LockKeyhole className="size-4" /></div>
      {error && <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
    </section>
  </div>
}
