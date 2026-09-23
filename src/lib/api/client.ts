import axios, { AxiosError } from 'axios'
export interface ApiEnvelope<T> { data: T; message?: string; timestamp?: string }
export interface ApiError { status: number; message: string; details?: unknown }
const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/api/v1'

export const apiClient = axios.create({ baseURL: apiBaseUrl, timeout: 60_000, headers: { 'Content-Type': 'application/json' } })

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; details?: unknown }>) => {
    const response = error.response
    const noResponse = !response
    const timedOut = error.code === 'ECONNABORTED'
    const message = noResponse
      ? timedOut
        ? 'The backend did not respond within 60 seconds. Check that it is running and that Hugging Face is reachable.'
        : `Cannot reach the HydroLens backend at ${apiBaseUrl}. Start the Spring Boot backend on port 8081, then try again.`
      : response.data?.message ?? `The backend returned HTTP ${response.status}.`

    return Promise.reject<ApiError>({
      status: response?.status ?? 0,
      message,
      details: response?.data?.details,
    })
  },
)
