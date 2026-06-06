'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Analysis {
  id: string
  jd_title: string | null
  jd_company: string | null
  confidence: string | null
  summary: string | null
  created_at: string
  latency_phase1_ms: number | null
  parent_analysis_id: string | null
}

const confidenceBadge: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-high-confidence-container', text: 'text-high-confidence' },
  MEDIUM: { bg: 'bg-medium-confidence-container', text: 'text-medium-confidence' },
  LOW: { bg: 'bg-low-confidence-container', text: 'text-low-confidence' },
}

const filterOptions = ['All', 'HIGH', 'MEDIUM', 'LOW'] as const
type Filter = (typeof filterOptions)[number]

function getInitials(str: string) {
  return str.trim().slice(0, 2).toUpperCase()
}

export function HistoryClient({ analyses }: { analyses: Analysis[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = analyses.filter((a) => {
    const matchesFilter = filter === 'All' || a.confidence === filter
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      a.jd_title?.toLowerCase().includes(q) ||
      a.jd_company?.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="font-bold text-on-surface"
            style={{ fontFamily: 'Source Sans 3', fontSize: '32px', lineHeight: '40px' }}
          >
            Analysis History
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} saved
          </p>
        </div>
        <Link href="/analyse">
          <button
            className="flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Roboto Flex' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            New Analysis
          </button>
        </Link>
      </div>

      {/* Search + filter chips */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            style={{ fontSize: '20px' }}
          >
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
              style={{ fontFamily: 'Roboto Flex' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-outline-variant p-14 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] opacity-30 mb-3 block">analytics</span>
          <p className="font-medium">No analyses yet</p>
          <p className="text-sm mt-1">Analyse a job description to see it here.</p>
          <Link href="/analyse">
            <button className="mt-4 border border-outline-variant text-on-surface-variant rounded-full px-5 py-2 text-sm hover:bg-surface-container transition-colors">
              Start analysing
            </button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
          <p className="text-sm">No results match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((analysis, i) => {
            const badge = analysis.confidence ? confidenceBadge[analysis.confidence] : null
            const company = analysis.jd_company ?? analysis.jd_title ?? '?'
            return (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group"
              >
                <div className="rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(company)}
                  </div>

                  {/* Content */}
                  <Link href={`/analyse/${analysis.id}`} className="flex-1 min-w-0 block">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-on-surface">
                        {analysis.jd_title ?? 'Untitled Position'}
                      </p>
                      {analysis.parent_analysis_id && (
                        <span className="text-xs border border-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                          Re-run
                        </span>
                      )}
                    </div>
                    {analysis.jd_company && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{analysis.jd_company}</p>
                    )}
                    <p className="text-xs text-on-surface-variant mt-1">
                      Analysed {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                      {analysis.latency_phase1_ms && (
                        <> · scored in {(analysis.latency_phase1_ms / 1000).toFixed(1)}s</>
                      )}
                    </p>
                  </Link>

                  {/* Right: badge + re-analyse */}
                  <div className="flex items-center gap-3 shrink-0">
                    {badge && (
                      <span className={`${badge.bg} ${badge.text} text-xs font-medium px-3 py-1 rounded-full`}>
                        {analysis.confidence}
                      </span>
                    )}
                    <Link
                      href={`/analyse?from=${analysis.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant text-on-surface-variant text-xs rounded-full px-3 py-1.5 hover:bg-surface-container"
                    >
                      Re-analyse
                    </Link>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>
                      chevron_right
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
