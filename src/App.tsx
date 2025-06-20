import React, { useState, useMemo, useEffect } from "react";
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
import { initializeSupabase } from "./utils/supabaseTest";
import { supabaseHelpers } from "./utils/supabaseHelpers";
import {
  Expense,
  Category,
  ExpenseFilters as ExpenseFiltersType,
  SavingTarget,
  SortConfig,
  SortField,
} from "./types";
import {
  defaultCategories,
  filterExpenses,
  generateCategorySummary,
  generateMonthlyData,
  exportToCSV,
  generateId,
  sortExpenses,
} from "./utils/dataHelpers";

type TabId = "expenses" | "targets" | "search" | "auto-input";

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "categories",
    defaultCategories.map((cat) => ({
      id: generateId(),
      name: cat.name,
      color: cat.color,
      isDefault: cat.isDefault,
      type: cat.type,
    }))
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
    year: "",
    month: "",
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
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isCategoryDeleteDialogOpen, setIsCategoryDeleteDialogOpen] =
    useState(false);
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense"
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "date",
    order: "desc",
  });

  // Supabase接続テストとデータ読み込み
  useEffect(() => {
    const initializeApp = async () => {
      const isConnected = await initializeSupabase();
      if (isConnected) {
        // Supabaseからデータを読み込み
        try {
          const [supabaseExpenses, supabaseCategories, supabaseSavingTargets] =
            await Promise.all([
              supabaseHelpers.getExpenses(),
              supabaseHelpers.getCategories(),
              supabaseHelpers.getSavingTargets(),
            ]);

          // データが存在する場合はローカルストレージを更新
          if (supabaseExpenses.length > 0) {
            setExpenses(supabaseExpenses);
          }
          if (supabaseCategories.length > 0) {
            setCategories(supabaseCategories);
          }
          if (supabaseSavingTargets.length > 0) {
            setSavingTargets(supabaseSavingTargets);
          }

          console.log("Supabaseからデータを読み込みました:", {
            expenses: supabaseExpenses.length,
            categories: supabaseCategories.length,
            savingTargets: supabaseSavingTargets.length,
          });
        } catch (error) {
          console.error("Error loading data from Supabase:", error);
        }
      } else {
        setToast({ message: "Supabase接続失敗", type: "error" });
      }
    };

    initializeApp();
  }, []);

  const filteredExpenses = useMemo(() => {
    const filtered = filterExpenses(expenses, filters);
    return sortExpenses(filtered, sortConfig);
  }, [expenses, filters, sortConfig]);

  const categorySummary = useMemo(() => {
    return generateCategorySummary(filteredExpenses, categories);
  }, [filteredExpenses, categories]);

  const monthlyData = useMemo(() => {
    return generateMonthlyData(filteredExpenses);
  }, [filteredExpenses]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt">
  ) => {
    try {
      // Supabaseにデータを追加
      const newExpense = await supabaseHelpers.addExpense(expenseData);

      if (newExpense) {
        // ローカル状態も更新
        setExpenses((prev) => [...prev, newExpense]);
        setToast({ message: "支出を登録しました", type: "success" });
      } else {
        setToast({ message: "支出の登録に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setToast({ message: "支出の登録に失敗しました", type: "error" });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      // Supabaseからデータを削除
      const success = await supabaseHelpers.deleteExpense(id);

      if (success) {
        // ローカル状態も更新
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        setToast({ message: "支出を削除しました", type: "success" });
      } else {
        setToast({ message: "支出の削除に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setToast({ message: "支出の削除に失敗しました", type: "error" });
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, "id">) => {
    const existingCategory = categories.find(
      (cat) => cat.name === categoryData.name
    );
    if (existingCategory) {
      setToast({ message: "そのカテゴリは既に存在します", type: "error" });
      return;
    }

    try {
      // Supabaseにカテゴリを追加
      const newCategory = await supabaseHelpers.addCategory(categoryData);

      if (newCategory) {
        // ローカル状態も更新
        setCategories((prev) => [...prev, newCategory]);
        setToast({ message: "カテゴリを追加しました", type: "success" });
      } else {
        setToast({ message: "カテゴリの追加に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setToast({ message: "カテゴリの追加に失敗しました", type: "error" });
    }
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (!categoryToDelete) return;

    const isUsed = expenses.some(
      (expense) => expense.category === categoryToDelete.name
    );

    if (isUsed) {
      setCategoryToDelete(id);
      setIsCategoryDeleteDialogOpen(true);
      return;
    }

    deleteCategory(id);
  };

  const deleteCategory = async (id: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (!categoryToDelete) return;

    try {
      // Supabaseからカテゴリを削除
      const success = await supabaseHelpers.deleteCategory(id);

      if (success) {
        const categoryName = categoryToDelete.name;

        // 関連するデータも削除
        setExpenses((prev) =>
          prev.filter((expense) => expense.category !== categoryName)
        );
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        setSavingTargets((prev) =>
          prev.filter((target) => target.category !== categoryName)
        );

        setToast({
          message: "カテゴリとそのデータを削除しました",
          type: "success",
        });
        setIsCategoryDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } else {
        setToast({ message: "カテゴリの削除に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setToast({ message: "カテゴリの削除に失敗しました", type: "error" });
    }
  };

  const cancelCategoryDelete = () => {
    setIsCategoryDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleUpdateCategory = async (
    id: string,
    updatedData: Partial<Omit<Category, "id">>
  ) => {
    try {
      // Supabaseでカテゴリを更新
      const success = await supabaseHelpers.updateCategory(id, updatedData);

      if (success) {
        // ローカル状態も更新
        if (updatedData.name) {
          const categoryToUpdate = categories.find((cat) => cat.id === id);
          if (categoryToUpdate && categoryToUpdate.name !== updatedData.name) {
            const oldName = categoryToUpdate.name;
            const newName = updatedData.name;

            setExpenses((prev) =>
              prev.map((expense) =>
                expense.category === oldName
                  ? { ...expense, category: newName }
                  : expense
              )
            );

            setSavingTargets((prev) =>
              prev.map((target) =>
                target.category === oldName
                  ? { ...target, category: newName }
                  : target
              )
            );
          }
        }

        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
        );

        setToast({ message: "カテゴリを更新しました", type: "success" });
      } else {
        setToast({ message: "カテゴリの更新に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setToast({ message: "カテゴリの更新に失敗しました", type: "error" });
    }
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
      defaultCategories.map((cat) => ({
        id: generateId(),
        name: cat.name,
        color: cat.color,
        isDefault: cat.isDefault,
        type: cat.type,
      }))
    );
    setSavingTargets([]);
    setFilters({
      dateFrom: "",
      dateTo: "",
      category: "",
      searchText: "",
      year: "",
      month: "",
    });
    setToast({ message: "全てのデータを削除しました", type: "success" });
    setIsConfirmDialogOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: date,
      dateTo: date,
    }));
    setToast({ message: `${date}の支出を表示します`, type: "success" });
  };

  const handleUpdateExpense = async (id: string, amount: number) => {
    try {
      // Supabaseで支出データを更新
      const success = await supabaseHelpers.updateExpense(id, amount);

      if (success) {
        // ローカル状態も更新
        setExpenses((prev) =>
          prev.map((expense) =>
            expense.id === id ? { ...expense, amount } : expense
          )
        );
        setToast({ message: "支出を更新しました", type: "success" });
      } else {
        setToast({ message: "支出の更新に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      setToast({ message: "支出の更新に失敗しました", type: "error" });
    }
  };

  const handleAddSavingTarget = async (target: SavingTarget) => {
    try {
      // Supabaseに貯金目標を追加
      const success = await supabaseHelpers.addSavingTarget(target);

      if (success) {
        // ローカル状態も更新
        setSavingTargets((prev) => [...prev, target]);
        setToast({ message: "節約目標を追加しました", type: "success" });
      } else {
        setToast({ message: "節約目標の追加に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error adding saving target:", error);
      setToast({ message: "節約目標の追加に失敗しました", type: "error" });
    }
  };

  const handleDeleteSavingTarget = async (category: string) => {
    try {
      // Supabaseから貯金目標を削除
      const success = await supabaseHelpers.deleteSavingTarget(category);

      if (success) {
        // ローカル状態も更新
        setSavingTargets((prev) =>
          prev.filter((target) => target.category !== category)
        );
        setToast({ message: "節約目標を削除しました", type: "success" });
      } else {
        setToast({ message: "節約目標の削除に失敗しました", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting saving target:", error);
      setToast({ message: "節約目標の削除に失敗しました", type: "error" });
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
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
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />

            <Calendar
              expenses={expenses}
              categories={categories}
              onDateSelect={handleDateSelect}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
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

        {activeTab === "search" && (
          <div className="space-y-6">
            <ExpenseFilters
              filters={filters}
              categories={categories}
              onFiltersChange={setFilters}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  ソート
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("date")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortConfig.field === "date"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  日付
                  {sortConfig.field === "date" && (
                    <span>{sortConfig.order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
                <button
                  onClick={() => handleSort("category")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortConfig.field === "category"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  カテゴリ
                  {sortConfig.field === "category" && (
                    <span>{sortConfig.order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
                <button
                  onClick={() => handleSort("amount")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortConfig.field === "amount"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  金額
                  {sortConfig.field === "amount" && (
                    <span>{sortConfig.order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </div>
            </div>

            {(filters.dateFrom ||
              filters.dateTo ||
              filters.category ||
              filters.searchText ||
              filters.year ||
              filters.month) && (
              <>
                <ExpenseList
                  expenses={filteredExpenses}
                  onDeleteExpense={handleDeleteExpense}
                />

                <ExpenseSummary
                  categorySummary={categorySummary}
                  monthlyData={monthlyData}
                  totalAmount={totalAmount}
                  filters={filters}
                  expenses={expenses}
                />
              </>
            )}

            {!(
              filters.dateFrom ||
              filters.dateTo ||
              filters.category ||
              filters.searchText ||
              filters.year ||
              filters.month
            ) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  検索条件を設定して支出データを表示してください。
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "auto-input" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  自動入力機能
                </h3>
                <div className="space-y-4">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    今後機能を追加しますね
                  </p>
                </div>
              </div>
            </div>
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
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="データ削除の確認"
        message={
          "全ての支出データと節約目標データを削除しますか？\nこの操作は取り消せません。"
        }
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

      <ConfirmDialog
        isOpen={isCategoryDeleteDialogOpen}
        title="カテゴリ削除の確認"
        message={
          "この項目には、入力したデータが含まれています。削除するとこの項目のデータは全て削除されます。本当に実行していいですか？"
        }
        confirmLabel="実行"
        cancelLabel="キャンセル"
        onConfirm={() => categoryToDelete && deleteCategory(categoryToDelete)}
        onCancel={cancelCategoryDelete}
        type="warning"
        requireConfirmation={true}
        confirmationText="削除に同意します"
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
