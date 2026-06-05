import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { AnalysisDetailClient } from './AnalysisDetailClient'
import type { Analysis, ConfidenceTier } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export interface ParentSummary {
  id: string
  confidence: ConfidenceTier | null
  jd_title: string | null
  jd_company: string | null
}

export default async function AnalysisDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin')

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) notFound()

  const analysis = data as Analysis

  // If this is a re-run, fetch the parent's summary for the comparison banner
  let parentAnalysis: ParentSummary | null = null
  if (analysis.parent_analysis_id) {
    const { data: parent } = await supabase
      .from('analyses')
      .select('id, confidence, jd_title, jd_company')
      .eq('id', analysis.parent_analysis_id)
      .eq('user_id', session.user.id)
      .single()

    if (parent) {
      parentAnalysis = parent as ParentSummary
    }
  }

  return (
    <AppShell>
      <AnalysisDetailClient analysis={analysis} parentAnalysis={parentAnalysis} />
    </AppShell>
  )
}
