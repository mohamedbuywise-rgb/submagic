import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string
    const language = formData.get('language') as string || 'ar'

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Text-to-speech started',
      options: { language },
      downloadUrl: `/api/download/${jobId}`,
    })

  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}