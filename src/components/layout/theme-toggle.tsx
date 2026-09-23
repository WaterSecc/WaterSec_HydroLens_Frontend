import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
export function ThemeToggle() { const { theme, setTheme } = useTheme(); const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'; const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor; return <Button variant="ghost" size="icon" aria-label={`Theme: ${theme}. Switch to ${next}`} onClick={() => setTheme(next)}><Icon /></Button> }
