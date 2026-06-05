'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfidenceCard } from '@/components/analysis/ConfidenceCard'
import { GapCard } from '@/components/analysis/GapCard'
import { ProsConsPanel } from '@/components/analysis/ProsConsPanel'
import { ArrowLeft, Trash2, Clock, RefreshCw, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import type { Analysis, Phase1Result, ConfidenceTier } from '@/lib/types'
import type { ParentSummary } from './page'

const confidenceColors: Record<string, string> = {
  HIGH: 'bg-green-600 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-red-500 text-white',
}

interface Props {
  analysis: Analysis
  parentAnalysis: ParentSummary | null
}

export function AnalysisDetailClient({ analysis, parentAnalysis }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this analysis? This cannot be undone.')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/analysis/${analysis.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Analysis deleted.')
      router.push('/history')
    } catch {
      toast.error('Failed to delete analysis.')
      setIsDeleting(false)
    }
  }

  const phase1: Phase1Result | null = analysis.confidence
    ? {
        confidence: analysis.confidence,
        summary: analysis.summary ?? '',
        top_strength: '',
        top_concern: '',
        confidence_factors: [],
        latency: analysis.latency_phase1_ms ?? undefined,
      }
    : null

  const confidenceChanged =
    parentAnalysis?.confidence &&
    analysis.confidence &&
    parentAnalysis.confidence !== analysis.confidence

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/history">
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to history
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            {analysis.jd_title ?? 'Untitled Position'}
            {analysis.jd_company && (
              <span className="text-muted-foreground font-normal"> at {analysis.jd_company}</span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            {analysis.confidence && (
              <>
                <span>·</span>
                <Badge className={`text-xs ${confidenceColors[analysis.confidence] ?? ''}`}>
                  {analysis.confidence}
                </Badge>
              </>
            )}
            {analysis.parent_analysis_id && (
              <>
                <span>·</span>
                <Badge variant="outline" className="text-xs border-violet-300 text-violet-600 dark:text-violet-400">
                  Re-run
                </Badge>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/analyse?from=${analysis.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-4 w-4" />
              Re-analyse
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 gap-1.5"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Re-run comparison banner */}
      {parentAnalysis && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/20 p-4 flex items-center gap-3 flex-wrap">
            <RefreshCw className="h-4 w-4 text-violet-500 shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap text-sm">
              <span className="text-violet-700 dark:text-violet-300">Re-run of</span>
              <Link
                href={`/analyse/${parentAnalysis.id}`}
                className="font-medium text-violet-800 dark:text-violet-200 hover:underline"
              >
                {parentAnalysis.jd_title ?? 'original analysis'}
              </Link>
              {parentAnalysis.confidence && analysis.confidence && (
                <span className="flex items-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">·</span>
                  <Badge className={`text-xs ${confidenceColors[parentAnalysis.confidence]}`}>
                    {parentAnalysis.confidence}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge className={`text-xs ${confidenceColors[analysis.confidence]}`}>
                    {analysis.confidence}
                  </Badge>
                  {confidenceChanged && (
                    <span className="text-xs text-muted-foreground">
                      {(['HIGH', 'MEDIUM', 'LOW'] as ConfidenceTier[]).indexOf(analysis.confidence) <
                      (['HIGH', 'MEDIUM', 'LOW'] as ConfidenceTier[]).indexOf(parentAnalysis.confidence as ConfidenceTier)
                        ? '· improved'
                        : '· regressed'}
                    </span>
                  )}
                </span>
              )}
            </div>
            <Link href={`/analyse/${parentAnalysis.id}`} className="shrink-0">
              <Button variant="outline" size="sm" className="text-xs h-7 border-violet-300 dark:border-violet-700">
                View original
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Confidence card */}
      {phase1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ConfidenceCard data={phase1} />
        </motion.div>
      )}

      {/* Gaps */}
      {analysis.gaps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Gap Taxonomy</h2>
          {analysis.gaps.map((gap, i) => (
            <GapCard key={i} gap={gap} index={i} />
          ))}
        </motion.div>
      )}

      {/* Pros & Cons */}
      {analysis.pros.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pros &amp; Cons</h2>
          <ProsConsPanel pros={analysis.pros} cons={analysis.cons} />
        </motion.div>
      )}

      {/* JD raw */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <details className="rounded-xl border">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium hover:bg-muted/50 rounded-xl">
            View original job description
          </summary>
          <div className="px-4 pb-4">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed mt-2">
              {analysis.jd_raw}
            </pre>
          </div>
        </details>
      </motion.div>

      <div className="flex gap-3">
        <Link href="/analyse">
          <Button>Analyse Another</Button>
        </Link>
        <Link href="/history">
          <Button variant="outline">View History</Button>
        </Link>
      </div>
    </div>
  )
}
