import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    if (date.trim() === "") return "";
    return format(parseISO(date), "MMM dd, yyyy");
  }
  return format(date, "MMM dd, yyyy");
};

export const formatShortDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    if (date.trim() === "") return "";
    return format(parseISO(date), "MM/dd/yyyy");
  }
  return format(date, "MM/dd/yyyy");
};

export const formatMonthYear = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    if (date.trim() === "") return "";
    return format(parseISO(date), "MMMM yyyy");
  }
  return format(date, "MMMM yyyy");
};

export const getCurrentMonth = () => {
  return format(new Date(), "yyyy-MM");
};

export const isDateInCurrentMonth = (date) => {
  if (!date) return false;
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  
  let checkDate;
  if (typeof date === "string") {
    if (date.trim() === "") return false;
    checkDate = parseISO(date);
  } else {
    checkDate = date;
  }
  
  return isWithinInterval(checkDate, { start, end });
};

export const getMonthFromDate = (date) => {
  if (!date) {
    return format(new Date(), "yyyy-MM");
  }
  
  let checkDate;
  if (typeof date === "string") {
    if (date.trim() === "") {
      return format(new Date(), "yyyy-MM");
    }
    checkDate = parseISO(date);
  } else {
    checkDate = date;
  }
  
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