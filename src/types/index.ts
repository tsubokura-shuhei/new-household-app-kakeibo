export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  memo: string;
  createdAt: Date;
  type: "income" | "expense";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  type: "income" | "expense";
}

export interface ExpenseFilters {
  dateFrom: string;
  dateTo: string;
  category: string;
  searchText: string;
  year: string;
  month: string;
}

export interface ExpenseSummary {
  category: string;
  amount: number;
  color: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
}

export interface SavingTarget {
  category: string;
  amount: number;
}

export type SortField = "date" | "category" | "amount";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}
