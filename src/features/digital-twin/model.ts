import type { LucideIcon } from 'lucide-react'
import { BedDouble, ChefHat, CookingPot, Droplets, Flower2, Heater, Shirt, Sparkles, Waves } from 'lucide-react'

export type TwinComponentKind = 'source' | 'accommodation' | 'service' | 'recreation' | 'utility'
export type TwinComponentStatus = 'operational' | 'attention' | 'inactive'

export type TwinComponent = {
  id: string
  name: string
  kind: TwinComponentKind
  status: TwinComponentStatus
  icon: LucideIcon
  position: { x: number; y: number }
  properties: Array<{ label: string; value: string }>
  expectedDemand: { value: number; unit: string; share: number }
  simulation: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'stable' }>
  recommendations: string[]
  sensors: Array<{ name: string; placement: string; priority: 'High' | 'Medium' | 'Low' }>
}

export type TwinConnection = { id: string; source: string; target: string; label?: string }
export type DigitalTwinModel = { id: string; name: string; type: 'HOTEL'; version: string; generationMode?: 'LLAMA' | 'DETERMINISTIC'; aiModel?: string; components: TwinComponent[]; connections: TwinConnection[] }

const component = (data: TwinComponent) => data
export const hotelTwin: DigitalTwinModel = {
  id: 'hotel-azure-twin', name: 'The Azure Grand', type: 'HOTEL', version: '2D-1.0',
  components: [
    component({ id: 'supply', name: 'Water Supply', kind: 'source', status: 'operational', icon: Droplets, position: { x: 40, y: 280 }, properties: [{ label: 'Source', value: 'Municipal' }, { label: 'Pressure', value: '3.2 bar' }, { label: 'Main diameter', value: '100 mm' }], expectedDemand: { value: 186, unit: 'm³/day', share: 100 }, simulation: [{ label: 'Current flow', value: '7.8 m³/h', trend: 'stable' }, { label: 'Pressure', value: '3.1 bar', trend: 'down' }], recommendations: ['Add a main inlet flow meter', 'Schedule annual backflow testing'], sensors: [{ name: 'Ultrasonic flow meter', placement: 'Main inlet', priority: 'High' }, { name: 'Pressure transducer', placement: 'After backflow valve', priority: 'High' }] }),
    component({ id: 'rooms', name: 'Guest Rooms', kind: 'accommodation', status: 'operational', icon: BedDouble, position: { x: 380, y: 20 }, properties: [{ label: 'Rooms', value: '184' }, { label: 'Average occupancy', value: '72%' }, { label: 'Floors served', value: '8' }], expectedDemand: { value: 86.4, unit: 'm³/day', share: 46 }, simulation: [{ label: 'Today', value: '79.2 m³', trend: 'down' }, { label: 'Peak flow', value: '11.4 m³/h', trend: 'up' }], recommendations: ['Install low-flow showerheads in 42 remaining rooms', 'Inspect high-usage rooms on floor 6'], sensors: [{ name: 'Floor flow meter', placement: 'Each riser', priority: 'High' }, { name: 'Leak detector', placement: 'Bathroom wet walls', priority: 'Medium' }] }),
    component({ id: 'laundry', name: 'Laundry', kind: 'service', status: 'attention', icon: Shirt, position: { x: 380, y: 170 }, properties: [{ label: 'Machines', value: '6' }, { label: 'Loads per day', value: '34' }, { label: 'Efficiency class', value: 'Mixed' }], expectedDemand: { value: 24.5, unit: 'm³/day', share: 13 }, simulation: [{ label: 'Today', value: '26.8 m³', trend: 'up' }, { label: 'Per load', value: '788 L', trend: 'up' }], recommendations: ['Review machine 04 for excessive consumption', 'Shift loads away from morning peak'], sensors: [{ name: 'Inline flow meter', placement: 'Laundry branch', priority: 'High' }, { name: 'Machine current sensor', placement: 'Machine 04', priority: 'Medium' }] }),
    component({ id: 'restaurant', name: 'Restaurant', kind: 'service', status: 'operational', icon: CookingPot, position: { x: 700, y: 70 }, properties: [{ label: 'Seats', value: '210' }, { label: 'Meals per day', value: '380' }, { label: 'Service periods', value: '3' }], expectedDemand: { value: 18.2, unit: 'm³/day', share: 10 }, simulation: [{ label: 'Today', value: '16.9 m³', trend: 'down' }, { label: 'Per meal', value: '44 L', trend: 'stable' }], recommendations: ['Maintain pre-rinse spray valves quarterly'], sensors: [{ name: 'Branch flow meter', placement: 'Restaurant supply', priority: 'Medium' }] }),
    component({ id: 'kitchen', name: 'Kitchen', kind: 'service', status: 'operational', icon: ChefHat, position: { x: 700, y: 220 }, properties: [{ label: 'Dishwashers', value: '3' }, { label: 'Sinks', value: '8' }, { label: 'Hot water loop', value: 'Yes' }], expectedDemand: { value: 14.7, unit: 'm³/day', share: 8 }, simulation: [{ label: 'Current flow', value: '0.9 m³/h', trend: 'stable' }, { label: 'Hot water', value: '58°C', trend: 'stable' }], recommendations: ['Add automatic shutoff to preparation sinks'], sensors: [{ name: 'Temperature probe', placement: 'Hot water return', priority: 'High' }, { name: 'Flow meter', placement: 'Kitchen inlet', priority: 'Medium' }] }),
    component({ id: 'pool', name: 'Pool', kind: 'recreation', status: 'operational', icon: Waves, position: { x: 380, y: 370 }, properties: [{ label: 'Pools', value: '2' }, { label: 'Total volume', value: '640 m³' }, { label: 'Filtration', value: 'Sand' }], expectedDemand: { value: 17.9, unit: 'm³/day', share: 10 }, simulation: [{ label: 'Make-up water', value: '15.6 m³', trend: 'down' }, { label: 'Turnover', value: '5.8 h', trend: 'stable' }], recommendations: ['Cover outdoor pool overnight'], sensors: [{ name: 'Level sensor', placement: 'Balance tank', priority: 'High' }, { name: 'Water quality probe', placement: 'Return line', priority: 'High' }] }),
    component({ id: 'spa', name: 'Spa', kind: 'recreation', status: 'operational', icon: Sparkles, position: { x: 700, y: 370 }, properties: [{ label: 'Treatment rooms', value: '7' }, { label: 'Jacuzzis', value: '2' }, { label: 'Steam rooms', value: '1' }], expectedDemand: { value: 8.1, unit: 'm³/day', share: 4 }, simulation: [{ label: 'Today', value: '7.7 m³', trend: 'stable' }, { label: 'Temperature', value: '38°C', trend: 'stable' }], recommendations: ['Reuse suitable greywater for cleaning'], sensors: [{ name: 'Flow meter', placement: 'Spa branch', priority: 'Medium' }] }),
    component({ id: 'garden', name: 'Garden', kind: 'recreation', status: 'attention', icon: Flower2, position: { x: 380, y: 540 }, properties: [{ label: 'Irrigated area', value: '2,400 m²' }, { label: 'System', value: 'Drip + spray' }, { label: 'Schedule', value: 'Daily' }], expectedDemand: { value: 11.2, unit: 'm³/day', share: 6 }, simulation: [{ label: 'Today', value: '13.5 m³', trend: 'up' }, { label: 'Runtime', value: '126 min', trend: 'up' }], recommendations: ['Reduce irrigation duration by 15%', 'Add soil-moisture based scheduling'], sensors: [{ name: 'Soil moisture sensor', placement: 'Four landscape zones', priority: 'High' }, { name: 'Weather station', placement: 'Roof', priority: 'Medium' }] }),
    component({ id: 'hvac', name: 'HVAC', kind: 'utility', status: 'operational', icon: Heater, position: { x: 700, y: 540 }, properties: [{ label: 'Cooling towers', value: '2' }, { label: 'Chillers', value: '3' }, { label: 'Cycles of concentration', value: '5.2' }], expectedDemand: { value: 5.0, unit: 'm³/day', share: 3 }, simulation: [{ label: 'Make-up flow', value: '0.21 m³/h', trend: 'stable' }, { label: 'Conductivity', value: '1,840 µS/cm', trend: 'stable' }], recommendations: ['Maintain current concentration cycles'], sensors: [{ name: 'Conductivity sensor', placement: 'Cooling tower basin', priority: 'High' }, { name: 'Make-up meter', placement: 'Tower feed', priority: 'Medium' }] }),
  ],
  connections: [
    { id: 's-r', source: 'supply', target: 'rooms', label: 'Potable' }, { id: 's-l', source: 'supply', target: 'laundry' }, { id: 's-p', source: 'supply', target: 'pool' }, { id: 's-g', source: 'supply', target: 'garden' },
    { id: 'r-rest', source: 'rooms', target: 'restaurant' }, { id: 'l-k', source: 'laundry', target: 'kitchen' }, { id: 'p-spa', source: 'pool', target: 'spa' }, { id: 'g-hvac', source: 'garden', target: 'hvac' },
  ],
}
