'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Zap, ArrowRight, Building2, RefreshCw } from 'lucide-react'
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

const confidenceColors: Record<string, string> = {
  HIGH: 'bg-green-600 text-white hover:bg-green-700',
  MEDIUM: 'bg-amber-500 text-white hover:bg-amber-600',
  LOW: 'bg-red-500 text-white hover:bg-red-600',
}

export function HistoryClient({ analyses }: { analyses: Analysis[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} saved
          </p>
        </div>
        <Link href="/analyse">
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center text-muted-foreground">
          <Zap className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No analyses yet</p>
          <p className="text-sm mt-1">Analyse a job description to see it here.</p>
          <Link href="/analyse">
            <Button className="mt-4 gap-2" variant="outline">
              Start analysing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis, i) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:bg-muted/40 transition-colors group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Main content — links to detail */}
                    <Link href={`/analyse/${analysis.id}`} className="min-w-0 flex-1 block">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-sm">
                              {analysis.jd_title ?? 'Untitled Position'}
                            </h3>
                            {analysis.confidence && (
                              <Badge className={`text-xs ${confidenceColors[analysis.confidence] ?? ''}`}>
                                {analysis.confidence}
                              </Badge>
                            )}
                            {analysis.parent_analysis_id && (
                              <Badge variant="outline" className="text-xs border-violet-300 text-violet-600 dark:text-violet-400">
                                Re-run
                              </Badge>
                            )}
                          </div>

                          {analysis.jd_company && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Building2 className="h-3 w-3 shrink-0" />
                              {analysis.jd_company}
                            </p>
                          )}

                          {analysis.summary && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {analysis.summary}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                            {analysis.latency_phase1_ms && (
                              <span className="ml-2 text-muted-foreground/60">
                                · scored in {(analysis.latency_phase1_ms / 1000).toFixed(1)}s
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                    </Link>

                    {/* Re-analyse action — appears on hover */}
                    <Link
                      href={`/analyse?from=${analysis.id}`}
                      className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                        <RefreshCw className="h-3 w-3" />
                        Re-analyse
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
