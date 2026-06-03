import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { AnalysisDetailClient } from './AnalysisDetailClient'
import type { Analysis } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
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

  return (
    <AppShell>
      <AnalysisDetailClient analysis={data as Analysis} />
    </AppShell>
  )
}
