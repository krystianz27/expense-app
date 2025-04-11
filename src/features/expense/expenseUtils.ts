import { Expense } from "./expenseService";

export const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.ceil((days + 1) / 7);
};

export const groupExpenses = (expenses: Expense[]) => {
  const today = new Date();
  let todayTotal = 0;
  let thisWeekTotal = 0;
  let thisMonthTotal = 0;
  let thisYearTotal = 0;

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const isSameDay = expenseDate.toDateString() === today.toDateString();
    const isSameWeek =
      today.getFullYear() === expenseDate.getFullYear() &&
      getWeekNumber(today) === getWeekNumber(expenseDate);
    const isSameMonth =
      today.getFullYear() === expenseDate.getFullYear() &&
      today.getMonth() === expenseDate.getMonth();
    const isSameYear = today.getFullYear() === expenseDate.getFullYear();

    if (isSameDay) todayTotal += expense.amount;
    if (isSameWeek) thisWeekTotal += expense.amount;
    if (isSameMonth) thisMonthTotal += expense.amount;
    if (isSameYear) thisYearTotal += expense.amount;
  });

  return {
    today: todayTotal,
    thisWeek: thisWeekTotal,
    thisMonth: thisMonthTotal,
    thisYear: thisYearTotal,
  };
};
