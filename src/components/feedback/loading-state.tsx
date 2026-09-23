import { LoaderCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function LoadingState({ label = 'Loading', className }: { label?: string; className?: string }) { return <div role="status" className={cn('flex min-h-40 flex-col items-center justify-center gap-3 text-muted-foreground', className)}><LoaderCircle className="size-6 animate-spin text-primary" /><span className="text-sm">{label}</span></div> }
export function CardSkeleton() { return <div className="rounded-xl border border-border p-6"><Skeleton className="mb-6 h-4 w-28" /><Skeleton className="mb-3 h-8 w-36" /><Skeleton className="h-3 w-24" /></div> }
