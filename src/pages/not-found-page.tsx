import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
export function NotFoundPage() { return <main className="grid min-h-[70vh] place-items-center p-6 text-center"><div><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-2 text-3xl font-bold">Page not found</h1><p className="mt-2 text-muted-foreground">The requested route does not exist.</p><Button asChild className="mt-6"><Link to="/">Return home</Link></Button></div></main> }
