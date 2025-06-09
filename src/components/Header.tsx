import React from 'react';
import { Moon, Sun, Download, Trash2 } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onExportData: () => void;
  onClearAllData: () => void;
}

export function Header({ isDark, onToggleDark, onExportData, onClearAllData }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            家計籠
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            シンプルな家計管理アプリ
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-3 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium"
            title="CSVエクスポート"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">エクスポート</span>
          </button>
          
          <button
            onClick={onClearAllData}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            title="全データ削除"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">全削除</span>
          </button>
          
          <button
            onClick={onToggleDark}
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isDark ? 'ライトモード' : 'ダークモード'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}