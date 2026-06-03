'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Gap } from '@/lib/types'

const failureModeConfig: Record<string, { color: string; label: string }> = {
  ATS_KEYWORD: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'ATS Keyword' },
  EXPERIENCE_FRAMING: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Experience Framing' },
  SENIORITY_MISMATCH: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Seniority Mismatch' },
  LOCATION: { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'Location' },
  COMPETITION: { color: 'bg-pink-100 text-pink-700 border-pink-200', label: 'Competition' },
  EDUCATION: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', label: 'Education' },
  CERTIFICATION: { color: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Certification' },
}

const severityConfig: Record<string, { color: string; label: string }> = {
  CRITICAL: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Critical' },
  MODERATE: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Moderate' },
  NICE_TO_HAVE: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Nice to Have' },
}

interface Props {
  gap: Gap
  index: number
}

export function GapCard({ gap, index }: Props) {
  const failureMode = failureModeConfig[gap.failure_mode] ?? { color: 'bg-gray-100 text-gray-700 border-gray-200', label: gap.failure_mode }
  const severity = severityConfig[gap.severity] ?? { color: 'bg-gray-100 text-gray-600 border-gray-200', label: gap.severity }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start gap-2 justify-between">
            <h3 className="font-medium text-sm flex-1 min-w-0">{gap.gap}</h3>
            <div className="flex gap-1.5 flex-wrap shrink-0">
              <Badge variant="outline" className={`text-xs ${failureMode.color}`}>
                {failureMode.label}
              </Badge>
              <Badge variant="outline" className={`text-xs ${severity.color}`}>
                {severity.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <blockquote className="border-l-2 border-muted pl-3 text-xs text-muted-foreground italic">
            &ldquo;{gap.jd_evidence}&rdquo;
          </blockquote>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Recommendations</p>
            <ol className="space-y-1">
              {gap.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
