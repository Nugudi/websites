// 포인트 포맷터 - 한국 로케일로 천 단위 구분자 적용
const pointFormatter = new Intl.NumberFormat("ko-KR");

// 가격 포맷터 - 원화 통화 표시
const priceFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
});

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

export const formatPriceWithCurrency = (price: number): string =>
  Number.isFinite(price) ? priceFormatter.format(price) : "₩0";
