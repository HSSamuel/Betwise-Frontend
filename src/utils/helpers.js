/**
 * A simple utility to capitalize the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} The capitalized string.
 */
export const capitalize = (string) => {
  if (typeof string !== "string" || string.length === 0) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * A utility to format currency values.
 * @param {number} amount - The numerical amount.
 * @returns {string} A formatted currency string.
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
