import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const targetFormat = formData.get('format') as string || 'mp4'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Format conversion started',
      options: { targetFormat },
      downloadUrl: `/api/download/${jobId}`,
    })

  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json(
      { error: 'Failed to convert format' },
      { status: 500 }
    )
  }
}