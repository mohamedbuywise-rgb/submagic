import { NextRequest, NextResponse } from 'next/server'
import { enqueueJob } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string
    const language = (formData.get('language') as string) || 'ar'

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const jobId = crypto.randomUUID()

    // TTS مش محتاج رفع ملف، بس نص. الـ worker هيحفظ الناتج في /tmp/{jobId}.mp3
    // ثم يرفعه على Supabase Storage تلقائي زي أي job تاني.
    await enqueueJob({
      id: jobId,
      type: 'tts',
      text,
      language,
      output_path: `/tmp/${jobId}.mp3`,
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Text-to-speech started',
      statusUrl: `/api/status/${jobId}`,
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
