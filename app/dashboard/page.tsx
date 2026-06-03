import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/dashboard')

  const supabase = createAdminClient()

  const [{ data: vectorRow }, { data: recentAnalyses }] = await Promise.all([
    supabase
      .from('skill_vectors')
      .select('id, source_filename, created_at, vector_data')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('analyses')
      .select('id, jd_title, jd_company, confidence, summary, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <AppShell>
      <DashboardClient
        user={{ name: session.user.name ?? null, email: session.user.email ?? '' }}
        vectorRow={vectorRow ?? null}
        recentAnalyses={recentAnalyses ?? []}
      />
    </AppShell>
  )
}
