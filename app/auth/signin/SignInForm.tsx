'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    try {
      const res = await signIn('credentials', { email, callbackUrl, redirect: false })
      if (res?.error) {
        toast.error('Sign in failed. Please try again.')
      } else if (res?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>
            work_history
          </span>
          <span className="font-bold text-xl text-primary" style={{ fontFamily: 'Source Sans 3' }}>
            JobFit AI
          </span>
        </Link>

        <div
          className="bg-surface-container-lowest rounded-2xl p-8 space-y-5"
          style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)' }}
        >
          <div className="text-center">
            <h1
              className="font-bold text-on-surface"
              style={{ fontFamily: 'Source Sans 3', fontSize: '28px', lineHeight: '36px' }}
            >
              Sign in to JobFit AI
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Analyse your job fit and track your applications
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-on-surface">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-full py-3 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Roboto Flex' }}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Testing mode — no password required
        </p>
      </div>
    </div>
  )
}
