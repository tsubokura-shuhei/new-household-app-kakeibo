import React from "react";
import { BookOpen, Target } from "lucide-react";

type TabId = "expenses" | "targets";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 mb-6">
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
    </div>
  );
}
