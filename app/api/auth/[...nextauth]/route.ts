import { handlers } from '@/lib/auth'

// Prevent Next.js from statically caching the auth routes
export const dynamic = 'force-dynamic'

export const { GET, POST } = handlers
