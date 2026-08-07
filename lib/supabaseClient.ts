import { createClient } from '@supabase/supabase-js'

// المفتاح ده الـ anon key بس (مش الـ service role) — آمن إنه يتبعت للمتصفح.
// لازم تكون NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY متضافين
// في Environment Variables على Vercel عشان تسجيل الدخول/التسجيل يشتغل فعليًا.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient] NEXT_PUBLIC_SUPABASE_URL أو NEXT_PUBLIC_SUPABASE_ANON_KEY مش متضافين — تسجيل الدخول والتسجيل مش هيشتغلوا لحد ما تضيفهم.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
