import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const quality = formData.get('quality') as string || 'medium'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Video compression started',
      options: { quality },
      downloadUrl: `/api/download/${jobId}`,
    })

  } catch (error) {
    console.error('Compress error:', error)
    return NextResponse.json(
      { error: 'Failed to compress video' },
      { status: 500 }
    )
  }
}