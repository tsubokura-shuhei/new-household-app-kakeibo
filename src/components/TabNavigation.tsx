import React from "react";
import { BookOpen, Target, Search, Sparkles } from "lucide-react";

type TabId = "expenses" | "targets" | "search" | "auto-input";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 mb-6">
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <button
            onClick={() => onTabChange("expenses")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "expenses"
                ? "bg-primary-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">家計簿</span>
          </button>

          <button
            onClick={() => onTabChange("targets")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "targets"
                ? "bg-primary-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">目標金額</span>
          </button>
        </div>

        <div className="flex">
          <button
            onClick={() => onTabChange("search")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "search"
                ? "bg-primary-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">検索</span>
          </button>

          <button
            onClick={() => onTabChange("auto-input")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "auto-input"
                ? "bg-primary-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">自動入力</span>
          </button>
        </div>
      </div>
    </div>
  );
}
