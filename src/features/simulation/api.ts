import { apiClient } from '@/lib/api/client'
import type { DigitalTwinSession } from '@/features/digital-twin/types'

export type NormalFlowNode = { id: string; type: 'SOURCE' | 'STORAGE' | 'CONSUMER'; label: string; componentType?: string; currentFlowLitersPerHour: number; dailyConsumptionLiters: number; shareOfTotalPercentage: number; hourlyConsumptionLiters: number[] }
export type NormalFlowEdge = { id: string; from: string; to: string; currentFlowLitersPerHour: number; dailyVolumeLiters: number; hourlyFlowLitersPerHour: number[] }
export type NormalFlowResult = { simulationId: string; facilityId: string; seed: number; currentHour: number; timestamp: string; totalConsumptionLiters: number; estimatedCost: number; hourlyTotalConsumptionLiters: number[]; nodes: NormalFlowNode[]; edges: NormalFlowEdge[]; hourlyStorageLevelLiters?: number[]; remainingAutonomyHours?: number }
export type FlowEventType = 'CONTINUOUS_LEAK' | 'PIPE_BURST' | 'HIGH_OCCUPANCY' | 'HEAT_WAVE' | 'WATER_SUPPLY_INTERRUPTION'
export type FlowEventComparison = { baselineSimulationId: string; eventSimulationId: string; eventType: FlowEventType; baselineConsumptionLiters: number; eventConsumptionLiters: number; absoluteDifferenceLiters: number; percentageDifference: number; equivalentMonthlyDifferenceLiters: number; lostWaterLiters: number; lostWaterCost: number; currency: 'TND'; affectedAssets: string[]; baseline: NormalFlowResult; event: NormalFlowResult }
type Envelope<T> = { data: T }

export const simulationApi = {
  runSessionBaseline: async (sessionId: string, input: { seed?: number; currentHour?: number }) => (await apiClient.post<Envelope<DigitalTwinSession>>(`/digital-twin-sessions/${sessionId}/baseline`, input)).data.data,
  simulateSessionEvent: async (sessionId: string, input: { eventType: FlowEventType; targetComponent?: string; leakFlowLitersPerHour?: number; startHour?: number; durationHours?: number; severity?: 'LOW' | 'MEDIUM' | 'HIGH'; highOccupancyRate?: number; storageCapacityLiters?: number }) => (await apiClient.post<Envelope<DigitalTwinSession>>(`/digital-twin-sessions/${sessionId}/events`, input)).data.data,
}
