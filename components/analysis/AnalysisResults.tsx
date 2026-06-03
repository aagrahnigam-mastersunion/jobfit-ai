'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ConfidenceCard } from './ConfidenceCard'
import { GapCard } from './GapCard'
import { ProsConsPanel } from './ProsConsPanel'
import { SkeletonReport } from './SkeletonReport'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Phase1Result, Gap, Pro, Con, PreferenceAlignment } from '@/lib/types'

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

interface Props {
  state: AnalysisState
  onReset: () => void
}

export function AnalysisResults({ state, onReset }: Props) {
  if (state.status === 'idle') {
    return (
      <div className="flex items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-xl">
        <div>
          <p className="text-sm">Results will appear here</p>
          <p className="text-xs mt-1">Enter a job description and click Analyse</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 dark:bg-red-950/20 p-6 text-center">
        <p className="text-red-600 font-medium">Analysis failed</p>
        <p className="text-sm text-muted-foreground mt-1">{state.error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onReset}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {state.status === 'loading' && !state.confidence ? (
          <motion.div key="skeleton" exit={{ opacity: 0 }}>
            <SkeletonReport />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state.confidence && (
        <ConfidenceCard data={state.confidence} />
      )}

      {state.gaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Gap Taxonomy
          </h2>
          {state.gaps.map((gap, i) => (
            <GapCard key={i} gap={gap} index={i} />
          ))}
        </motion.div>
      )}

      {state.pros.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Pros &amp; Cons
          </h2>
          <ProsConsPanel
            pros={state.pros}
            cons={state.cons}
            preferenceAlignment={state.preferenceAlignment ?? undefined}
          />
        </motion.div>
      )}

      {state.status === 'done' && state.analysisId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 pt-2"
        >
          <Link href={`/analyse/${state.analysisId}`}>
            <Button>View Full Report</Button>
          </Link>
          <Button variant="outline" onClick={onReset}>
            Analyse Another
          </Button>
        </motion.div>
      )}
    </div>
  )
}
