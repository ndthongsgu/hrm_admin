export function formatDateTime(
  dateStr: string | Date,
  locale = "vi-VN"
): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(dateStr: string | Date, locale = "vi-VN"): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatCurrency(
  amount: number | string,
  locale = "vi-VN",
  currency = "VND"
): string {
  const num = Number(amount);
  if (isNaN(num)) return "0";

  return num.toLocaleString(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}
