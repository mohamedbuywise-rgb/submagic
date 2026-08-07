import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'
import { requireUserWithCredits, deductCredits, recordJob } from '@/lib/authGuard'

export async function POST(req: NextRequest) {
  try {
    const guard = await requireUserWithCredits(req, 'credits_images')
    if ('reject' in guard) return guard.reject

    const formData = await req.formData()
    const file = formData.get('file') as File
    const backgroundType = (formData.get('background') as string) || 'white'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await recordJob({ id: jobId, userId: guard.userId, tool: 'remove-bg', fileName: file.name })
    await deductCredits(guard.userId, 'credits_images')

    await enqueueJob({
      id: jobId,
      type: 'remove_bg',
      file_path: fileUrl,
      background: backgroundType,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Background removal started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
