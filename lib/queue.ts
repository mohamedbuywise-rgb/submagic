import { v4 as uuidv4 } from 'uuid'
import { redis } from './redis'
import { supabaseAdmin } from './supabaseAdmin'

const BUCKET_NAME = 'clipgenie-uploads'
const QUEUE_KEY = 'clipgenie:jobs'

/**
 * يرفع الملف اللي المستخدم بعته على Supabase Storage جوه فولدر inputs/
 * ويرجّع الـ public URL بتاعه — ده اللي هيتبعت للـ Worker عشان ينزّله ويشتغل عليه.
 */
export async function uploadInputFile(file: File, jobId: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const remotePath = `inputs/${jobId}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(remotePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

  if (error) {
    throw new Error(`فشل رفع الملف على Supabase Storage: ${error.message}`)
  }

  const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(remotePath)
  return data.publicUrl
}

/**
 * يحط الـ job في طابور الانتظار (Redis list) عشان الـ Worker (worker.py) ياخده.
 * لازم شكل الـ payload يطابق اللي JOB_HANDLERS في worker.py مستنيه لكل type.
 */
export async function enqueueJob(payload: Record<string, unknown> & { type: string }): Promise<string> {
  const jobId = (payload.id as string) || uuidv4()
  const job = { ...payload, id: jobId }
  await redis.rpush(QUEUE_KEY, JSON.stringify(job))
  return jobId
}
