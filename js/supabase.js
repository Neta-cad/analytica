// ── ANALYTICA SUPABASE CONNECTION ──

const SUPABASE_URL = 'https://hwolyuokzniwgqqykokb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3b2x5dW9rem5pd2dxcXlrb2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk3ODcsImV4cCI6MjA5NTgzNTc4N30.vG1QVha8cXM4e0GMFW8QytRnP0bYK8MJEu-Ex5oO75k'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
})

// ── GET CURRENT USER ──
async function getCurrentUser() {
  const { data: { session } } = await db.auth.getSession()
  return session ? session.user : null
}

// ── FIGURE OUT CORRECT PATH DEPTH ──
function getBasePath() {
  const path = window.location.pathname
  // Count how deep we are
  const depth = path.split('/').filter(p => p !== '').length
  if (depth <= 1) return './'
  return '../'
}

// ── UPDATE NAV ON EVERY PAGE ──
async function updateNav() {
  const user = await getCurrentUser()
  const topnavRight = document.querySelector('.topnav-right')
  if (!topnavRight) return

  const base = getBasePath()

  if (user) {
    const meta = user.user_metadata || {}
    const name = meta.first_name || user.email.split('@')[0]
    const initial = name[0].toUpperCase()

    topnavRight.innerHTML = `
      <a href="${base}dashboard/index.html"
        style="padding:7px 16px;border-radius:6px;font-size:13px;font-weight:600;
        font-family:'DM Sans',sans-serif;text-decoration:none;background:transparent;
        border:1px solid rgba(255,255,255,0.2);color:#fff;">
        Dashboard
      </a>
      <div onclick="window.location.href='${base}dashboard/index.html'"
        style="width:34px;height:34px;background:linear-gradient(135deg,#F5A623,#e8920f);
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:14px;font-weight:700;color:#0A1628;cursor:pointer;">
        ${initial}
      </div>
    `
  }
}

document.addEventListener('DOMContentLoaded', updateNav)
console.log('Supabase ✓')
// ── CHECK IF USER IS PRO ──
async function isPro() {
  const { data: { session } } = await db.auth.getSession()
  if (!session) return false
  const meta = session.user.user_metadata || {}
  return meta.plan === 'pro'
}

// ── REQUIRE PRO ──
async function requirePro(redirectUrl) {
  const pro = await isPro()
  if (!pro) {
    window.location.href = redirectUrl || '../payment/index.html'
    return false
  }
  return true
}