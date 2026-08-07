import { NextRequest, NextResponse } from 'next/server'
import { uploadInputFile, enqueueJob } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const speed = (formData.get('speed') as string) || '1.0'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()
    const fileUrl = await uploadInputFile(file, jobId)

    await enqueueJob({
      id: jobId,
      type: 'speed',
      file_path: fileUrl,
      speed,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Speed adjustment started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('Speed error:', error)
    return NextResponse.json(
      { error: 'Failed to adjust speed' },
      { status: 500 }
    )
  }
}
