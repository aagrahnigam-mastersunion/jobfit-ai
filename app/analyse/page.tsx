import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { AnalysePage } from './AnalysePage'
import type { UserPreferences } from '@/lib/types'

export default async function Analyse() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/analyse')

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

  return (
    <AppShell>
      <AnalysePage
        hasVector={!!vectorRow}
        initialPreferences={(profile?.preferences as UserPreferences) ?? {}}
      />
    </AppShell>
  )
}
