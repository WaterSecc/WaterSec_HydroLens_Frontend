import { apiClient } from '@/lib/api/client'
import type { ApiEnvelope, DigitalTwinSession, HotelArchetype, HotelArchetypeResponse } from './types'
export async function getHotelArchetypes() { return (await apiClient.get<ApiEnvelope<HotelArchetypeResponse[]>>('/hotel-archetypes')).data.data }
export async function createDigitalTwinSession(archetype: HotelArchetype) { return (await apiClient.post<ApiEnvelope<DigitalTwinSession>>('/digital-twin-sessions', { archetype })).data.data }
export async function getDigitalTwinSession(sessionId: string) { return (await apiClient.get<ApiEnvelope<DigitalTwinSession>>(`/digital-twin-sessions/${sessionId}`)).data.data }
export async function deleteDigitalTwinSession(sessionId: string) { await apiClient.delete(`/digital-twin-sessions/${sessionId}`) }
export async function resetDigitalTwinScenario(sessionId: string) { return (await apiClient.post<ApiEnvelope<DigitalTwinSession>>(`/digital-twin-sessions/${sessionId}/scenario/reset`)).data.data }
export type AiStatus = { configured: boolean; mode: string; model: string; version: string; role: string; message: string }
export async function getAiStatus() { return (await apiClient.get<ApiEnvelope<AiStatus>>('/ai/status')).data.data }
