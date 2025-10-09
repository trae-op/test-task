// utils/formatters.ts

/**
 * Форматує числову суму в рядок валюти (USD).
 * @param amount - Сума для форматування.
 * @returns Рядок у форматі валюти (наприклад, "$1,234.56").
 */
export function formatCurrency(amount: number): string {
  // Перевіряємо, чи це число. Якщо ні, повертаємо порожній рядок.
  if (typeof amount !== "number" || isNaN(amount)) {
    return "";
  }

  // Використовуємо вбудований Intl.NumberFormat для коректного форматування.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
