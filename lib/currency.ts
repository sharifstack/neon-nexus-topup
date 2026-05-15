/**
 * Reusable currency formatter for the Neon Nexus platform.
 *
 * BDT  → ৳499   (no decimals, integer display)
 * USD  → $4.99  (2 decimal places)
 *
 * Falls back to BDT when currency is null/undefined/unknown.
 */

export type SupportedCurrency = 'BDT' | 'USD';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  BDT: '৳',
  USD: '$',
};

export function formatPrice(
  amount: number,
  currency?: string | null,
): string {
  const cur = (currency?.toUpperCase() ?? 'BDT') as SupportedCurrency;
  const symbol = CURRENCY_SYMBOLS[cur] ?? '৳';

  if (cur === 'USD') {
    return `${symbol}${amount.toFixed(2)}`;
  }
  // BDT: whole numbers are cleaner
  return `${symbol}${Math.round(amount)}`;
}

export function currencySymbol(currency?: string | null): string {
  const cur = (currency?.toUpperCase() ?? 'BDT') as SupportedCurrency;
  return CURRENCY_SYMBOLS[cur] ?? '৳';
}
