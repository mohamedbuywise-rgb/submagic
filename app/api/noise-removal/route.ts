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
      type: 'noise_removal',
      file_path: fileUrl,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Noise removal started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Noise removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove noise' },
      { status: 500 }
    )
  }
}
