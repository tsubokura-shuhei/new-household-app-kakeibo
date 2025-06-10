import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseFilters } from "./components/ExpenseFilters";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseSummary } from "./components/ExpenseSummary";
import { CategoryManager } from "./components/CategoryManager";
import { Calendar } from "./components/Calendar";
import { Toast } from "./components/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { SavingTargets } from "./components/SavingTargets";
import { TabNavigation } from "./components/TabNavigation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  Expense,
  Category,
  ExpenseFilters as ExpenseFiltersType,
  SavingTarget,
} from "./types";
import {
  defaultCategories,
  filterExpenses,
  generateCategorySummary,
  generateMonthlyData,
  exportToCSV,
  generateId,
} from "./utils/dataHelpers";

type TabId = "expenses" | "targets";

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "categories",
    defaultCategories.map((cat) => ({ ...cat, id: generateId() }))
  );
  const [savingTargets, setSavingTargets] = useLocalStorage<SavingTarget[]>(
    "savingTargets",
    []
  );
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    dateFrom: "",
    dateTo: "",
    category: "",
    searchText: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isDark, setIsDark] = useDarkMode();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useLocalStorage<TabId>(
    "activeTab",
    "expenses"
  );

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, filters]);

  const categorySummary = useMemo(() => {
    return generateCategorySummary(filteredExpenses, categories);
  }, [filteredExpenses, categories]);

  const monthlyData = useMemo(() => {
    return generateMonthlyData(filteredExpenses);
  }, [filteredExpenses]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const handleAddExpense = (expenseData: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: new Date(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    setToast({ message: "支出を登録しました", type: "success" });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    setToast({ message: "支出を削除しました", type: "success" });
  };

  const handleAddCategory = (categoryData: Omit<Category, "id">) => {
    const existingCategory = categories.find(
      (cat) => cat.name === categoryData.name
    );
    if (existingCategory) {
      setToast({ message: "そのカテゴリは既に存在します", type: "error" });
      return;
    }

    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
    };
    setCategories((prev) => [...prev, newCategory]);
    setToast({ message: "カテゴリを追加しました", type: "success" });
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (!categoryToDelete) return;

    // Check if category is used in any expenses
    const isUsed = expenses.some(
      (expense) => expense.category === categoryToDelete.name
    );
    if (isUsed) {
      setToast({
        message: "このカテゴリは支出で使用されているため削除できません",
        type: "error",
      });
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setToast({ message: "カテゴリを削除しました", type: "success" });
  };

  const handleUpdateCategory = (
    id: string,
    updatedData: Partial<Omit<Category, "id">>
  ) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
    );
    setToast({ message: "カテゴリを更新しました", type: "success" });
  };

  const handleExportData = () => {
    if (expenses.length === 0) {
      setToast({
        message: "エクスポートするデータがありません",
        type: "error",
      });
      return;
    }
    setIsExportDialogOpen(true);
  };

  const confirmExportData = () => {
    exportToCSV(expenses);
    setToast({ message: "データをエクスポートしました", type: "success" });
    setIsExportDialogOpen(false);
  };

  const handleClearAllData = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmClearAllData = () => {
    setExpenses([]);
    setCategories(
      defaultCategories.map((cat) => ({ ...cat, id: generateId() }))
    );
    setFilters({ dateFrom: "", dateTo: "", category: "", searchText: "" });
    setToast({ message: "全てのデータを削除しました", type: "success" });
    setIsConfirmDialogOpen(false);
  };

  const handleDateSelect = (date: string) => {
    // 選択された日付に合わせてフィルターを設定
    setFilters((prev) => ({
      ...prev,
      dateFrom: date,
      dateTo: date,
    }));
    setToast({ message: `${date}の支出を表示します`, type: "success" });
  };

  const handleUpdateExpense = (id: string, amount: number) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, amount } : expense
      )
    );
    setToast({ message: "支出を更新しました", type: "success" });
  };

  const handleAddSavingTarget = (target: SavingTarget) => {
    setSavingTargets((prev) => [...prev, target]);
    setToast({ message: "節約目標を追加しました", type: "success" });
  };

  const handleDeleteSavingTarget = (category: string) => {
    setSavingTargets((prev) =>
      prev.filter((target) => target.category !== category)
    );
    setToast({ message: "節約目標を削除しました", type: "success" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onExportData={handleExportData}
          onClearAllData={handleClearAllData}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "expenses" && (
          <div className="space-y-6">
            <ExpenseForm
              categories={categories}
              onAddExpense={handleAddExpense}
              onAddCategory={handleAddCategory}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
            />

            <ExpenseFilters
              filters={filters}
              categories={categories}
              onFiltersChange={setFilters}
            />

            <Calendar
              expenses={expenses}
              categories={categories}
              onDateSelect={handleDateSelect}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />

            <ExpenseList
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
            />

            <ExpenseSummary
              categorySummary={categorySummary}
              monthlyData={monthlyData}
              totalAmount={totalAmount}
            />
          </div>
        )}

        {activeTab === "targets" && (
          <div className="space-y-6">
            <SavingTargets
              categories={categories}
              expenses={expenses}
              savingTargets={savingTargets}
              onAddSavingTarget={handleAddSavingTarget}
              onDeleteSavingTarget={handleDeleteSavingTarget}
            />
          </div>
        )}
      </div>

      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateCategory={handleUpdateCategory}
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="データ削除の確認"
        message={"全てのデータを削除しますか？\nこの操作は取り消せません。"}
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={confirmClearAllData}
        onCancel={() => setIsConfirmDialogOpen(false)}
        type="warning"
        requireConfirmation={true}
        confirmationText="削除に同意します"
      />

      <ConfirmDialog
        isOpen={isExportDialogOpen}
        title="エクスポートの確認"
        message="エクスポートを行うときはパソコンでエクスポートをしてください"
        confirmLabel="実行"
        cancelLabel="キャンセル"
        onConfirm={confirmExportData}
        onCancel={() => setIsExportDialogOpen(false)}
        type="info"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
