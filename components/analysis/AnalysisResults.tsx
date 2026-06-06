'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ConfidenceCard } from './ConfidenceCard'
import { GapCard } from './GapCard'
import { ProsConsPanel } from './ProsConsPanel'
import { SkeletonReport } from './SkeletonReport'
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
      <div className="flex items-center justify-center h-48 text-center text-on-surface-variant border-2 border-dashed border-outline-variant rounded-2xl">
        <div>
          <span className="material-symbols-outlined text-[32px] opacity-30 mb-2 block">analytics</span>
          <p className="text-sm">Results will appear here</p>
          <p className="text-xs mt-1 text-on-surface-variant/70">Enter a job description and click Analyse</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-2xl border border-low-confidence-container bg-low-confidence-container p-6 text-center">
        <span className="material-symbols-outlined text-low-confidence text-[28px] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        <p className="text-low-confidence font-medium">Analysis failed</p>
        <p className="text-sm text-on-surface-variant mt-1">{state.error}</p>
        <button
          onClick={onReset}
          className="mt-3 border border-outline-variant text-on-surface-variant rounded-full px-4 py-2 text-sm hover:bg-surface-container transition-colors"
        >
          Try again
        </button>
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

      {state.confidence && <ConfidenceCard data={state.confidence} />}

      {state.gaps.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <h2
            className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
            style={{ letterSpacing: '0.5px' }}
          >
            Gap Analysis
          </h2>
          {state.gaps.map((gap, i) => (
            <GapCard key={i} gap={gap} index={i} />
          ))}
        </motion.div>
      )}

      {state.pros.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <h2
            className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
            style={{ letterSpacing: '0.5px' }}
          >
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
            <button
              className="bg-primary text-white rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Roboto Flex' }}
            >
              View Full Report
            </button>
          </Link>
          <button
            onClick={onReset}
            className="border border-outline-variant text-on-surface-variant rounded-full px-5 py-2.5 text-sm font-medium hover:bg-surface-container transition-colors"
            style={{ fontFamily: 'Roboto Flex' }}
          >
            Analyse Another
          </button>
        </motion.div>
      )}
    </div>
  )
}
