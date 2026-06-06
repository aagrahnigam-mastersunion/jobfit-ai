'use client'

import { motion } from 'framer-motion'
import type { Phase1Result } from '@/lib/types'

const confidenceConfig = {
  HIGH: {
    bg: 'bg-high-confidence-container',
    borderColor: '#2E7D32',
    badgeBg: 'bg-high-confidence',
    label: 'HIGH MATCH',
    strengthColor: 'text-high-confidence',
    concernColor: 'text-medium-confidence',
  },
  MEDIUM: {
    bg: 'bg-medium-confidence-container',
    borderColor: '#E65100',
    badgeBg: 'bg-medium-confidence',
    label: 'MEDIUM MATCH',
    strengthColor: 'text-high-confidence',
    concernColor: 'text-medium-confidence',
  },
  LOW: {
    bg: 'bg-low-confidence-container',
    borderColor: '#C62828',
    badgeBg: 'bg-low-confidence',
    label: 'LOW MATCH',
    strengthColor: 'text-high-confidence',
    concernColor: 'text-low-confidence',
  },
}

interface Props {
  data: Phase1Result
}

export function ConfidenceCard({ data }: Props) {
  const config = confidenceConfig[data.confidence]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`rounded-2xl ${config.bg} p-6`}
        style={{
          borderLeft: `4px solid ${config.borderColor}`,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Badge + latency */}
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <p
              className="text-xs font-medium text-on-surface-variant mb-2"
              style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}
            >
              Match Confidence
            </p>
            <span
              className={`inline-flex items-center ${config.badgeBg} text-white text-sm font-bold px-4 py-1.5 rounded-full`}
              style={{ letterSpacing: '0.5px' }}
            >
              {config.label}
            </span>
            {data.latency && (
              <p className="text-xs text-on-surface-variant mt-2">
                Assessed in {(data.latency / 1000).toFixed(1)}s
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-on-surface leading-relaxed mb-4">{data.summary}</p>

        {/* Strength + Concern */}
        {(data.top_strength || data.top_concern) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {data.top_strength && (
              <div className="bg-white/70 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="material-symbols-outlined text-high-confidence"
                    style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <p className="text-xs font-medium text-high-confidence">Top Strength</p>
                </div>
                <p className="text-sm text-on-surface">{data.top_strength}</p>
              </div>
            )}
            {data.top_concern && (
              <div className="bg-white/70 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="material-symbols-outlined text-medium-confidence"
                    style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  <p className="text-xs font-medium text-medium-confidence">Top Concern</p>
                </div>
                <p className="text-sm text-on-surface">{data.top_concern}</p>
              </div>
            )}
          </div>
        )}

        {/* Key factors */}
        {data.confidence_factors?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">Key Factors</p>
            <ul className="space-y-1">
              {data.confidence_factors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                  <span className="text-on-surface-variant mt-0.5 shrink-0">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}
