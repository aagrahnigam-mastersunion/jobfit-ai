'use client'

import { motion } from 'framer-motion'
import type { Pro, Con, PreferenceAlignment } from '@/lib/types'

const weightOpacity: Record<string, string> = {
  HIGH: 'opacity-100',
  MEDIUM: 'opacity-80',
  LOW: 'opacity-60',
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
        {/* Pros */}
        <div className="bg-success-container/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-tertiary"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <p className="font-medium text-sm text-tertiary" style={{ fontFamily: 'Source Sans 3' }}>
              Pros
            </p>
          </div>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm text-on-surface ${weightOpacity[pro.weight]}`}
              >
                <span className="text-tertiary mt-0.5 shrink-0">✓</span>
                <span>
                  {pro.point}
                  {pro.source === 'PREFERENCE' && (
                    <span className="ml-1.5 text-xs border border-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full">
                      pref
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-low-confidence-container/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-low-confidence"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              cancel
            </span>
            <p className="font-medium text-sm text-low-confidence" style={{ fontFamily: 'Source Sans 3' }}>
              Cons
            </p>
          </div>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm text-on-surface ${weightOpacity[con.weight]}`}
              >
                <span className="text-low-confidence mt-0.5 shrink-0">✗</span>
                <span>
                  {con.point}
                  {con.source === 'PREFERENCE' && (
                    <span className="ml-1.5 text-xs border border-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full">
                      pref
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {preferenceAlignment &&
        (preferenceAlignment.aligned.length > 0 || preferenceAlignment.misaligned.length > 0) && (
          <div className="bg-card rounded-xl p-4">
            <p className="font-medium text-sm text-on-surface mb-3" style={{ fontFamily: 'Source Sans 3' }}>
              Preference Alignment
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {preferenceAlignment.aligned.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-tertiary mb-1.5">Aligned</p>
                  <ul className="space-y-1">
                    {preferenceAlignment.aligned.map((item, i) => (
                      <li key={i} className="text-sm text-on-surface-variant flex items-start gap-1.5">
                        <span className="text-tertiary shrink-0">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {preferenceAlignment.misaligned.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-medium-confidence mb-1.5">Misaligned</p>
                  <ul className="space-y-1">
                    {preferenceAlignment.misaligned.map((item, i) => (
                      <li key={i} className="text-sm text-on-surface-variant flex items-start gap-1.5">
                        <span className="text-medium-confidence shrink-0">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
    </motion.div>
  )
}
