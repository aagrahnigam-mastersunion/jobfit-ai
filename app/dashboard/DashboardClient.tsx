'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CVUploader } from '@/components/cv/CVUploader'
import { formatDistanceToNow } from 'date-fns'
import type { SkillVector } from '@/lib/types'

interface VectorRow {
  id: string
  source_filename: string | null
  created_at: string
  vector_data: SkillVector
}

interface Analysis {
  id: string
  jd_title: string | null
  jd_company: string | null
  confidence: string | null
  summary: string | null
  created_at: string
}

const confidenceBadge: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-high-confidence-container', text: 'text-high-confidence' },
  MEDIUM: { bg: 'bg-medium-confidence-container', text: 'text-medium-confidence' },
  LOW: { bg: 'bg-low-confidence-container', text: 'text-low-confidence' },
}

interface Props {
  user: { name: string | null; email: string }
  vectorRow: VectorRow | null
  recentAnalyses: Analysis[]
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function getInitials(str: string) {
  return str.trim().slice(0, 2).toUpperCase()
}

export function DashboardClient({ user, vectorRow, recentAnalyses }: Props) {
  const [currentVector, setCurrentVector] = useState<VectorRow | null>(vectorRow)
  const firstName = user.name?.split(' ')[0] ?? ''

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1
          className="font-bold text-on-surface"
          style={{ fontFamily: 'Source Sans 3', fontSize: '32px', lineHeight: '40px' }}
        >
          Good {getTimeOfDay()}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Ready to analyse your next opportunity?
        </p>
      </div>

      {/* CV Status Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div
          className={`rounded-2xl p-5 ${currentVector ? 'bg-primary/10' : 'bg-[#FFF8E1]'}`}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }}
        >
          <CVUploader
            status={{
              hasVector: !!currentVector,
              vectorId: currentVector?.id,
              filename: currentVector?.source_filename ?? undefined,
              uploadedAt: currentVector?.created_at,
              summary: (currentVector?.vector_data as SkillVector)?.summary ?? undefined,
            }}
            onUploadComplete={(vectorId, summary) =>
              setCurrentVector({
                id: vectorId,
                source_filename: null,
                created_at: new Date().toISOString(),
                vector_data: { summary } as SkillVector,
              })
            }
            onDelete={() => setCurrentVector(null)}
          />
        </div>
      </motion.div>

      {/* Quick stats */}
      {recentAnalyses.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Analyses', value: recentAnalyses.length },
            { label: 'HIGH matches', value: recentAnalyses.filter((a) => a.confidence === 'HIGH').length },
            {
              label: 'Avg confidence',
              value:
                recentAnalyses.filter((a) => a.confidence === 'HIGH').length > recentAnalyses.length / 2
                  ? 'HIGH'
                  : recentAnalyses.filter((a) => a.confidence === 'MEDIUM').length > 0
                    ? 'MED'
                    : 'LOW',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container rounded-2xl p-4 text-center">
              <p className="text-xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Analyse FAB */}
      {currentVector && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/analyse">
            <button
              className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-2xl py-4 px-6 font-medium text-base transition-opacity hover:opacity-90 active:opacity-80"
              style={{
                boxShadow: '0 4px 8px rgba(24,60,230,0.28), 0 2px 4px rgba(24,60,230,0.16)',
                fontFamily: 'Roboto Flex',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
              Analyse a Job
            </button>
          </Link>
        </motion.div>
      )}

      {/* Recent Analyses */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-medium text-on-surface"
            style={{ fontFamily: 'Source Sans 3', fontSize: '22px', lineHeight: '28px' }}
          >
            Recent Analyses
          </h2>
          {recentAnalyses.length > 0 && (
            <Link href="/history" className="text-sm text-primary font-medium hover:opacity-80 transition-opacity">
              View all
            </Link>
          )}
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px] opacity-30 mb-3 block">analytics</span>
            <p className="text-sm">No analyses yet.</p>
            <p className="text-xs mt-1">
              {currentVector ? 'Click "Analyse a Job" above to get started.' : 'Upload your CV to get started.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAnalyses.map((analysis) => {
              const badge = analysis.confidence ? confidenceBadge[analysis.confidence] : null
              const company = analysis.jd_company ?? analysis.jd_title ?? '?'
              return (
                <Link key={analysis.id} href={`/analyse/${analysis.id}`}>
                  <div className="rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                      {getInitials(company)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-on-surface truncate">
                        {analysis.jd_title ?? 'Untitled Position'}
                        {analysis.jd_company && (
                          <span className="text-on-surface-variant font-normal"> at {analysis.jd_company}</span>
                        )}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                        {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {badge && (
                      <span
                        className={`shrink-0 ${badge.bg} ${badge.text} text-xs font-medium px-3 py-1 rounded-full`}
                        style={{ letterSpacing: '0.5px' }}
                      >
                        {analysis.confidence}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: '18px' }}>
                      chevron_right
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
