import { cn } from '@/lib/utils'
const styles = { operational: 'bg-success', warning: 'bg-warning', critical: 'bg-destructive', inactive: 'bg-muted-foreground', info: 'bg-info' }
export function StatusChip({ status, label }: { status: keyof typeof styles; label?: string }) { return <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium capitalize"><span className={cn('size-2 rounded-full', styles[status])} />{label ?? status}</span> }
