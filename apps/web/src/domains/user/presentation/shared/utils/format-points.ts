// 포인트 포맷터 - 한국 로케일로 천 단위 구분자 적용
const pointFormatter = new Intl.NumberFormat("ko-KR");

export const isPositiveAmount = (amount: number): boolean => {
  return amount > 0;
};

export const formatPointAmount = (amount: number): string => {
  if (!Number.isFinite(amount)) return "0P";

  const sign = isPositiveAmount(amount) ? "+" : "";
  const formattedAmount = pointFormatter.format(Math.abs(amount));
  return `${sign}${formattedAmount}P`;
};

export const formatPointBalance = (balance: number): string => {
  if (!Number.isFinite(balance)) return "0P";

  const formattedBalance = pointFormatter.format(balance);
  return `${formattedBalance}P`;
};

// Re-export from shared utils for backward compatibility
// TODO: 점진적으로 직접 import로 마이그레이션 권장
export { formatPriceWithCurrency } from "@core/utils/currency/format-currency";
