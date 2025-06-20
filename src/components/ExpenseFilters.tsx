import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { ExpenseFilters as ExpenseFiltersType, Category } from "../types";

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  categories: Category[];
  onFiltersChange: (filters: ExpenseFiltersType) => void;
}

export function ExpenseFilters({
  filters,
  categories,
  onFiltersChange,
}: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 年月が選択されている場合のフラグ
  const yearMonthSelected = !!(filters.year && filters.month);
  // 日付範囲が選択されている場合のフラグ
  const dateRangeSelected = !!(filters.dateFrom || filters.dateTo);

  // 年月が選択された場合、日付範囲をクリア
  useEffect(() => {
    if (yearMonthSelected && dateRangeSelected) {
      onFiltersChange({
        ...filters,
        dateFrom: "",
        dateTo: "",
      });
    }
  }, [filters.year, filters.month]);

  // 日付範囲が選択された場合、年月をクリア
  useEffect(() => {
    if (dateRangeSelected && yearMonthSelected) {
      onFiltersChange({
        ...filters,
        year: "",
        month: "",
      });
    }
  }, [filters.dateFrom, filters.dateTo]);

  const handleFilterChange = (key: keyof ExpenseFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateFrom: "",
      dateTo: "",
      category: "",
      searchText: "",
      year: "",
      month: "",
    });
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.category ||
    filters.searchText ||
    filters.year ||
    filters.month;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          検索・フィルター
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isExpanded ? "閉じる" : "詳細"}
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => handleFilterChange("searchText", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="メモで検索..."
          />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                年
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                disabled={dateRangeSelected}
              >
                <option value="">選択してください</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                月
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                disabled={dateRangeSelected || !filters.year}
              >
                <option value="">選択してください</option>
                {months.map((month) => (
                  <option key={month} value={month.toString()}>
                    {month}月
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                disabled={yearMonthSelected}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                終了日
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                disabled={yearMonthSelected}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              カテゴリ
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            >
              <option value="">全てのカテゴリ</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                フィルターをクリア
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
