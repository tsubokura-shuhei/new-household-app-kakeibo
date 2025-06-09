import React from 'react';
import { Trash2, Calendar, Tag, FileText, Pen as Yen } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Yen className="w-12 h-12 mx-auto mb-2" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          まだ支出が記録されていません
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          支出一覧 ({expenses.length}件)
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(expense.date)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Tag className="w-4 h-4 text-primary-500" />
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {expense.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    ¥{formatCurrency(expense.amount)}
                  </div>
                  {expense.memo && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{expense.memo}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                title="削除"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}