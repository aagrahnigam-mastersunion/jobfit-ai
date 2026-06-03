import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { HistoryClient } from './HistoryClient'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/history')

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('analyses')
    .select('id, jd_title, jd_company, confidence, summary, created_at, latency_phase1_ms')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <AppShell>
      <HistoryClient analyses={data ?? []} />
    </AppShell>
  )
}
