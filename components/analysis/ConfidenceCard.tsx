'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Phase1Result } from '@/lib/types'

const confidenceConfig = {
  HIGH: {
    color: 'bg-green-600 text-white hover:bg-green-700',
    label: 'HIGH MATCH',
    border: 'border-green-200',
    bg: 'bg-green-50 dark:bg-green-950/20',
  },
  MEDIUM: {
    color: 'bg-amber-500 text-white hover:bg-amber-600',
    label: 'MEDIUM MATCH',
    border: 'border-amber-200',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  LOW: {
    color: 'bg-red-500 text-white hover:bg-red-600',
    label: 'LOW MATCH',
    border: 'border-red-200',
    bg: 'bg-red-50 dark:bg-red-950/20',
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
      <Card className={`border-2 ${config.border} ${config.bg}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg">Match Confidence</CardTitle>
            <Badge className={`text-sm px-3 py-1 ${config.color}`}>
              {config.label}
            </Badge>
          </div>
          {data.latency && (
            <p className="text-xs text-muted-foreground">
              Assessed in {(data.latency / 1000).toFixed(1)}s
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{data.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs font-medium text-green-600 mb-1">Top Strength</p>
              <p className="text-sm">{data.top_strength}</p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs font-medium text-red-500 mb-1">Top Concern</p>
              <p className="text-sm">{data.top_concern}</p>
            </div>
          </div>

          {data.confidence_factors?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Key Factors</p>
              <ul className="space-y-1">
                {data.confidence_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
