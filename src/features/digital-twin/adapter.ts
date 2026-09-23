import { BedDouble, ChefHat, CookingPot, Droplets, Flower2, Heater, Shirt, Sparkles, Waves } from 'lucide-react'
import type { BackendDigitalTwin } from './types'
import type { DigitalTwinModel, TwinComponent, TwinComponentKind } from './model'

const icons = { GUEST_ROOMS: BedDouble, LAUNDRY: Shirt, RESTAURANT: CookingPot, KITCHEN: ChefHat, POOL: Waves, SPA: Sparkles, IRRIGATION: Flower2, COOLING_TOWER: Heater, OTHER: Droplets }
const kinds: Record<string, TwinComponentKind> = { GUEST_ROOMS: 'accommodation', LAUNDRY: 'service', RESTAURANT: 'service', KITCHEN: 'service', POOL: 'recreation', SPA: 'recreation', IRRIGATION: 'recreation', COOLING_TOWER: 'utility' }

export function adaptDigitalTwin(twin: BackendDigitalTwin): DigitalTwinModel {
  const total = twin.components.reduce((sum, item) => sum + item.expectedDemand.baselineLitersPerDay, 0)
  const source: TwinComponent = {
    id: 'source', name: 'Water Supply', kind: 'source', status: 'operational', icon: Droplets,
    position: { x: 20, y: Math.max(180, twin.components.length * 90) },
    properties: [{ label: 'Source', value: twin.waterNetwork.primarySource }],
    expectedDemand: { value: Math.round(total / 100) / 10, unit: 'm³/day', share: 100 },
    simulation: [], recommendations: [], sensors: [],
  }
  const components = twin.components.map((item, index): TwinComponent => ({
    id: item.key, name: item.name, kind: kinds[item.type] ?? 'utility', status: 'operational',
    icon: icons[item.type as keyof typeof icons] ?? Droplets,
    position: { x: index % 2 === 0 ? 560 : 980, y: 25 + Math.floor(index / 2) * 215 },
    properties: Object.entries(item.properties).filter(([, value]) => typeof value !== 'object').map(([label, value]) => ({ label: readable(label), value: String(value) })),
    expectedDemand: { value: Math.round(item.expectedDemand.baselineLitersPerDay / 100) / 10, unit: 'm³/day', share: total ? Math.round(item.expectedDemand.baselineLitersPerDay / total * 100) : 0 },
    simulation: [{ label: 'Peak flow', value: `${Math.round(item.expectedDemand.peakLitersPerHour)} L/h`, trend: 'stable' }], recommendations: [], sensors: [],
  }))
  const connections = twin.waterNetwork.links.filter((link) => link.to !== 'main-supply').map((link) => ({ id: `${link.from}-${link.to}`, source: link.from === 'main-supply' ? 'source' : link.from, target: link.to, label: `${Math.round(link.capacityLitersPerHour)} L/h` }))
  return { id: twin.facilityId, name: twin.facility.name, type: 'HOTEL', version: twin.modelVersion,
    generationMode: twin.attributes.generationMode === 'LLAMA' ? 'LLAMA' : 'DETERMINISTIC',
    aiModel: typeof twin.attributes.aiModel === 'string' ? twin.attributes.aiModel : undefined,
    components: [source, ...components], connections }
}

function readable(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
}
