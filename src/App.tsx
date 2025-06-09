import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { CategoryManager } from './components/CategoryManager';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { Expense, Category, ExpenseFilters as ExpenseFiltersType } from './types';
import {
  defaultCategories,
  filterExpenses,
  generateCategorySummary,
  generateMonthlyData,
  exportToCSV,
  generateId
} from './utils/dataHelpers';

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    'categories',
    defaultCategories.map(cat => ({ ...cat, id: generateId() }))
  );
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    dateFrom: '',
    dateTo: '',
    category: '',
    searchText: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDark, setIsDark] = useDarkMode();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
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

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: new Date()
    };
    setExpenses(prev => [...prev, newExpense]);
    setToast({ message: '支出を登録しました', type: 'success' });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    setToast({ message: '支出を削除しました', type: 'success' });
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    const existingCategory = categories.find(cat => cat.name === categoryData.name);
    if (existingCategory) {
      setToast({ message: 'そのカテゴリは既に存在します', type: 'error' });
      return;
    }
    
    const newCategory: Category = {
      ...categoryData,
      id: generateId()
    };
    setCategories(prev => [...prev, newCategory]);
    setToast({ message: 'カテゴリを追加しました', type: 'success' });
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (!categoryToDelete) return;

    // Check if category is used in any expenses
    const isUsed = expenses.some(expense => expense.category === categoryToDelete.name);
    if (isUsed) {
      setToast({ 
        message: 'このカテゴリは支出で使用されているため削除できません', 
        type: 'error' 
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== id));
    setToast({ message: 'カテゴリを削除しました', type: 'success' });
  };

  const handleExportData = () => {
    if (expenses.length === 0) {
      setToast({ message: 'エクスポートするデータがありません', type: 'error' });
      return;
    }
    exportToCSV(expenses);
    setToast({ message: 'データをエクスポートしました', type: 'success' });
  };

  const handleClearAllData = () => {
    if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
      setExpenses([]);
      setCategories(defaultCategories.map(cat => ({ ...cat, id: generateId() })));
      setFilters({ dateFrom: '', dateTo: '', category: '', searchText: '' });
      setToast({ message: '全てのデータを削除しました', type: 'success' });
    }
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
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <ExpenseForm
              categories={categories}
              onAddExpense={handleAddExpense}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
            />
            
            <ExpenseFilters
              filters={filters}
              categories={categories}
              onFiltersChange={setFilters}
            />
            
            <ExpenseList
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
          
          <div>
            <ExpenseSummary
              categorySummary={categorySummary}
              monthlyData={monthlyData}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
      
      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
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