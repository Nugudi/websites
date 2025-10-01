/**
 * 포인트 금액이 양수인지 확인
 */
export const isPositiveAmount = (amount: number): boolean => {
  return amount > 0;
};

/**
 * 포인트 금액을 포맷팅 (+/- 기호 포함)
 * @example formatPointAmount(100) => "+100P"
 * @example formatPointAmount(-100) => "-100P"
 */
export const formatPointAmount = (amount: number): string => {
  const sign = isPositiveAmount(amount) ? "+" : "";
  return `${sign}${amount}P`;
};

/**
 * 포인트 잔액을 포맷팅 (천단위 콤마)
 * @example formatPointBalance(3000) => "3,000 P"
 */
export const formatPointBalance = (balance: number): string => {
  return `${balance.toLocaleString()} P`;
};
