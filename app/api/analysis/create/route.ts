import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { callLLM } from '@/lib/gemini'
import { buildAnalysisPrompt } from '@/lib/prompts'
import { checkRateLimit } from '@/lib/rate-limit'
import type { CombinedAnalysisResult, SkillVector, UserPreferences } from '@/lib/types'

const bodySchema = z.object({
  jdText: z.string().min(50, 'Job description must be at least 50 characters'),
  jdTitle: z.string().optional(),
  jdCompany: z.string().optional(),
  preferences: z.object({
    roleTypes: z.array(z.string()).default([]),
    seniority: z.string().default(''),
    location: z.string().default(''),
    workStyle: z.enum(['Remote', 'Hybrid', 'On-site', 'No preference']).default('No preference'),
    growthPriorities: z.array(z.string()).default([]),
  }),
})

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      try {
        const session = await auth()
        if (!session?.user?.id) {
          send('error', { message: 'Unauthorized' })
          controller.close()
          return
        }

        const userId = session.user.id

        const rateLimitResult = checkRateLimit(userId)
        if (!rateLimitResult.allowed) {
          send('error', { message: 'Rate limit exceeded. Maximum 20 analyses per hour.' })
          controller.close()
          return
        }

        const body = await req.json()
        const parsed = bodySchema.safeParse(body)
        if (!parsed.success) {
          send('error', { message: parsed.error.issues[0]?.message ?? 'Invalid request' })
          controller.close()
          return
        }

        const { jdText, jdTitle, jdCompany, preferences } = parsed.data

        const supabase = createAdminClient()

        const { data: vectorRow } = await supabase
          .from('skill_vectors')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (!vectorRow) {
          send('error', { message: 'No CV found. Please upload your CV first.' })
          controller.close()
          return
        }

        const vector = vectorRow.vector_data as SkillVector
        const userPrefs = preferences as UserPreferences

        // Single LLM call — replaces two sequential calls
        const t1 = Date.now()
        const result = (await callLLM(buildAnalysisPrompt(vector, jdText, userPrefs))) as CombinedAnalysisResult
        const latencyMs = Date.now() - t1

        send('confidence', {
          confidence: result.confidence,
          summary: result.summary,
          top_strength: result.top_strength,
          top_concern: result.top_concern,
          confidence_factors: result.confidence_factors,
          latency: latencyMs,
        })

        send('gaps', { gaps: result.gaps })
        send('pros_cons', {
          pros: result.pros,
          cons: result.cons,
          preference_alignment: result.preference_alignment,
        })

        // Ensure profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()

        if (!existingProfile) {
          await supabase.from('profiles').insert({
            id: userId,
            email: session.user.email!,
            name: session.user.name ?? null,
          })
        }

        const { data: analysisRow } = await supabase
          .from('analyses')
          .insert({
            user_id: userId,
            vector_id: vectorRow.id,
            jd_title: jdTitle ?? null,
            jd_company: jdCompany ?? null,
            jd_raw: jdText,
            confidence: result.confidence,
            summary: result.summary,
            gaps: result.gaps,
            pros: result.pros,
            cons: result.cons,
            recommendations: result.gaps.flatMap((g) => g.recommendations),
            preferences_snapshot: userPrefs,
            latency_phase1_ms: latencyMs,
            latency_phase2_ms: null,
          })
          .select()
          .single()

        send('done', { analysisId: analysisRow?.id ?? null })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
        try {
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`)
          )
        } catch {
          // stream already closed
        }
      } finally {
        try {
          controller.close()
        } catch {
          // already closed
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
