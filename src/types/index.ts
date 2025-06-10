export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  memo: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface ExpenseFilters {
  dateFrom: string;
  dateTo: string;
  category: string;
  searchText: string;
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
