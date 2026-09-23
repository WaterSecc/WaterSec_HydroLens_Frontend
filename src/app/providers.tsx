import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/query-client'
export function AppProviders({ children }: { children: ReactNode }) { return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></ThemeProvider> }
