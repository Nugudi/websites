export const isPositiveAmount = (amount: number): boolean => {
  return amount > 0;
};

export const formatPointAmount = (amount: number): string => {
  if (!Number.isFinite(amount)) return "0P";

  const sign = isPositiveAmount(amount) ? "+" : "";
  return `${sign}${amount}P`;
};

export const formatPointBalance = (balance: number): string => {
  if (!Number.isFinite(balance)) return "0 P";

  return `${balance.toLocaleString()} P`;
};

export const formatPrice = (price: number): string => {
  if (!Number.isFinite(price)) return "0";

  return price.toLocaleString();
};
