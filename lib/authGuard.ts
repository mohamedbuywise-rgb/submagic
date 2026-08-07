import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './supabaseAdmin'

type CreditField = 'credits_minutes' | 'credits_images'

interface GuardResult {
  userId: string
  profile: { credits_minutes: number; credits_images: number }
}

/**
 * Confirms the request carries a valid Supabase access token (sent by the
 * dashboard as `Authorization: Bearer <token>`) and that the account still
 * has credits left for this kind of job. Returns a ready-to-send
 * NextResponse when the request should be rejected, or the verified
 * user/profile when it's good to proceed.
 */
export async function requireUserWithCredits(
  req: NextRequest,
  field: CreditField
): Promise<GuardResult | { reject: NextResponse }> {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return { reject: NextResponse.json({ error: 'Please log in first.' }, { status: 401 }) }
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !userData.user) {
    return { reject: NextResponse.json({ error: 'Please log in first.' }, { status: 401 }) }
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('credits_minutes, credits_images')
    .eq('id', userData.user.id)
    .single()

  if (profileError || !profile) {
    return { reject: NextResponse.json({ error: 'Account profile not found.' }, { status: 404 }) }
  }

  if ((profile[field] ?? 0) <= 0) {
    return { reject: NextResponse.json({ error: 'You are out of credits for this tool.' }, { status: 402 }) }
  }

  return { userId: userData.user.id, profile }
}

/** Deducts credits after a job is successfully queued. Best-effort — a failed
 * deduction should never block the job the user already paid credits for. */
export async function deductCredits(userId: string, field: CreditField, amount = 1) {
  const { data: profile } = await supabaseAdmin.from('profiles').select(field).eq('id', userId).single()
  const current = (profile as Record<CreditField, number> | null)?.[field] ?? 0
  await supabaseAdmin
    .from('profiles')
    .update({ [field]: Math.max(0, current - amount) })
    .eq('id', userId)
}

/** Records the job against the user so it shows up in their real "Recent Files". */
export async function recordJob(params: {
  id: string
  userId: string
  tool: string
  fileName?: string | null
}) {
  await supabaseAdmin.from('jobs').insert({
    id: params.id,
    user_id: params.userId,
    tool: params.tool,
    file_name: params.fileName ?? null,
    status: 'pending',
  })
}
