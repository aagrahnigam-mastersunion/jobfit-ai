import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { parseFile } from '@/lib/parsers'
import { callLLM } from '@/lib/gemini'
import { buildCVParsingPrompt } from '@/lib/prompts'
import type { SkillVector } from '@/lib/types'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
  }

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
    return NextResponse.json({ error: 'Invalid file type. Please upload PDF or DOCX.' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  let text: string
  try {
    text = await parseFile(buffer, file.type, file.name)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse file'
    return NextResponse.json({ error: message }, { status: 422 })
  }

  if (text.trim().length < 100) {
    return NextResponse.json({ error: 'Could not extract sufficient text from file.' }, { status: 422 })
  }

  const vector = (await callLLM(buildCVParsingPrompt(text))) as SkillVector

  const supabase = createAdminClient()
  const userId = session.user.id

  // Upsert profile (handles first-time users)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email: session.user.email!,
        name: session.user.name ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('[cv/upload] profile upsert failed:', profileError)
    return NextResponse.json({ error: `Profile error: ${profileError.message}` }, { status: 500 })
  }

  // Delete old vectors for this user
  await supabase.from('skill_vectors').delete().eq('user_id', userId)

  const { data, error } = await supabase
    .from('skill_vectors')
    .insert({
      user_id: userId,
      vector_data: vector,
      source_filename: file.name,
    })
    .select()
    .single()

  if (error) {
    console.error('[cv/upload] skill_vectors insert failed:', error)
    return NextResponse.json({ error: `Vector store error: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({
    vectorId: data.id,
    summary: vector.summary,
  })
}
