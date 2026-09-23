import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }: { icon?: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void }) { return <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center"><div className="mb-4 rounded-xl bg-muted p-3"><Icon className="size-6 text-muted-foreground" /></div><h3 className="font-semibold">{title}</h3><p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>{actionLabel && <Button className="mt-5" onClick={onAction}>{actionLabel}</Button>}</div> }
