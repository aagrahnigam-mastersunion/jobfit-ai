'use client'

import { motion } from 'framer-motion'
import type { Gap } from '@/lib/types'

const failureModeConfig: Record<string, { bg: string; text: string; label: string }> = {
  ATS_KEYWORD: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'ATS Keyword' },
  EXPERIENCE_FRAMING: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Experience Framing' },
  SENIORITY_MISMATCH: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Seniority Mismatch' },
  LOCATION: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Location' },
  COMPETITION: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Competition' },
  EDUCATION: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Education' },
  CERTIFICATION: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Certification' },
}

const severityConfig: Record<string, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: 'bg-low-confidence-container', text: 'text-low-confidence', label: 'Critical' },
  MODERATE: { bg: 'bg-medium-confidence-container', text: 'text-medium-confidence', label: 'Moderate' },
  NICE_TO_HAVE: { bg: 'bg-surface-variant', text: 'text-on-surface-variant', label: 'Nice to Have' },
}

interface Props {
  gap: Gap
  index: number
}

export function GapCard({ gap, index }: Props) {
  const failureMode = failureModeConfig[gap.failure_mode] ?? {
    bg: 'bg-surface-variant',
    text: 'text-on-surface-variant',
    label: gap.failure_mode,
  }
  const severity = severityConfig[gap.severity] ?? {
    bg: 'bg-surface-variant',
    text: 'text-on-surface-variant',
    label: gap.severity,
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <div className="bg-surface-variant rounded-xl p-5">
        {/* Header */}
        <div className="flex flex-wrap items-start gap-2 justify-between mb-3">
          <h3 className="font-medium text-sm text-on-surface flex-1 min-w-0">{gap.gap}</h3>
          <div className="flex gap-1.5 flex-wrap shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severity.bg} ${severity.text}`}>
              {severity.label}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${failureMode.bg} ${failureMode.text}`}>
              {failureMode.label}
            </span>
          </div>
        </div>

        {/* JD Evidence */}
        <div
          className="rounded-r-lg px-3 py-2 mb-3"
          style={{ borderLeft: '3px solid #183ce6', backgroundColor: 'rgba(24,60,230,0.06)' }}
        >
          <p className="text-xs text-on-surface-variant italic leading-relaxed">
            &ldquo;{gap.jd_evidence}&rdquo;
          </p>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-xs font-medium text-on-surface-variant mb-2">Recommendations</p>
          <ol className="space-y-1.5">
            {gap.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium mt-0.5">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </motion.div>
  )
}
