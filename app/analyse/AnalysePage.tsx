'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { PreferenceForm } from '@/components/preferences/PreferenceForm'
import { Loader2, Settings2, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import type { Phase1Result, Gap, Pro, Con, PreferenceAlignment, UserPreferences, ConfidenceTier } from '@/lib/types'

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

const confidenceColors: Record<string, string> = {
  HIGH: 'bg-green-600 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-red-500 text-white',
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
  const [showPreferences, setShowPreferences] = useState(false)
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

      if (!response.ok || !response.body) {
        throw new Error('Failed to start analysis.')
      }

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
                setAnalysisState((prev) => ({
                  ...prev,
                  status: 'done',
                  analysisId: data.analysisId,
                }))
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analyse a Job</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste a job description and get an instant fit analysis.
        </p>
      </div>

      {/* Re-analyse banner */}
      {initialJd && (
        <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/20 p-4 flex items-start gap-3 mb-6">
          <RefreshCw className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
              Re-analysing with your current CV
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>
                Pre-filled from:{' '}
                <span className="font-medium">
                  {initialJd.title || 'Untitled'}
                  {initialJd.company && ` at ${initialJd.company}`}
                </span>
              </span>
              {initialJd.parentConfidence && (
                <span className="flex items-center gap-1">
                  · Original score:
                  <Badge className={`text-xs ${confidenceColors[initialJd.parentConfidence]}`}>
                    {initialJd.parentConfidence}
                  </Badge>
                </span>
              )}
            </p>
          </div>
          <Link href={`/analyse/${initialJd.parentId}`} className="shrink-0">
            <Button variant="outline" size="sm" className="text-xs h-7 border-violet-300 dark:border-violet-700">
              View original
            </Button>
          </Link>
        </div>
      )}

      {!hasVector && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">No CV uploaded yet</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              <Link href="/dashboard" className="underline">Upload your CV</Link> first to enable analysis.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: JD input */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Job Title (optional)</Label>
                  <Input
                    placeholder="e.g. Senior Engineer"
                    value={jdTitle}
                    onChange={(e) => setJdTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Company (optional)</Label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={jdCompany}
                    onChange={(e) => setJdCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Job Description *</Label>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="min-h-[280px] font-mono text-sm resize-y"
                />
                <p className="text-xs text-muted-foreground">
                  {jdText.length} characters {jdText.length < 50 && jdText.length > 0 && '· minimum 50'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={handleAnalyse}
                  disabled={analysisState.status === 'loading' || !hasVector || jdText.length < 50}
                  className="gap-2"
                >
                  {analysisState.status === 'loading' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Analysing...</>
                  ) : initialJd ? (
                    <><RefreshCw className="h-4 w-4" />Re-analyse Fit</>
                  ) : (
                    'Analyse Fit'
                  )}
                </Button>

                {/* Mobile preferences toggle */}
                <div className="lg:hidden">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
                      <Settings2 className="h-4 w-4" />
                      Preferences
                    </DialogTrigger>
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
            </CardContent>
          </Card>

          {/* Results */}
          <AnalysisResults state={analysisState} onReset={handleReset} />
        </div>

        {/* Right: Preferences (desktop) */}
        <div className="hidden lg:block">
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer select-none"
              onClick={() => setShowPreferences(!showPreferences)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Preferences
                </CardTitle>
                {showPreferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <p className="text-xs text-muted-foreground">Influence the analysis weighting</p>
            </CardHeader>
            {showPreferences && (
              <CardContent>
                <PreferenceForm
                  initialPreferences={preferences}
                  onSave={(p) => setPreferences(p)}
                  compact
                />
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
