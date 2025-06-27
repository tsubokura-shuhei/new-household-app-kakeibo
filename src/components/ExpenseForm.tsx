import React, { useState } from "react";
import { Plus, Settings, ChevronDown } from "lucide-react";
import { Category } from "../types";

interface ExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: {
    date: string;
    category: string;
    amount: number;
    memo: string;
    type: "income" | "expense";
  }) => void;
  onAddCategory: (category: Omit<Category, "id">) => void;
  onOpenCategoryManager: () => void;
  selectedType: "income" | "expense";
  setSelectedType: (type: "income" | "expense") => void;
}

export function ExpenseForm({
  categories,
  onAddExpense,
  onAddCategory,
  onOpenCategoryManager,
  selectedType,
  setSelectedType,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
    memo: "",
    type: selectedType,
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    onAddExpense({
      date: formData.date,
      category: formData.category,
      amount: amount,
      memo: formData.memo,
      type: formData.type,
    });

    setFormData((prev) => ({
      ...prev,
      category: "",
      amount: "",
      memo: "",
    }));
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory({
      name: newCategoryName.trim(),
      color: "#3B82F6",
      isDefault: false,
      type: formData.type,
    });

    setNewCategoryName("");
    setShowNewCategory(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const halfWidthValue = e.target.value.replace(/[０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    const numericValue = halfWidthValue.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({ ...prev, amount: numericValue }));
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: "",
    }));
    setSelectedType(type);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary-500" />
        収支を記録
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日付
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              収支
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) =>
                  handleTypeChange(e.target.value as "income" | "expense")
                }
                className={`appearance-none w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors text-lg font-bold ${
                  selectedType === "expense"
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
                required
              >
                <option value="expense">支出</option>
                <option value="income">収入</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="w-6 h-6 text-black" strokeWidth={3} />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              カテゴリ
            </label>
            <div className="flex gap-2">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                required
              >
                <option value="">カテゴリを選択</option>
                {categories
                  .filter((category) => category.type === formData.type)
                  .map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(!showNewCategory)}
                className="px-3 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                title="新しいカテゴリを追加"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenCategoryManager}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="カテゴリ管理"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {showNewCategory && (
              <div className="mt-2 flex flex-col sm:flex-row gap-2 animate-slide-up">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="新しいカテゴリ名"
                  className="flex-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddNewCategory())
                  }
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="w-full sm:w-auto px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  追加
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              金額
            </label>
            <input
              type="text"
              value={formData.amount}
              onChange={handleAmountChange}
              placeholder="金額を入力"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            メモ
          </label>
          <input
            type="text"
            value={formData.memo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, memo: e.target.value }))
            }
            placeholder="メモを入力（任意）"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
