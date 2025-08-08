export const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`; // Ensure amount is a number
export const getProductivityColor = (isProductive) => isProductive === 'Productive' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
export const formatDate = (str) => str.slice(0, 10);