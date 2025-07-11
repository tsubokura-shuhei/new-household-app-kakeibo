import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Settings,
  Palette,
  Edit2,
  Check,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Category } from "../types";
import { ColorPalette } from "./ColorPalette";

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (
    id: string,
    updatedData: Partial<Omit<Category, "id">>
  ) => void;
  isOpen: boolean;
  onClose: () => void;
  selectedType: "income" | "expense";
  setSelectedType: (type: "income" | "expense") => void;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  isOpen,
  onClose,
  selectedType,
  setSelectedType,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6"); // デフォルトの色
  const newCategoryType = selectedType;
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  // 編集中のカテゴリ名
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");
  // 名前編集モード
  const [nameEditMode, setNameEditMode] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      isDefault: false,
      type: newCategoryType,
    });

    setNewCategoryName("");
    setNewCategoryColor("#3B82F6");
    setSelectedType("expense");
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      onDeleteCategory(categoryId);
    }
  };

  const handleColorChange = (categoryId: string, newColor: string) => {
    onUpdateCategory(categoryId, { color: newColor });
    setEditingCategoryId(null); // 色選択を閉じる
  };

  const openColorPalette = (categoryId: string | "new") => {
    setEditingCategoryId(categoryId);
  };

  // カテゴリ名の編集モードを開始
  const startEditName = (category: Category) => {
    setNameEditMode(category.id);
    setEditingCategoryName(category.name);
  };

  // カテゴリ名の編集を保存
  const saveEditName = (categoryId: string) => {
    if (editingCategoryName.trim()) {
      onUpdateCategory(categoryId, { name: editingCategoryName.trim() });
      setNameEditMode(null);
    }
  };

  // カテゴリ名の編集をキャンセル
  const cancelEditName = () => {
    setNameEditMode(null);
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setSelectedType(type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-500" />
            カテゴリ管理
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Add new category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新しいカテゴリを追加
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="カテゴリ名を入力"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
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
                >
                  <option value="expense">支出</option>
                  <option value="income">収入</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown className="w-6 h-6 text-black" strokeWidth={3} />
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 h-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="色を選択"
                  onClick={() => openColorPalette("new")}
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: newCategoryColor }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    色を選択
                  </span>
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  追加
                </button>
              </div>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              既存のカテゴリ
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: category.color }}
                      onClick={() => openColorPalette(category.id)}
                      title="色を変更"
                    >
                      <Palette className="w-3 h-3 text-white opacity-0 hover:opacity-100" />
                    </button>

                    {nameEditMode === category.id ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                          className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveEditName(category.id)
                          }
                        />
                        <button
                          onClick={() => saveEditName(category.id)}
                          className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="保存"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditName}
                          className="p-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded transition-colors"
                          title="キャンセル"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-800 dark:text-white">
                        {category.name}
                      </span>
                    )}

                    {category.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        デフォルト
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {!category.isDefault && nameEditMode !== category.id && (
                      <button
                        onClick={() => startEditName(category)}
                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors mr-1"
                        title="編集"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

      {/* カラーパレットモーダル */}
      {editingCategoryId && (
        <ColorPalette
          currentColor={
            editingCategoryId === "new"
              ? newCategoryColor
              : categories.find((c) => c.id === editingCategoryId)?.color ||
                "#3B82F6"
          }
          onColorSelect={(color) => {
            if (editingCategoryId === "new") {
              setNewCategoryColor(color);
            } else {
              handleColorChange(editingCategoryId, color);
            }
            setEditingCategoryId(null);
          }}
          onClose={() => setEditingCategoryId(null)}
        />
      )}
    </div>
  );
}
