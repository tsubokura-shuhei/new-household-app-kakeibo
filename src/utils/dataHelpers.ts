import {
  Expense,
  Category,
  ExpenseFilters as ExpenseFiltersType,
  ExpenseSummary,
  MonthlyData,
  SortConfig,
} from "../types";

export const defaultCategories: Omit<Category, "id">[] = [
  { name: "食費", color: "#3B82F6", isDefault: true, type: "expense" },
  { name: "交通費", color: "#10B981", isDefault: true, type: "expense" },
  { name: "娯楽", color: "#F59E0B", isDefault: true, type: "expense" },
  { name: "光熱費", color: "#EF4444", isDefault: true, type: "expense" },
  { name: "通信費", color: "#8B5CF6", isDefault: true, type: "expense" },
  { name: "日用品", color: "#EC4899", isDefault: true, type: "expense" },
  { name: "医療", color: "#06B6D4", isDefault: true, type: "expense" },
  { name: "衣服", color: "#84CC16", isDefault: true, type: "expense" },
  { name: "給与", color: "#22C55E", isDefault: true, type: "income" },
  { name: "副業", color: "#14B8A6", isDefault: true, type: "income" },
  { name: "投資", color: "#6366F1", isDefault: true, type: "income" },
  { name: "その他収入", color: "#8B5CF6", isDefault: true, type: "income" },
];

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFiltersType
): Expense[] {
  return expenses.filter((expense) => {
    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;
    if (filters.category && expense.category !== filters.category) return false;
    if (
      filters.searchText &&
      !expense.memo.toLowerCase().includes(filters.searchText.toLowerCase())
    )
      return false;

    // 年と月のフィルタリング
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear().toString();
    const expenseMonth = (expenseDate.getMonth() + 1).toString();

    // 年のみ指定されている場合
    if (filters.year && !filters.month) {
      if (expenseYear !== filters.year) {
        return false;
      }
    }

    // 年と月が両方指定されている場合
    if (filters.year && filters.month) {
      if (expenseYear !== filters.year || expenseMonth !== filters.month) {
        return false;
      }
    }

    return true;
  });
}

export function generateCategorySummary(
  expenses: Expense[],
  categories: Category[]
): ExpenseSummary[] {
  const summary: Record<
    string,
    { amount: number; count: number; color: string }
  > = {};

  expenses.forEach((expense) => {
    if (!summary[expense.category]) {
      const category = categories.find((c) => c.name === expense.category);
      summary[expense.category] = {
        amount: 0,
        count: 0,
        color: category?.color || "#6B7280",
      };
    }
    summary[expense.category].amount += expense.amount;
    summary[expense.category].count += 1;
  });

  return Object.entries(summary)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      color: data.color,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function generateMonthlyData(expenses: Expense[]): MonthlyData[] {
  const monthlyMap: Record<string, number> = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + expense.amount;
  });

  return Object.entries(monthlyMap)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12); // Show last 12 months
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ["日付", "カテゴリ", "金額", "メモ"];
  const csvContent = [
    headers.join(","),
    ...expenses.map((expense) =>
      [
        expense.date,
        expense.category,
        expense.amount,
        `"${expense.memo.replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `家計簿_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function sortExpenses(
  expenses: Expense[],
  sortConfig: SortConfig
): Expense[] {
  return [...expenses].sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.field) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "amount":
        comparison = b.amount - a.amount;
        break;
    }

    return sortConfig.order === "asc" ? comparison : -comparison;
  });
}
