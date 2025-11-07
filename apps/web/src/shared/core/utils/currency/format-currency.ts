/**
 * Currency Formatting Utilities
 *
 * 가격 및 통화 표시를 위한 유틸리티 함수들
 */

// 가격 포맷터 - 원화 통화 표시
const priceFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
});

/**
 * 가격을 통화 형식으로 포맷
 *
 * @param price - 포맷할 가격 (숫자)
 * @returns 포맷된 가격 문자열 (예: ₩10,000)
 *
 * @example
 * ```ts
 * formatPriceWithCurrency(10000) // "₩10,000"
 * formatPriceWithCurrency(0)     // "₩0"
 * formatPriceWithCurrency(NaN)   // "₩0"
 * ```
 */
export const formatPriceWithCurrency = (price: number): string =>
  Number.isFinite(price) ? priceFormatter.format(price) : "₩0";
