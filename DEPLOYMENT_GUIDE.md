# 🚀 ClipGenie — Deployment Guide (Step by Step)

## PART 1: GitHub (رفع الكود)

### Step 1: Install Git
- Windows: https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt install git`

### Step 2: Push Code to GitHub
```bash
cd clipgenie
git init
git add .
git commit -m "ClipGenie MVP"
```

### Step 3: Create GitHub Repo
1. Go to https://github.com/new
2. Name: `clipgenie`
3. Click **Create repository**
4. Copy the commands under "…or push an existing repository"
5. Run them in terminal:
```bash
git remote add origin https://github.com/YOUR_USERNAME/clipgenie.git
git branch -M main
git push -u origin main
```

---

## PART 2: Vercel (الموقع)

### Step 1: Sign Up
1. Go to https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize Vercel to access your GitHub

### Step 2: Deploy
1. Click **Add New Project**
2. Find `clipgenie` in the list → Click **Import**
3. Framework Preset: `Next.js`
4. Click **Deploy**
5. Wait 2-3 minutes → You'll get a URL like `clipgenie.vercel.app`

### Step 3: Add Environment Variables
1. In Vercel Dashboard, click your project
2. Go to **Settings** tab (top)
3. Click **Environment Variables** (left sidebar)
4. Add these one by one:

| Name | Value | Where to get it |
|------|-------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service_role secret) | Supabase Dashboard → Settings → API — **needed on Vercel too**, not just the Worker, because the API routes check login + credits server-side |
| `REDIS_URL` | `rediss://default:PASSWORD@...` | Same Redis instance the Worker uses (see Part 5) |
| `RESEND_API_KEY` | `re_...` | Resend Dashboard → API Keys |

5. Click **Save**
6. Go to **Deployments** tab → Click the 3 dots → **Redeploy**

---

## PART 3: Supabase (قاعدة البيانات)

### Step 1: Create Project
1. Go to https://supabase.com
2. Sign up with GitHub
3. Click **New Project**
4. Name: `clipgenie`
5. Password: (create a strong password, SAVE IT!)
6. Region: Choose closest to your users (e.g., Frankfurt for Europe, Mumbai for India)
7. Click **Create new project**
8. Wait 2-3 minutes

### Step 2: Get API Keys
1. In Supabase Dashboard, click **Project Settings** (gear icon, bottom left)
2. Click **API** (left sidebar)
3. Copy:
   - `URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Create Tables
1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy ALL content from `supabase_schema.sql` file
4. Paste in SQL Editor
5. Click **Run**
6. You should see "Success. No rows returned"

### Step 4: Enable Auth
1. Click **Authentication** (left sidebar)
2. Click **Providers** tab
3. Enable **Email** (should be ON by default)
4. (Optional) Enable **Google**, **GitHub** for social login

---

## PART 4: Resend (الإيميلات)

### Step 1: Sign Up
1. Go to https://resend.com
2. Sign up with GitHub
3. Verify your domain (or use `@resend.dev` for testing)

### Step 2: Get API Key
1. Click **API Keys** (left sidebar)
2. Click **Create API Key**
3. Name: `clipgenie-production`
4. Permission: `Sending access`
5. Copy the key → this is `RESEND_API_KEY`

---

## PART 5: Railway (الـ Worker)

### What is the Worker?
The Worker is a Python script that runs in the background and does the actual AI processing (transcription, background removal, etc.). It's separate from the website because it needs more CPU power.

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub
3. (You get $5 free credit — enough for months!)

### Step 2: Deploy Worker
1. Click **New Project**
2. Click **Deploy from GitHub repo**
3. Select your `clipgenie` repo
4. Click **Add Variables**:
   - `REDIS_URL` = `redis://default:PASSWORD@redis.railway.app:PORT` (we'll create Redis next)
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase Service Role Key (NOT anon key!)
5. Click **Deploy**

### Step 3: Add Redis (Queue)
1. In your Railway project, click **New**
2. Click **Database** → **Add Redis**
3. Railway will create it automatically
4. Click on the Redis service → **Variables** tab
5. Copy `REDIS_URL` value
6. Go back to your Worker service → **Variables**
7. Add `REDIS_URL` with the copied value

### Step 4: Add Service Role Key to Worker
1. In Supabase Dashboard → **Project Settings** → **API**
2. Copy `service_role secret` (NOT the anon key!)
3. In Railway Worker → **Variables**
4. Add `SUPABASE_KEY` with this value

---

## PART 6: Supabase Storage (تخزين الملفات)

### Step 1: Create Bucket
1. افتح Supabase Dashboard بتاع نفس المشروع اللي فيه الـ Database
2. من القائمة الجانبية، دوس **Storage**
3. دوس **Create a new bucket**
4. الاسم: `clipgenie-uploads`
5. فعّل **Public bucket** (عشان الفرونت يقدر يعرض/يحمّل الملفات مباشرة)
6. دوس **Create bucket**

### Step 2: Get Service Role Key
1. Supabase Dashboard → **Project Settings** (أيقونة الترس) → **API**
2. انسخ الـ `service_role secret` (مش الـ anon key — ده اللي بيديه صلاحية الرفع الكامل)

### Step 3: Add to Worker
في Render/Railway Worker Variables، ضيف:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

---

## ✅ CHECKLIST (تأكد من كل حاجة)

### Vercel (الموقع)
- [ ] Project deployed
- [ ] Environment variables added
- [ ] Redeployed after adding variables

### Supabase (قاعدة البيانات)
- [ ] Project created
- [ ] SQL schema executed (3 tables created)
- [ ] Auth enabled (Email)
- [ ] API keys copied to Vercel

### Resend (الإيميلات)
- [ ] Account created
- [ ] API key copied to Vercel

### Railway (الـ Worker)
- [ ] Worker deployed from GitHub
- [ ] Redis service added
- [ ] Environment variables set (REDIS_URL, SUPABASE_KEY)
- [ ] Worker is running (check logs)

### Supabase Storage (التخزين)
- [ ] Bucket `clipgenie-uploads` created and set to Public
- [ ] Service role key copied
- [ ] `SUPABASE_URL` / `SUPABASE_KEY` added to Worker

---

## 🧪 Test Everything

1. Open your Vercel URL
2. Try to upload a video
3. Check Railway Worker logs (should show "Processing job...")
4. Check Supabase SQL Editor: `SELECT * FROM jobs;`
5. You should see a new row!

---

## 🆘 Troubleshooting

### "Build failed" on Vercel
- Check that `package.json` has all dependencies
- Make sure `next.config.js` is correct
- Check Vercel logs for specific error

### Worker not processing
- Check Railway Worker logs
- Make sure `REDIS_URL` is correct
- Make sure Worker and Redis are in the same Railway project

### "Cannot connect to database"
- Make sure Supabase URL and Anon Key are correct
- Make sure you ran the SQL schema

---

## 💰 Total Monthly Cost

| Service | Cost |
|---------|------|
| Vercel | $0 (Hobby plan) |
| Supabase | $0 (Free tier: 500MB) |
| Railway | $0 ($5 credit covers ~2-3 months) |
| Resend | $0 (3,000 emails/month) |
| Supabase Storage | $0 (1GB free, included in main plan) |
| **TOTAL** | **$0** |

---

Made with ✨ by ClipGenie Team
