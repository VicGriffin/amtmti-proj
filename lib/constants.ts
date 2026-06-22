/**
 * Centralized constants for the AMTMTI platform.
 * This eliminates hardcoded values scattered across the codebase.
 */

export const WHATSAPP_PHONE = '+254721421719'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE.replace('+', '')}`

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export const CURRENCY_CONVERSION_RATE = 110 // KSH per USD

export const EMAIL_COLORS = {
  primary: '#0F4C81',
  warningBg: '#fff3cd',
  infoBg: '#d4edff',
  border: '#eee',
} as const
