'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { PreferenceForm } from '@/components/preferences/PreferenceForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type {
  Phase1Result,
  Gap,
  Pro,
  Con,
  PreferenceAlignment,
  UserPreferences,
  ConfidenceTier,
} from '@/lib/types'

interface AnalysisState {
  status: 'idle' | 'loading' | 'done' | 'error'
  confidence: Phase1Result | null
  gaps: Gap[]
  pros: Pro[]
  cons: Con[]
  preferenceAlignment: PreferenceAlignment | null
  analysisId: string | null
  error: string | null
}

const initialState: AnalysisState = {
  status: 'idle',
  confidence: null,
  gaps: [],
  pros: [],
  cons: [],
  preferenceAlignment: null,
  analysisId: null,
  error: null,
}

const confidenceBadge: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-high-confidence-container', text: 'text-high-confidence' },
  MEDIUM: { bg: 'bg-medium-confidence-container', text: 'text-medium-confidence' },
  LOW: { bg: 'bg-low-confidence-container', text: 'text-low-confidence' },
}

interface InitialJd {
  text: string
  title: string
  company: string
  parentId: string
  parentConfidence: ConfidenceTier | null
}

interface Props {
  hasVector: boolean
  initialPreferences: Partial<UserPreferences>
  initialJd?: InitialJd
}

export function AnalysePage({ hasVector, initialPreferences, initialJd }: Props) {
  const [jdText, setJdText] = useState(initialJd?.text ?? '')
  const [jdTitle, setJdTitle] = useState(initialJd?.title ?? '')
  const [jdCompany, setJdCompany] = useState(initialJd?.company ?? '')
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>(initialPreferences)
  const [analysisState, setAnalysisState] = useState<AnalysisState>(initialState)
  const abortRef = useRef<AbortController | null>(null)

  const handleAnalyse = async () => {
    if (!jdText.trim() || jdText.trim().length < 50) {
      toast.error('Please paste a job description (at least 50 characters).')
      return
    }
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setAnalysisState({ ...initialState, status: 'loading' })
    try {
      const response = await fetch('/api/analysis/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText,
          jdTitle: jdTitle || undefined,
          jdCompany: jdCompany || undefined,
          parentAnalysisId: initialJd?.parentId,
          preferences: {
            roleTypes: preferences.roleTypes ?? [],
            seniority: preferences.seniority ?? '',
            location: preferences.location ?? '',
            workStyle: preferences.workStyle ?? 'No preference',
            growthPriorities: preferences.growthPriorities ?? [],
          },
        }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) throw new Error('Failed to start analysis.')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let lastEvent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            lastEvent = line.replace('event: ', '').trim()
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''))
              if (lastEvent === 'confidence') {
                setAnalysisState((prev) => ({ ...prev, confidence: data }))
              } else if (lastEvent === 'gaps') {
                setAnalysisState((prev) => ({ ...prev, gaps: data.gaps ?? [] }))
              } else if (lastEvent === 'pros_cons') {
                setAnalysisState((prev) => ({
                  ...prev,
                  pros: data.pros ?? [],
                  cons: data.cons ?? [],
                  preferenceAlignment: data.preference_alignment ?? null,
                }))
              } else if (lastEvent === 'done') {
                setAnalysisState((prev) => ({ ...prev, status: 'done', analysisId: data.analysisId }))
              } else if (lastEvent === 'error') {
                setAnalysisState((prev) => ({
                  ...prev,
                  status: 'error',
                  error: data.message ?? 'Analysis failed.',
                }))
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setAnalysisState((prev) => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Analysis failed.',
      }))
    }
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setAnalysisState(initialState)
    setJdText('')
    setJdTitle('')
    setJdCompany('')
  }

  const isLoading = analysisState.status === 'loading'

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-bold text-on-surface"
          style={{ fontFamily: 'Source Sans 3', fontSize: '32px', lineHeight: '40px' }}
        >
          Analyse a Job
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Paste a job description to get your personalised match analysis.
        </p>
      </div>

      {/* Re-analyse banner */}
      {initialJd && (
        <div className="rounded-xl border border-secondary-container bg-primary/5 p-4 flex items-start gap-3 mb-6">
          <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: '20px' }}>
            refresh
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-surface">Re-analysing with your current CV</p>
            <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-2 flex-wrap">
              <span>
                Pre-filled from:{' '}
                <span className="font-medium">
                  {initialJd.title || 'Untitled'}
                  {initialJd.company && ` at ${initialJd.company}`}
                </span>
              </span>
              {initialJd.parentConfidence && confidenceBadge[initialJd.parentConfidence] && (
                <span className="flex items-center gap-1">
                  · Original score:
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${confidenceBadge[initialJd.parentConfidence].bg} ${confidenceBadge[initialJd.parentConfidence].text}`}
                  >
                    {initialJd.parentConfidence}
                  </span>
                </span>
              )}
            </p>
          </div>
          <Link href={`/analyse/${initialJd.parentId}`} className="shrink-0">
            <button className="border border-outline-variant text-on-surface-variant text-xs rounded-full px-3 py-1.5 hover:bg-surface-container transition-colors">
              View original
            </button>
          </Link>
        </div>
      )}

      {/* No CV warning */}
      {!hasVector && (
        <div className="rounded-xl border border-[#FFE0B2] bg-[#FFF8E1] p-4 flex items-start gap-3 mb-6">
          <span className="material-symbols-outlined text-[#E65100] shrink-0 mt-0.5" style={{ fontSize: '20px' }}>
            warning
          </span>
          <div>
            <p className="text-sm font-medium text-[#E65100]">No CV uploaded yet</p>
            <p className="text-xs text-[#BF360C] mt-0.5">
              <Link href="/dashboard" className="underline">Upload your CV</Link> first to enable analysis.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: JD input */}
        <div className="space-y-4">
          <div
            className="bg-card rounded-2xl p-5"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }}
          >
            <label
              className="block text-sm font-medium text-on-surface mb-3"
              style={{ fontFamily: 'Source Sans 3' }}
            >
              Job Description
            </label>
            <textarea
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full min-h-[280px] p-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-y focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono leading-relaxed"
            />
            <p className="text-xs text-on-surface-variant mt-2">
              {jdText.length} characters
              {jdText.length < 50 && jdText.length > 0 && ' · minimum 50'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Job Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Engineer"
                  value={jdTitle}
                  onChange={(e) => setJdTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  Company (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={jdCompany}
                  onChange={(e) => setJdCompany(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAnalyse}
                disabled={isLoading || !hasVector || jdText.length < 50}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-full py-3.5 px-6 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'Roboto Flex' }}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analysing...</>
                ) : initialJd ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                    Re-analyse Fit
                  </>
                ) : (
                  <>
                    Analyse My Fit
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </>
                )}
              </button>

              <div className="lg:hidden">
                <Dialog>
                  <DialogTrigger
                    render={
                      <button className="flex items-center gap-2 border border-outline-variant text-on-surface-variant rounded-full py-3.5 px-4 text-sm hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
                        Prefs
                      </button>
                    }
                  />
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Preferences</DialogTitle>
                    </DialogHeader>
                    <PreferenceForm
                      initialPreferences={preferences}
                      onSave={(p) => setPreferences(p)}
                      compact
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <AnalysisResults state={analysisState} onReset={handleReset} />
        </div>

        {/* Right: Preferences (desktop) */}
        <div className="hidden lg:block">
          <div
            className="bg-card rounded-2xl p-5 sticky top-8"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-medium text-on-surface"
                style={{ fontFamily: 'Source Sans 3', fontSize: '16px' }}
              >
                Your Preferences
              </h3>
              <span
                className="material-symbols-outlined text-on-surface-variant"
                style={{ fontSize: '18px' }}
              >
                edit
              </span>
            </div>
            <PreferenceForm
              initialPreferences={preferences}
              onSave={(p) => setPreferences(p)}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  )
}
