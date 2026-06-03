import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'

const preferencesSchema = z.object({
  roleTypes: z.array(z.string()).default([]),
  seniority: z.string().default(''),
  location: z.string().default(''),
  workStyle: z.enum(['Remote', 'Hybrid', 'On-site', 'No preference']).default('No preference'),
  growthPriorities: z.array(z.string()).default([]),
})

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = preferencesSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid preferences data' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const userId = session.user.id

  // Upsert profile with new preferences
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: session.user.email!,
      name: session.user.name ?? null,
      preferences: parsed.data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', session.user.id)
    .single()

  return NextResponse.json({ preferences: data?.preferences ?? {} })
}
