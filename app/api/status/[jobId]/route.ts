import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function firstResultUrl(result: Record<string, unknown>): string | null {
  const entry = Object.entries(result).find(
    ([k, v]) => k !== 'type' && typeof v === 'string' && v.startsWith('http')
  )
  return entry ? (entry[1] as string) : null
}

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
  }

  const raw = await redis.get(`clipgenie:result:${jobId}`)

  // الـ Worker لسه ماخلصش الشغلانة أو أصلاً لسه واخداش من الطابور
  if (!raw) {
    return NextResponse.json({ status: 'processing' })
  }

  const result = JSON.parse(raw)

  if (result.error) {
    // نحدّث نفس الـ job في جدول jobs عشان "آخر الملفات" الحقيقية تعكس الفشل
    await supabaseAdmin
      .from('jobs')
      .update({ status: 'failed', error_message: String(result.error), completed_at: new Date().toISOString() })
      .eq('id', jobId)
    return NextResponse.json({ status: 'failed', error: result.error })
  }

  // الجوب خلص — نحدّث جدول jobs بالـ status والرابط الحقيقي عشان يظهر صح في الداشبورد
  await supabaseAdmin
    .from('jobs')
    .update({
      status: 'done',
      result_url: firstResultUrl(result),
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId)

  return NextResponse.json({ status: 'done', result })
}
