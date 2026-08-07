import Redis from 'ioredis'

// بنستخدم global عشان في وضع dev (next dev) الملف بيتعمله reload كتير
// وكل مرة كان هيفتح اتصال جديد بالغلط. في production (Vercel) كل
// serverless invocation بيبقى معاه instance منفصل وده طبيعي.
declare global {
  // eslint-disable-next-line no-var
  var __clipgenieRedis: Redis | undefined
}

function createRedisClient() {
  const url = process.env.REDIS_URL
  if (!url) {
    throw new Error('REDIS_URL مش موجود في الـ environment variables')
  }
  return new Redis(url, {
    maxRetriesPerRequest: null,
    // Upstash بيشتغل بـ TLS (rediss://) — ioredis بيتعرف عليه تلقائي من الـ URL نفسه
  })
}

export const redis = global.__clipgenieRedis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  global.__clipgenieRedis = redis
}
