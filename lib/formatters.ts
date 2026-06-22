/**
 * Centralized formatting utilities for currency and other common formatting needs.
 * This eliminates duplication across components and templates.
 */

/**
 * Format a KSH amount as Kenyan Shilling currency.
 */
export function formatKsh(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a USD amount as US Dollar currency.
 * @param amount - Amount in KSH to be converted to USD
 * @param conversionRate - Conversion rate from KSH to USD (default: 110)
 */
export function formatUsd(amount: number, conversionRate = 110): string {
  const usdAmount = amount / conversionRate
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(Math.round(usdAmount))
}

/**
 * Format a currency amount based on the specified currency code.
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'KES')
 */
export function formatCurrency(amount: number, currency = 'KES'): string {
  if (currency === 'USD') {
    return formatUsd(amount)
  }
  return formatKsh(amount)
}
