import { createBrowserRouter } from 'react-router-dom'
import { PitchShell } from '@/components/layout/pitch-shell'
import { ShellPage } from '@/pages/shell-page'
import { DigitalTwinPage } from '@/pages/digital-twin-page'
import { SessionAnalyticsPage } from '@/pages/session-analytics-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { FacilityTypeSelectionPage } from '@/pages/facility-type-selection-page'
export const router = createBrowserRouter([{ element: <PitchShell />, children: [
  { path: '/', element: <FacilityTypeSelectionPage /> },
  { path: '/digital-twins', element: <DigitalTwinPage /> },
  { path: '/digital-twins/new', element: <FacilityTypeSelectionPage /> },
  { path: '/analytics', element: <SessionAnalyticsPage /> },
  { path: '/settings', element: <ShellPage /> },
  { path: '*', element: <NotFoundPage /> },
] }])
