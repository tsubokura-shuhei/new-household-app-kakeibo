import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { ExpenseSummary as ExpenseSummaryType, MonthlyData } from '../types';

interface ExpenseSummaryProps {
  categorySummary: ExpenseSummaryType[];
  monthlyData: MonthlyData[];
  totalAmount: number;
}

export function ExpenseSummary({ categorySummary, monthlyData, totalAmount }: ExpenseSummaryProps) {
  const [activeTab, setActiveTab] = useState<'category' | 'monthly'>('category');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-white">{label}</p>
          <p className="text-primary-600 dark:text-primary-400">
            金額: ¥{formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          支出サマリー
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">合計支出</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ¥{formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('category')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'category'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          カテゴリ別
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'monthly'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          月別
        </button>
      </div>

      {activeTab === 'category' && categorySummary.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`¥${formatCurrency(value)}`, '金額']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {categorySummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({item.count}件)
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  ¥{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'monthly' && monthlyData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" tickFormatter={(value) => `¥${formatCurrency(value)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {((activeTab === 'category' && categorySummary.length === 0) || 
        (activeTab === 'monthly' && monthlyData.length === 0)) && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>データがありません</p>
        </div>
      )}
    </div>
  );
}