import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const language = formData.get('language') as string || 'ar'
    const outputFormat = formData.get('format') as string || 'srt'  // srt, vtt, burn
    const style = formData.get('style') as string || 'classic'  // classic, tiktok, box, glow, minimal

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    // TODO: In production, save file to Cloudflare R2, add to BullMQ queue,
    // and process with faster-whisper in a worker

    // Available styles for burn-in
    const styles = {
      classic: { name: 'Classic Professional', desc: 'Outline سميك + Shadow ناعم' },
      tiktok: { name: 'TikTok / Social', desc: 'Stroke أسود + Shadow قوي' },
      box: { name: 'Background Box', desc: 'خلفية سوداء شفافة' },
      glow: { name: 'Gradient Glow', desc: 'Glow برتقالي' },
      minimal: { name: 'Minimal Clean', desc: 'Shadow خفيف أنيق' },
    }

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Transcription started',
      options: {
        language,
        format: outputFormat,
        style: styles[style as keyof typeof styles] || styles.classic,
      },
      downloadUrl: `/api/download/${jobId}`,
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    )
  }
}