import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'
import { requireUserWithCredits, deductCredits, recordJob } from '@/lib/authGuard'

export async function POST(req: NextRequest) {
  try {
    const guard = await requireUserWithCredits(req, 'credits_minutes')
    if ('reject' in guard) return guard.reject

    const formData = await req.formData()
    const file = formData.get('file') as File
    const language = (formData.get('language') as string) || 'ar'
    const outputFormat = (formData.get('format') as string) || 'srt' // srt, vtt, burn, all
    const style = (formData.get('style') as string) || 'classic' // classic, tiktok, box, glow, minimal

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await recordJob({ id: jobId, userId: guard.userId, tool: 'subtitles', fileName: file.name })
    await deductCredits(guard.userId, 'credits_minutes')

    await enqueueJob({
      id: jobId,
      type: 'transcription',
      file_path: fileUrl,
      language,
      format: outputFormat,
      style,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Transcription started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    )
  }
}
