import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await enqueueJob({
      id: jobId,
      type: 'audio_enhance',
      file_path: fileUrl,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Audio enhancement started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Audio enhance error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance audio' },
      { status: 500 }
    )
  }
}
