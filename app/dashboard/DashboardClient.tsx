'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CVUploader } from '@/components/cv/CVUploader'
import { Zap, ArrowRight, Clock } from 'lucide-react'
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

const confidenceColors: Record<string, string> = {
  HIGH: 'bg-green-600 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-red-500 text-white',
}

interface Props {
  user: { name: string | null; email: string }
  vectorRow: VectorRow | null
  recentAnalyses: Analysis[]
}

export function DashboardClient({ user, vectorRow, recentAnalyses }: Props) {
  const [currentVector, setCurrentVector] = useState<VectorRow | null>(vectorRow)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Good {getTimeOfDay()}{user.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s your JobFit dashboard.</p>
      </div>

      {/* CV Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your CV</CardTitle>
          </CardHeader>
          <CardContent>
            <CVUploader
              status={{
                hasVector: !!currentVector,
                vectorId: currentVector?.id,
                filename: currentVector?.source_filename ?? undefined,
                uploadedAt: currentVector?.created_at,
                summary: (currentVector?.vector_data as SkillVector)?.summary ?? undefined,
              }}
              onUploadComplete={(vectorId, summary) => {
                setCurrentVector({
                  id: vectorId,
                  source_filename: null,
                  created_at: new Date().toISOString(),
                  vector_data: { summary } as SkillVector,
                })
              }}
              onDelete={() => setCurrentVector(null)}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      {currentVector && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/analyse">
            <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 p-6 cursor-pointer transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Analyse a new job</p>
                    <p className="text-xs text-muted-foreground">Paste a JD and get instant fit analysis</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Recent analyses */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Analyses</h2>
          {recentAnalyses.length > 0 && (
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
            <p className="text-sm">No analyses yet.</p>
            <p className="text-xs mt-1">
              {currentVector ? 'Analyse your first job description above.' : 'Upload your CV to get started.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAnalyses.map((analysis) => (
              <Link key={analysis.id} href={`/analyse/${analysis.id}`}>
                <div className="rounded-lg border bg-card hover:bg-muted/50 transition-colors p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {analysis.jd_title ?? 'Untitled Position'}
                      {analysis.jd_company && (
                        <span className="text-muted-foreground font-normal"> · {analysis.jd_company}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                      <Clock className="h-3 w-3 shrink-0" />
                      {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                      {analysis.summary && ` · ${analysis.summary.slice(0, 60)}...`}
                    </p>
                  </div>
                  {analysis.confidence && (
                    <Badge className={`shrink-0 text-xs ${confidenceColors[analysis.confidence] ?? ''}`}>
                      {analysis.confidence}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
