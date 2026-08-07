import { createClient } from '@supabase/supabase-js'

// ⚠️ ده الـ service_role key — ليه صلاحيات كاملة، بيتستخدم في السيرفر بس
// (جوه app/api/*/route.ts) ومبيتبعتش أبداً للمتصفح/الفرونت.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[supabaseAdmin] NEXT_PUBLIC_SUPABASE_URL أو SUPABASE_SERVICE_ROLE_KEY مش متضافين في الـ environment variables.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
