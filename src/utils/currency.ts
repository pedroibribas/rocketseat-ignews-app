export function currency(amount: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount / 100);

  return formatted;
};