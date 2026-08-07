import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const targetFormat = (formData.get('format') as string) || 'mp4'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

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
