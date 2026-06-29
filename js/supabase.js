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

// ── GET BASE PATH ──
function getBasePath() {
  const depth = window.location.pathname.split('/').filter(p => p !== '').length
  return depth <= 1 ? './' : '../'
}

// ── PROTECTED PAGES — redirect to login if not logged in ──
async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    const base = getBasePath()
    window.location.href = base + 'auth/login.html'
    return null
  }
  return user
}

// ── UPDATE NAV ON EVERY PAGE ──
async function updateNav() {
  const user = await getCurrentUser()
  const base = getBasePath()

  // Try both class names used across pages
  const navRight = document.getElementById('topnav-right') ||
                   document.querySelector('.nav-right') ||
                   document.querySelector('.topnav-right')
  if (!navRight) return

  if (user) {
    const meta = user.user_metadata || {}
    const name = meta.first_name || user.email.split('@')[0]
    const initial = name[0].toUpperCase()
    const avatarUrl = meta.avatar_url || null

    const avatarHtml = avatarUrl
      ? `<img src="${avatarUrl}" style="width:34px;height:34px;border-radius:8px;object-fit:cover;cursor:pointer;border:2px solid rgba(245,166,35,0.4);" onclick="window.location.href='${base}profile/index.html'">`
      : `<div onclick="window.location.href='${base}profile/index.html'"
          style="width:34px;height:34px;background:linear-gradient(135deg,#F5A623,#e8920f);
          border-radius:8px;display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:800;color:#0A1628;cursor:pointer;border:2px solid rgba(245,166,35,0.4);">
          ${initial}
        </div>`

    navRight.innerHTML = `
      <a href="${base}dashboard/index.html"
        style="padding:7px 16px;border-radius:7px;font-size:13px;font-weight:600;
        font-family:'Inter',sans-serif;text-decoration:none;background:transparent;
        border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.7);">
        Dashboard
      </a>
      ${avatarHtml}
    `
  } else {
    navRight.innerHTML = `
      <a href="${base}auth/login.html"
        style="padding:7px 16px;border-radius:7px;font-size:13px;font-weight:600;
        font-family:'Inter',sans-serif;text-decoration:none;background:transparent;
        border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.7);">
        Log In
      </a>
      <a href="${base}auth/signup.html"
        style="padding:7px 16px;border-radius:7px;font-size:13px;font-weight:700;
        font-family:'Inter',sans-serif;text-decoration:none;background:#F5A623;color:#0A1628;">
        Join Free
      </a>
    `
  }
}

// ── REDIRECT BUTTONS TO LOGIN IF NOT LOGGED IN ──
async function guardButton(targetUrl) {
  const user = await getCurrentUser()
  const base = getBasePath()
  if (!user) {
    window.location.href = base + 'auth/login.html'
  } else {
    window.location.href = targetUrl
  }
}

// ── RUN ON EVERY PAGE LOAD ──
document.addEventListener('DOMContentLoaded', updateNav)

// ── CHECK IF USER IS PRO ──
async function isPro() {
  const { data: { session } } = await db.auth.getSession()
  if (!session) return false
  return (session.user.user_metadata || {}).plan === 'pro'
}

console.log('Supabase ✓')
// ── CHECK IF USER IS PRO ──
async function checkPro() {
  const user = await getCurrentUser()
  if (!user) return false
  const { data } = await db
    .from('user_profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()
  return data ? data.is_pro : false
}

// ── GUARD PRO PAGES ──
// Call this at top of any Pro-only page
async function requirePro() {
  const user = await getCurrentUser()
  const base = getBasePath()

  // Not logged in — go to login
  if (!user) {
    window.location.href = base + 'auth/login.html'
    return false
  }

  // Check pro status
  const pro = await checkPro()
  if (!pro) {
    // Not pro — go to payment page
    window.location.href = base + 'payment/index.html'
    return false
  }

  return true
}