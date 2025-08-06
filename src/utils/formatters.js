import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (typeof date === "string") {
    return format(parseISO(date), "MMM dd, yyyy");
  }
  return format(date, "MMM dd, yyyy");
};

export const formatShortDate = (date) => {
  if (typeof date === "string") {
    return format(parseISO(date), "MM/dd/yyyy");
  }
  return format(date, "MM/dd/yyyy");
};

export const formatMonthYear = (date) => {
  if (typeof date === "string") {
    return format(parseISO(date), "MMMM yyyy");
  }
  return format(date, "MMMM yyyy");
};

export const getCurrentMonth = () => {
  return format(new Date(), "yyyy-MM");
};

export const isDateInCurrentMonth = (date) => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  
  return isWithinInterval(checkDate, { start, end });
};

export const getMonthFromDate = (date) => {
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  return format(checkDate, "yyyy-MM");
};

export const formatPercentage = (value, total) => {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};

export const calculateSavingsRate = (income, expenses) => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};