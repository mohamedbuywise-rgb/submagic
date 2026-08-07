import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const backgroundType = formData.get('background') as string || 'white'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const jobId = uuidv4()

    // TODO: In production, save file to Cloudflare R2, add to BullMQ queue,
    // and process with rembg + Stable Diffusion in a worker

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Background removal started',
      downloadUrl: `/api/download/${jobId}`,
      previewUrl: `/api/preview/${jobId}`,
    })

  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}