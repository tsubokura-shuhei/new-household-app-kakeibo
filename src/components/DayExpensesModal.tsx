import React, { useState } from "react";
import { X, Edit, Trash2, Check } from "lucide-react";
import { Expense, Category } from "../types";

interface DayExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  expenses: Expense[];
  categories: Category[];
  onUpdateExpense: (id: string, amount: number) => void;
  onDeleteExpense: (id: string) => void;
}

export function DayExpensesModal({
  isOpen,
  onClose,
  date,
  expenses,
  categories,
  onUpdateExpense,
  onDeleteExpense,
}: DayExpensesModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 金額のフォーマット
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP").format(amount) + "円";
  };

  // カテゴリーの色を取得
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : "#9CA3AF"; // デフォルト色
  };

  // 編集モードの開始
  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
  };

  // 編集の保存
  const saveEdit = (id: string) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateExpense(id, amount);
      setEditingId(null);
    }
  };

  // 編集のキャンセル
  const cancelEdit = () => {
    setEditingId(null);
  };

  // 削除の確認モーダルを開く
  const openConfirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };
  // 削除の実行
  const handleDelete = () => {
    if (confirmDeleteId) {
      onDeleteExpense(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };
  // モーダルを閉じる
  const closeConfirmDelete = () => {
    setConfirmDeleteId(null);
  };

  // 金額入力の処理（半角変換）
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 全角数字を半角に変換
    const halfWidthValue = e.target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    // 数字と小数点のみ許可
    const numericValue = halfWidthValue.replace(/[^0-9.]/g, "");
    setEditAmount(numericValue);
  };

  // 合計金額の計算
  // const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            {formatDate(date)}の支出
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[50vh] p-4">
          {expenses.length > 0 ? (
            <>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className={`p-3 rounded-lg ${
                      expense.type === "income"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-orange-50 dark:bg-orange-900/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(expense.category),
                          }}
                        />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {expense.category}
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            expense.type === "income"
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-400"
                          }`}
                        >
                          {expense.type === "income" ? "収入" : "支出"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openConfirmDelete(expense.id)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expense.memo && (
                      <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                        {expense.memo}
                      </p>
                    )}

                    {editingId === expense.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editAmount}
                          onChange={handleAmountChange}
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors text-right"
                          autoFocus
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          円
                        </span>
                        <button
                          onClick={() => saveEdit(expense.id)}
                          className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-full transition-colors"
                          title="保存"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          title="キャンセル"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditing(expense)}
                          className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          title="編集"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <p
                          className={`font-bold ${
                            expense.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-orange-500 dark:text-orange-400"
                          }`}
                        >
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2">
                {totalIncome > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: "#16A34A" }}>
                      収入合計
                    </span>
                    <span className="font-bold" style={{ color: "#16A34A" }}>
                      {formatCurrency(totalIncome)}
                    </span>
                  </div>
                )}
                {totalExpense > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: "#F97316" }}>
                      支出合計
                    </span>
                    <span className="font-bold" style={{ color: "#F97316" }}>
                      {formatCurrency(totalExpense)}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              この日の支出データはありません
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full">
            <h2 className="text-lg font-bold mb-3 text-gray-800">削除の確認</h2>
            <p className="mb-6 text-gray-700">
              この収支記録を削除してもよろしいですか？
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeConfirmDelete}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
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
