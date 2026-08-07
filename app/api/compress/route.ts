import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'
import { requireUserWithCredits, deductCredits, recordJob } from '@/lib/authGuard'

export async function POST(req: NextRequest) {
  try {
    const guard = await requireUserWithCredits(req, 'credits_minutes')
    if ('reject' in guard) return guard.reject

    const formData = await req.formData()
    const file = formData.get('file') as File
    const quality = (formData.get('quality') as string) || 'medium'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await recordJob({ id: jobId, userId: guard.userId, tool: 'compress', fileName: file.name })
    await deductCredits(guard.userId, 'credits_minutes')

    await enqueueJob({
      id: jobId,
      type: 'compress',
      file_path: fileUrl,
      quality,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Video compression started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Compress error:', error)
    return NextResponse.json(
      { error: 'Failed to compress video' },
      { status: 500 }
    )
  }
}
