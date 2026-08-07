import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const speed = formData.get('speed') as string || '1.0'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Speed adjustment started',
      options: { speed: `${speed}x` },
      downloadUrl: `/api/download/${jobId}`,
    })

  } catch (error) {
    console.error('Speed error:', error)
    return NextResponse.json(
      { error: 'Failed to adjust speed' },
      { status: 500 }
    )
  }
}