// Shared admin token signing/verification. Kept free of next/headers imports so
// it is safe to use from middleware (proxy) as well as server actions.

const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

function getSecret() {
  return (
    process.env.SUPABASE_JWT_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'amtmti-dev-admin-secret'
  )
}

async function sign(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(getSecret())
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function makeAdminToken(): Promise<string> {
  const issued = Date.now().toString()
  const signature = await sign(issued)
  return `${issued}.${signature}`
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [issued, sig] = token.split('.')
  if (!issued || !sig) return false
  const expectedSig = await sign(issued)
  if (expectedSig !== sig) return false
  const age = Date.now() - Number(issued)
  return age >= 0 && age <= MAX_AGE_SECONDS * 1000
}

export const ADMIN_COOKIE_NAME = 'amtmti_admin'
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS
