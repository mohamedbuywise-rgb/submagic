import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

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
    return NextResponse.json({ status: 'failed', error: result.error })
  }

  return NextResponse.json({ status: 'done', result })
}
