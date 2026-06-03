import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsClient } from './SettingsClient'
import type { UserPreferences } from '@/lib/types'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/settings')

  const supabase = createAdminClient()

  const [{ data: vectorRow }, { data: profile }] = await Promise.all([
    supabase
      .from('skill_vectors')
      .select('id, source_filename, created_at, vector_data')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('profiles')
      .select('preferences, email, name')
      .eq('id', session.user.id)
      .single(),
  ])

  return (
    <AppShell>
      <SettingsClient
        user={{
          email: session.user.email ?? '',
          name: session.user.name ?? null,
          image: session.user.image ?? null,
        }}
        vectorRow={vectorRow ?? null}
        initialPreferences={(profile?.preferences as UserPreferences) ?? {}}
      />
    </AppShell>
  )
}
