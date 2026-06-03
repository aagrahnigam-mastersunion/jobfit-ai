'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Pro, Con, PreferenceAlignment } from '@/lib/types'

const weightColor = {
  HIGH: 'text-foreground font-medium',
  MEDIUM: 'text-muted-foreground',
  LOW: 'text-muted-foreground/70',
}

interface Props {
  pros: Pro[]
  cons: Con[]
  preferenceAlignment?: PreferenceAlignment
}

export function ProsConsPanel({ pros, cons, preferenceAlignment }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-600">Pros</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <div className="min-w-0">
                    <span className={`text-sm ${weightColor[pro.weight]}`}>{pro.point}</span>
                    {pro.source === 'PREFERENCE' && (
                      <Badge variant="outline" className="ml-1.5 text-xs py-0 px-1">pref</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-red-500">Cons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  <div className="min-w-0">
                    <span className={`text-sm ${weightColor[con.weight]}`}>{con.point}</span>
                    {con.source === 'PREFERENCE' && (
                      <Badge variant="outline" className="ml-1.5 text-xs py-0 px-1">pref</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {preferenceAlignment && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Preference Alignment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preferenceAlignment.aligned.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-1.5">Aligned</p>
                <ul className="space-y-1">
                  {preferenceAlignment.aligned.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-green-500 shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {preferenceAlignment.misaligned.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-600 mb-1.5">Misaligned</p>
                <ul className="space-y-1">
                  {preferenceAlignment.misaligned.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-amber-500 shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
