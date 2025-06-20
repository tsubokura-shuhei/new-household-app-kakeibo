import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Expense } from "../types";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete);
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setExpenseToDelete(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount) + "円";
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">まだ記録がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {expense.date}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  expense.type === "expense"
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {expense.type === "expense" ? "支出" : "収入"}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {expense.category}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {expense.memo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-lg font-bold ${
                expense.type === "expense"
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-green-500 dark:text-green-400"
              }`}
            >
              {expense.type === "expense" ? "-" : "+"}
              {formatCurrency(expense.amount)}
            </span>
            <button
              onClick={() => handleDeleteClick(expense.id)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
              title="削除"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      ))}

      {/* 削除確認モーダル */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              削除の確認
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              この収支記録を削除してもよろしいですか？
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
