import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'
import { requireUserWithCredits, deductCredits, recordJob } from '@/lib/authGuard'

export async function POST(req: NextRequest) {
  try {
    const guard = await requireUserWithCredits(req, 'credits_minutes')
    if ('reject' in guard) return guard.reject

    const formData = await req.formData()
    const file = formData.get('file') as File
    const targetFormat = (formData.get('format') as string) || 'mp4'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await recordJob({ id: jobId, userId: guard.userId, tool: 'convert', fileName: file.name })
    await deductCredits(guard.userId, 'credits_minutes')

    await enqueueJob({
      id: jobId,
      type: 'convert',
      file_path: fileUrl,
      format: targetFormat,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Format conversion started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json(
      { error: 'Failed to convert format' },
      { status: 500 }
    )
  }
}
