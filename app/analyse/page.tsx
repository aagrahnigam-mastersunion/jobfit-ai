import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { AnalysePage } from './AnalysePage'
import type { UserPreferences, ConfidenceTier } from '@/lib/types'

interface Props {
  searchParams: Promise<{ from?: string }>
}

export default async function Analyse({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/analyse')

  const { from } = await searchParams
  const supabase = createAdminClient()

  const [{ data: vectorRow }, { data: profile }] = await Promise.all([
    supabase
      .from('skill_vectors')
      .select('id, source_filename, vector_data')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('profiles')
      .select('preferences')
      .eq('id', session.user.id)
      .single(),
  ])

  // If ?from=<id> is set, pre-fill from the referenced analysis
  let initialJd:
    | { text: string; title: string; company: string; parentId: string; parentConfidence: ConfidenceTier | null }
    | undefined

  if (from) {
    const { data: ref } = await supabase
      .from('analyses')
      .select('jd_raw, jd_title, jd_company, confidence')
      .eq('id', from)
      .eq('user_id', session.user.id)
      .single()

    if (ref) {
      initialJd = {
        text: ref.jd_raw,
        title: ref.jd_title ?? '',
        company: ref.jd_company ?? '',
        parentId: from,
        parentConfidence: (ref.confidence as ConfidenceTier) ?? null,
      }
    }
  }

  return (
    <AppShell>
      <AnalysePage
        hasVector={!!vectorRow}
        initialPreferences={(profile?.preferences as UserPreferences) ?? {}}
        initialJd={initialJd}
      />
    </AppShell>
  )
}
